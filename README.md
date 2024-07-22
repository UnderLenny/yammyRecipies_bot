# YummyRecipies_bot

## Описание

YummyRecipies_bot - это Telegram бот, написанный на Node.js с использованием TypeScript, библиотеки Telegraf для взаимодействия с Telegram API и Axios для выполнения HTTP-запросов. Бот предлагает рецепты на основе указанных ингредиентов, используя ИИ для рекомендаций. Просто введите ингредиент, и бот предоставит список блюд, которые можно приготовить. Рецепты предоставляются с помощью сервиса Gigachat.

## Установка и настройка

### Предварительные требования

Перед установкой убедитесь, что на вашем компьютере установлены следующие программы:

- [Node.js](https://nodejs.org/) (рекомендуется версия 14.x или выше)
- [Yarn](https://classic.yarnpkg.com/) (рекомендуется версия 1.x)

### Установка

1. Склонируйте репозиторий:

    ```bash
    git clone https://github.com/yourusername/yummyRecipies_bot.git
    cd yummyRecipies_bot
    ```

2. Установите зависимости с помощью Yarn:

    ```bash
    yarn install
    ```

### Настройка

1. Создайте файл `.env` в корневой директории проекта и добавьте следующие переменные:

    ```plaintext
    BOT_TOKEN=your_telegram_bot_token
    GIGACHAT_API_KEY=your_gigachat_api_key
    GIGACHAT_TOKEN=your-gigachat_authtoken
    GIGACHAT_URL=https://gigachat.devices.sberbank.ru/api/v1
    SCOPE=GIGACHAT_API_PERS
    ```

2. Запустите бота:

    ```bash
    yarn start
    ```

## Использование

1. Запустите Telegram и найдите вашего бота.
2. Начните чат с ботом, отправив команду `/start`.
3. Введите ингредиент, и бот предоставит вам список блюд, которые можно приготовить.

## Технологии

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Telegraf](https://telegraf.js.org/)
- [Axios](https://axios-http.com/)
- [Gigachat API](https://gigachat.com/)

## Вклад

Если вы хотите внести вклад в проект, пожалуйста, следуйте этим шагам:

1. Склонируйте репозиторий.
2. Создайте ветку для ваших изменений (`git checkout -b feature/amazing-feature`).
3. Внесите изменения и закоммитьте их (`git commit -m 'Add some amazing feature'`).
4. Отправьте вашу ветку (`git push origin feature/amazing-feature`).
5. Создайте Pull Request.

## Лицензия

Этот проект лицензирован под MIT License.
