
# mern-boilerplate
Mern Stack Boilerplate code, just starting code with express api routes & pre defined mongoose connection and user model with jwt authentication and react view

This is a boilerplate project using the following technologies:
- [React](https://facebook.github.io/react/) and [React Router](https://reacttraining.com/react-router/) for the frontend
- [Create-React-App](https://github.com/facebook/create-react-app) for react to get started immediately, ou don’t need to install or configure tools like Webpack or Babel. They are preconfigured and hidden so that you can focus on the code. 
- [Express](http://expressjs.com/) with [PassportJS](http://passportjs.com/) and [Mongoose](http://mongoosejs.com/) for the backend

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