
# Sarah-Bot
Sarah will be facebook groups management bot that will moderate content and detect spam and help admins have better group community,

## Requirements
- [Node.js](https://nodejs.org/en/) 6+
- [Mongo](https://www.mongodb.com/)

```shell
npm install && npm install --prefix client
```

## Running

Modify config file relative to the enviroment, by default in the local enviroment is in `defaults.json` make sure to have mongodb as the monogodb url See the example there for more details.

Production mode:

```shell
npm start
```

Development (Webpack dev server) mode:

```shell
npm run dev
```
