const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {

        const { name, owner } = github.context.payload.repository;

        const octokit = github.getOctokit(process.env.GITHUB_TOKEN,)

        const { data } = await octokit.repos.listBranches({
            owner: owner.name,
            repo: name,
            protected: false,
        });

         console.log('----->>>', JSON.stringify(data, null, 2))

        for (let branch in data) {
            let info = await octokit.repos.getBranch({
                owner: owner.name,
                repo: name,
                branch: branch.name,
            })
            console.log('!!!!', info);
        }

    } catch (error) {
        core.setFailed(error.message);
    }
})()