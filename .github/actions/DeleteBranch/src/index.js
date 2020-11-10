const core = require('@actions/core');
const _http = require('@actions/http-client');

const api = require('./api');
const { createNotificationBody } = require('./utils');

(async () => {
    try {
        api.getBranches().then(async (branches) => {
                console.log(JSON.stringify(branches, null, 2));

                const http = new _http.HttpClient();
                await http.post(
                    process.env.SLACK_HOOK_URL,
                    JSON.stringify(
                        createNotificationBody(branches, '28/12/12')
                    )
                );
            })

    } catch (error) {
        core.setFailed(error.message);
    }
})()