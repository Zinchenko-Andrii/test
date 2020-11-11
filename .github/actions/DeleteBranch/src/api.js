const github = require('@actions/github');

const { checkIsOutDated } = require('./utils');


class API {
    constructor() {
        const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

        this.defaultCreds = { owner, repo };
        this.octokit = github.getOctokit(process.env.GITHUB_TOKEN);
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

    deleteBranch = (name) => (
        this.octokit.git.deleteRef({
            ...this.defaultCreds,
            ref: `heads/${name}`
        })
    )

    deleteBranchList = (list) => (
        Promise.all(
            list.reduce((acc, { name }) => (
                [ ...acc, this.deleteBranch(name) ]
            ), [])
        )
    )
}

const api = new API();

module.exports = api;