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
            const branchInfoList = [];
            data.forEach((branch) => {
                branchInfoList.push(
                    octokit.repos.getBranch({
                        owner: owner.name,
                        repo: name,
                        branch: branch.name,
                    })
                )
            });
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
            // for (let branch of data) {
            //     octokit.repos.getBranch({
            //         owner: owner.name,
            //         repo: name,
            //         branch: branch.name,
            //     }).then(({ data }) => {
            //         const { name, commit: { commit: { author, committer}} } = data;
            //         console.log(JSON.stringify({
            //             name,
            //             author,
            //             committer
            //         }, null, 2))
            //     })
            // }
        })
    } catch (error) {
        core.setFailed(error.message);
    }
})()