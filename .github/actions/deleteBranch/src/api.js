const github = require('@actions/github');

const { checkIsOutDated } = require('./utils');

class API {
  constructor() {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

    this.defaultCreds = { owner, repo };
    this.octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  }

  getBranchList() {
    const params = { ...this.defaultCreds, protected: false };
    return this.octokit.repos.listBranches(params).then(({ data }) => data);
  }

  getBranchInfo(name) {
    return (
      this.octokit.repos.getBranch({
        ...this.defaultCreds,
        branch: name,
      })
    );
  }

  getBranchesInfoList(list) {
    return (
      Promise.all(
        list.reduce((acc, { name }) => (
          [...acc, this.getBranchInfo(name)]
        ), []),
      )
    );
  }

  // eslint-disable-next-line class-methods-use-this
  parseBranchesList(list) {
    return (
      list.reduce((acc, { data }) => {
        const { name, commit: { commit: { author, committer } } } = data;

        const isOutDated = checkIsOutDated([author.date, committer.date]);
        if (isOutDated) {
          return ([...acc, { name, author, committer, isOutDated }]);
        }
        return acc;
      }, [])
    );
  }

  getBranches() {
    return (
      this.getBranchList()
        .then((list) => (this.getBranchesInfoList(list)))
        .then((list) => (this.parseBranchesList(list)))
    );
  }

  deleteBranch(name) {
    return (
      this.octokit.git.deleteRef({
        ...this.defaultCreds,
        ref: `heads/${name}`,
      })
    );
  }

  deleteBranchList(list) {
    return (
      Promise.all(
        list.reduce((acc, { name }) => (
          [...acc, this.deleteBranch(name)]
        ), []),
      )
    );
  }
}

const api = new API();

module.exports = api;
