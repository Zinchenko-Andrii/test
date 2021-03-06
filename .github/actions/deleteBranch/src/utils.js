const { DELETE_DAY } = require('./constants');


const threeMouthBefore = new Date(
    new Date().setMonth(new Date().getMonth() - 3)
);

const getNextDayOfWeek = (date, dayOfWeek) => {
    let resultDate = new Date(date.getTime());

    resultDate.setDate(date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7));

    return resultDate;
};

const getUTCDate = (date) => {
    return new Date(date.setHours(0, 0, 0, 0));
};

const checkIsOutDated = (dates) => {
    return dates.reduce(
        (isOutDated, date) =>
            isOutDated ||
            getUTCDate(new Date(date), DELETE_DAY) <
            getUTCDate(getNextDayOfWeek(threeMouthBefore, DELETE_DAY)),
        true
    );
};

const createNotificationBody = (branches, isDeleteNotification) => {
    const body = {
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": '@channel'
                }
            },
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": isDeleteNotification ? (
                        `:fire: Next branches was deleted :fire:`
                    ) : (
                        `:fire: Next branches will be deleted on ${getNextDayOfWeek(new Date(), DELETE_DAY).toLocaleDateString()} at 00:00 :fire:`
                    ),
                }
            },
            {
                "type": "divider"
            },
        ],
    };

    branches.forEach((branch) => {
        if (branch.isOutDated) {
            // main section
            body.blocks.push(
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `*\`${branch.name}\`*`
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `Created by \`${branch.author.name}\` (\`${branch.author.email}\`)`
                    }
                },
            )
            // if author !== last commiter
            if (branch.author.name !== branch.committer.name) {
                body.blocks.push(
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `Last commited by \`${branch.committer.name}\` (\`${branch.committer.email}\`)`
                        }
                    }
                )
            }
            // divider
            body.blocks.push(
                {
                    "type": "divider"
                }
            )
        }
    })

    return body;

}

module.exports.checkIsOutDated = checkIsOutDated;
module.exports.createNotificationBody = createNotificationBody;