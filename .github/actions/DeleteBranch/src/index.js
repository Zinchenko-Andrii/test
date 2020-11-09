const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {
        const { name, owner } = github.context.payload.repository;
        const defaultCreds = { owner: owner.name, repo: name };
        const octokit = github.getOctokit(process.env.GITHUB_TOKEN)

        const getBranch = (name) => (octokit.repos.getBranch({
            ...defaultCreds,
            branch: name,
        }))

        octokit.repos.listBranches({ ...defaultCreds, protected: false,})
            .then(({ data }) => {
                const branchInfoList = data.reduce((acc, { name }) => (
                    [...acc, getBranch(name)]
                ), []);

                Promise.all(branchInfoList).then((list) => {
                    list = list.map(({ data }) => {
                        const { name, commit: { commit: { author, committer}} } = data;
                        return ({
                            name,
                            author,
                            committer
                        })
                    });

                    console.log(JSON.stringify(list, null, 2));
                })
            })
    } catch (error) {
        core.setFailed(error.message);
    }
})()