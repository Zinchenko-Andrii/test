const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {

        const { name, owner } = github.context.payload.repository;
        // const responce = await github.getOctokit(process.env.GITHUB_TOKEN).request(`${repository.url}/branches`);

        console.log('->>>', name);
        console.log('->>>', owner.name);

            const octokit = github.getOctokit(process.env.GITHUB_TOKEN)
        const { data } = await octokit.repos.listBranches({
            owner: 'Zinchenko-Andrii',
            repo: 'test',
        });

         console.log('----->>>', JSON.stringify(data, null, 2))

    } catch (error) {
        core.setFailed(error.message);
    }
})()