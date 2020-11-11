const github = require('@actions/github');

const { checkIsOutDated } = require('./utils');


class API {
    constructor() {
        const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

        this.defaultCreds = { owner, repo };
        this.octokit = github.getOctokit(process.env.GITHUB_TOKEN);
    }

    deleteBranch(name) {
        return (
            this.octokit.git.deleteRef({
                ...github.context.repo,
                ref: `heads/${name}`
            })
        )
    }

    getBranchList = () => {
        const params = { ...this.defaultCreds, protected: false };
        return this.octokit.repos.listBranches(params).then(({ data }) => data);
    }

    getBranchInfo = (name) => (
        this.octokit.repos.getBranch({
            ...this.defaultCreds,
            branch: name,
        })
    )

    getBranchesInfoList = (list) => (
        Promise.all(
            list.reduce((acc, { name }) => (
                [ ...acc, this.getBranchInfo(name) ]
            ), [])
        )
    )

    parseBranchesList = (list) => (
        list.reduce((acc, { data }) => {
            const { name, commit: { commit: { author, committer}} } = data;

            let isOutDated = checkIsOutDated([author.date,committer.date]);
            if (isOutDated) {
                return ([ ...acc, { name, author, committer, isOutDated } ])
            }
            return acc;
        }, [])
    )

    getBranches = () => (
        this.getBranchList()
            .then(this.getBranchesInfoList)
            .then(this.parseBranchesList)
    )
}

const api = new API();

module.exports = api;