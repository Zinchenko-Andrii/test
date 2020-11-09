const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {
        // const responce = await github.getOctokit(process.env.GITHUB_TOKEN).request(`${repository.url}/branches`);
        console.log('----->>>', JSON.stringify(github, null, 2))

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