const FBMessenger = require('fb-messenger');
const config = require('config');
const log = require('npmlog');
const request = require('request');

const token = config.get('facebookAccessToken');

const messenger = new FBMessenger({ token });

class Messenger {
  constructor() {
    this.token = token;
    this.messenger = messenger;
    this.caller = () => true;
  }

  // eslint-disable-next-line class-methods-use-this
  firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
  }

  // eslint-disable-next-line class-methods-use-this
  sendTextsInOrder(id, texts, s) {
    return new Promise((resolve, reject) => {
      const seconds = s * 1000 || 0;
      log.info('the damn received', id);
      texts.forEach(async (text, index) => {
        const intervalStart = index + 1;
        log.info('the user ', id);
        // eslint-disable-next-line no-shadow
        setTimeout(
          (id, text, intervalStart) => {
            log.info('the recipient ', id, text, index);
            // eslint-disable-next-line no-use-before-define
            sendTypingOn(id);
            setTimeout(
              (id, text) => {
                if (index == texts.length - 1) {
                  messenger.sendTextMessage({ id, text }).then(resolve);
                  return sendTypingOff(id);
                }
                messenger.sendTextMessage({ id, text });
                sendTypingOff(id);
                // eslint-disable-next-line no-use-before-define
              },
              intervalStart * seconds,
              id,
              text
            );
          },
          intervalStart * seconds + 1000,
          id,
          text,
          intervalStart,
        );
      });
    });
  }

  sendTextMessage(id, text) {
    return messenger.sendTextMessage({ id, text });
  }

  sendQuickRepliesMessage(id, text, quickReplies) {
    console.log('sending gfreeting with text', text);
    return messenger.sendQuickRepliesMessage({
      id,
      attachment: text,
      quickReplies,
    });
  }
  // CallsendAPI for messages
}

// eslint-disable-next-line class-methods-use-this
function callSendAPI(messageData) {
  return new Promise((resolve, reject) => {
    request(
      {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
          access_token: token
        },
        method: 'POST',
        json: messageData
      },
      (error, response) => {
        if (error) {
          log.error('Error sending messages: ', error);
          reject(error);
        } else if (response.body.error) {
          log.error('Error: ', response.body.error);
          reject(response.body.error);
        } else {
          resolve(response.body);
        }
      }
    );
  });
}

// eslint-disable-next-line class-methods-use-this
function sendTypingOn(recipientId) {
  log.info('Turning typing indicator on');
  const messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: 'typing_on'
  };
  return callSendAPI(messageData);
}

function sendTypingOff(recipientId) {
  log.info('Turning typing indicator off');
  const messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: 'typing_off'
  };
  return callSendAPI(messageData);
}
module.exports = {
  messengerService: new Messenger(),
  callSendAPI
};
