const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {

        const { name, owner } = github.context.payload.repository;

        const octokit = github.getOctokit(process.env.GITHUB_TOKEN,)

        octokit.repos.listBranches({
            owner: owner.name,
            repo: name,
            protected: false,
        }).then(({ data }) => {
            for (let branch of data) {
                octokit.repos.getBranch({
                    owner: owner.name,
                    repo: name,
                    branch: branch.name,
                }).then(({ data }) => {
                    console.log(JSON.stringify(data, null, 2))
                })
            }
        })
    } catch (error) {
        core.setFailed(error.message);
    }
})()