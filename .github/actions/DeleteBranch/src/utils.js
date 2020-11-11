
const DELETE_DAY = 3;
const NOTIFY_DAY = 1;

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
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": isDeleteNotification ? (
                        `:fire: @here Next branches was deleted :fire:`
                    ) : (
                        `:fire: @here Next branches will be deleted on ${getNextDayOfWeek(new Date(), DELETE_DAY).toLocaleDateString()} at 00:00 :fire:`
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
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `Last commited by \`${branch.committer.name}\` (\`${branch.committer.email}\`)`
                    }
                },
                {
                    "type": "divider"
                }
            )
        }
    })

    return body;

}


module.exports.DELETE_DAY = DELETE_DAY;
module.exports.NOTIFY_DAY = NOTIFY_DAY;
module.exports.checkIsOutDated = checkIsOutDated;
module.exports.createNotificationBody = createNotificationBody;