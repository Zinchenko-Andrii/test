const core = require('@actions/core');
const _http = require('@actions/http-client');

const api = require('./api');
const { createNotificationBody } = require('./utils');

(async () => {
    try {
        const branches = await api.getBranches();

        console.log(JSON.stringify(branches, null, 2))
        if (branches.length) {
            const http = new _http.HttpClient();
            await http.post(
                process.env.SLACK_HOOK_URL,
                JSON.stringify(
                    createNotificationBody(branches)
                )
            );
        }

    } catch (error) {
        core.setFailed(error.message);
    }
})()