const core = require('@actions/core');
const github = require('@actions/github');

class API {
    constructor() {
        const { name, owner } = github.context.payload.repository;

        this.octokit = github.getOctokit(process.env.GITHUB_TOKEN);
        this.defaultCreds = { owner: owner.name, repo: name };
    }

    deleteBranch(name) {
        return (
            this.octokit.git.deleteRef({
                ...github.context.repo,
                ref: `heads/${name}`
            })
        )
    }

    getBranchList() {
        const params = { ...this.defaultCreds, protected: false };
        return this.octokit.repos.listBranches(params).then(({ data }) => data);
    }

    getBranchInfo(name) {
        return (
            this.octokit.repos.getBranch({
                ...this.defaultCreds,
                branch: name,
            })
        )
    }

    getBranchesInfo(list) {
        return Promise.all(
            list.reduce((acc, { name }) => (
                [ ...acc, this.getBranchInfo(name) ]
            ), [])
        )
    }
}

(async () => {
    try {
        const api = new API();

        api.getBranchList()
            .then(api.getBranchesInfo)
            .then((list) => {
                const branches = list.reduce((acc, { data }) => {
                    const { name, commit: { commit: { author, committer}} } = data;
                    return ([ ...acc, { name, author, committer } ])
                }, [])

                console.log(JSON.stringify(branches, null, 2));
            })

        // octokit.repos.listBranches({ ...defaultCreds, protected: false,})
        //     .then(({ data }) => {
        //         api.getBranchesInfo(data).then((list) => {
        //             const branches = list.reduce((acc, { data }) => {
        //                 const { name, commit: { commit: { author, committer}} } = data;
        //                 return ([ ...acc, { name, author, committer } ])
        //             }, [])
        //
        //             console.log(JSON.stringify(branches, null, 2));
        //         })
        //     })
    } catch (error) {
        core.setFailed(error.message);
    }
})()