const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {
        const octokit = github.getOctokit(process.env.GITHUB_TOKEN)
        // console.log('----->>>',myToken)
        // console.log('----->>>',JSON.stringify(Object.keys(octokit), null, 2))
        const data = await octokit.repos.listBranches({
            owner: 'Zinchenko-Andrii',
            repo: 'test',
        });


        console.log('----->>>',JSON.stringify(data, null, 2))

    } catch (error) {
        core.setFailed(error.message);
    }
})()