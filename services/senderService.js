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

  static sendConfigurationMessage(user, message, configAction, actions) {
    console.log('sending greeting');
    const text = message;
    const quickReplies = [];
    actions.map((action) =>{
      quickReplies.push({
        content_type: 'text',
        title: action,
        payload: JSON.stringify({ action: configAction })
      })
    })
    messengerService.sendQuickRepliesMessage(user.fbid, text, quickReplies);
  }


  static sendConfidence(user, message) {
    console.log('sending confidence');
    const text = message;
    messengerService.sendTextMessage(user.fbid, text);
  }
  
}

module.exports = SenderService;
