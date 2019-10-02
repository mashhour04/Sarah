const { messengerService } = require('./messenger');
const configConstants = require('./constants/configConstants');

class SenderService {
  static sendGreetingMessage(user) {
    console.log('sending greeting');
    const text = 'Hi';
    const quickReplies = [
      {
        content_type: 'text',
        title: 'Configure Sarah',
        payload: JSON.stringify({ action: configConstants.CONFIGURE_SARAH })
      }
    ];
    messengerService.sendQuickRepliesMessage(user.fbid, text, quickReplies);
  }
}

module.exports = SenderService;
