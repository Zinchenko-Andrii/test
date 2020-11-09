const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {
            const {
                    context: {
                            payload: { repository },
                    },
            } = github;

        console.log('repository', repository);
            const { data } = await github.getOctokit(process.env.GITHUB_TOKEN).request(`${repository.url}/branches`);

            // const octokit = github.getOctokit(process.env.GITHUB_TOKEN)
        // console.log('----->>>',myToken)
        // console.log('----->>>',JSON.stringify(Object.keys(octokit), null, 2))
        // const data = await octokit.repos.listBranches({
        //     owner: 'Zinchenko-Andrii',
        //     repo: 'test',
        // });

        // const { data } = await github.getOctokit(process.env.GITHUB_TOKEN).request('/Zinchenko-Andrii/test/branches');


        console.log('----->>>',JSON.stringify(data, null, 2))

    } catch (error) {
        core.setFailed(error.message);
    }
})()