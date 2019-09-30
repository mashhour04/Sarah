const FBMessenger = require('fb-messenger');
const config = require('config');

const messenger = new FBMessenger({ token, notificationType });

class Bot {
  static async setToken(token) {
    return messenger.setToken(token);
  }

  static sendQuickReplyWithTemplate({ quickReplies, elements, userId }) {
    const attachment = {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements
      }
    };
    const messageData = {
      recipient: {
        id: userId
      },
      message: {
        attachment,
        quick_replies: quickReplies
      }
    };

    return botutils.callSendAPI(messageData);
  }
  
  static callSendAPI(messageData, path = false) {
    return new Promise((resolve, reject) => {
      let url = 'https://graph.facebook.com/v2.6/me/messages';
      if (path) {
        url = url.replace('messages', path);
        url += '?access_token=' + config.get('fb.accessToken');
      }
      request(
        {
          uri: url,
          qs: {
            access_token: config.get('fb.accessToken'),
            appsecret_proof: crypto
              .createHmac('sha256', config.get('fb.appSecret'))
              .update(config.get('fb.accessToken'))
              .digest('hex')
          },
          method: 'POST',
          json: messageData
        },
        (error, response, body) => {
          if (!error && response.statusCode == 200) {
            const messageId = body.message_id;
            resolve(body);
          } else if (body && response.statusCode !== 200) {
            console.error(
              'Failed calling Send API',
              response.statusCode,
              response.statusMessage,
              body.error
            );
            resolve(body);
            // console.error(body.error);
          } else {
            resolve({ error: error.body });
          }
        }
      );
    });
  }
}

module.exports = Bot;
