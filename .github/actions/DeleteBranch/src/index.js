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

    getBranch(name) {
        return (
            this.octokit.repos.getBranch({
                ...this.defaultCreds,
                branch: name,
            })
        )
    }

    getBranchList(list) {
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

        octokit.repos.listBranches({ ...defaultCreds, protected: false,})
            .then(({ data }) => {
                Promise.all(
                    api.getBranchList(data)
                ).then((list) => {
                    const branches = list.reduce((acc, { data }) => {
                        const { name, commit: { commit: { author, committer}} } = data;
                        return ([ ...acc, { name, author, committer } ])
                    }, [])

                    console.log(JSON.stringify(branches, null, 2));
                })
            })
    } catch (error) {
        core.setFailed(error.message);
    }
})()