### Какую проблему раешает?

Автоматизирует процес уведомления разработчиков, в канале `#as-front`, о мерже Pull Request в master ветку.

### Как это работает?

Github action получает ивент, с помощью webhook отправляет сообщение в канал slack через application `Alerts-notification-bot`.<br/>
За одним webhook закреплен определенный slack канал.

### Алгоритм работы

```
Action ('ReleaseNotification')
└── Проверка у ивента полей 'pull_request' и 'pull_request.merge === true'.
    ├──YES-> Добавление в сообщение title с именем Pull Request
    |        └── Входной параметр 'label' (by default = 'release'). Проверяет его наличие в 'labels' ивента
    |            ├──YES-> Проверка наличия тега для текущей ветки
    |            |        ├──YES-> К сообщению в канал дабавлен тег
    |            |        |        └── Сообщение отправлено в канал
    |            |        └──NO-> Сообщение отправлено в канал
    |            └──NO-> Сообщение отправлено в канал
    └──NO-> Сообщение не отправлено
```

### Webhooks list

Вместо `process.env.SLACK_HOOK_URL` можете подставить один из вариантов<br/>
- `#as-front-farch-398` - `https://hooks.slack.com/services/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` - для тестов<br/>
- Webhook для своего канала нужно запросить у devops team через таску в jira.