const core = require('@actions/core');
const github = require('@actions/github');

class API {
    constructor(octokit) {
        const { name, owner } = github.context.payload.repository;

        this.octokit = octokit;
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

    getBranch(name) {
        return (
            this.octokit.repos.getBranch({
                ...this.defaultCreds,
                branch: name,
            })
        )
    }

    getBranchInfo(list) {
        return list.reduce((acc, { name }) => (
            [ ...acc, this.getBranch(name) ]
        ), [])
    }
}

(async () => {
    try {
        const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

        const api = new API(octokit);

        const { name, owner } = github.context.payload.repository;
        const defaultCreds = { owner: owner.name, repo: name };

        // const branchList = api.getBranchList();

        const data = await octokit.gists.createComment({
            gist_id: '123',
            body: 'test message',
        });

        console.log('--->>', data);

        // octokit.repos.listBranches({ ...defaultCreds, protected: false,})
        //     .then(({ data }) => {
        //         Promise.all(
        //             api.getBranchInfo(data)
        //         ).then((list) => {
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