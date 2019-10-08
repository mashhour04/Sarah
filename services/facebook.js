/* eslint-disable max-len */
const login = require('facebook-chat-api');
const log = require('npmlog');
const fs = require('fs');
const path = require('path');

class Facebook {
  constructor() {
    this.api = undefined;
    this.login();
  }

  async login() {
    const options = {
      appState: JSON.parse(fs.readFileSync('config/appstate.json', 'utf8')),
    };

    return new Promise((resolve, reject) => {
      login(options, (err, api) => {
        console.log('error', err, 'and api', api);
        if (err) {
          log.error(err);
          return reject(err);
        }
        // Here you can use the api
        this.api = api;
        resolve(api);
      });
    });
  }

  async sendTextMessage({ text, threadID }) {
    let backup = null;
    const targetId = threadID || '100014261616986';

    try {
      if (!this.api) {
        backup = await this.login();
      }
      console.log('the backup', backup);
      const response = await (this.api) ? this.api.sendMessage(text, targetId) : backup.sendMessage(text, targetId);
      console.log('the response', response);
      log.info('successfully sent message to ', targetId);
      return response;
    } catch (err) {
      log.info('error sending message', err.message);
      return err.message;
    }
  }
}

module.exports = { facebook: new Facebook() };
