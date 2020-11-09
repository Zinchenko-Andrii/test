const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {
        // const responce = await github.getOctokit(process.env.GITHUB_TOKEN).request(`${repository.url}/branches`);
        console.log('----->>>', JSON.stringify(github.payload.repository))

            const octokit = github.getOctokit(process.env.GITHUB_TOKEN)
        const { data } = await octokit.repos.listBranches({
            owner: 'Zinchenko-Andrii',
            repo: 'test',
        });

         console.log('----->>>', data)

    } catch (error) {
        core.setFailed(error.message);
    }
})()