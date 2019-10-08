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

  static sendKeywardsInstruction(user, message, keywards) {
    const text = message;

    const quickReplies = [
      {
        content_type: 'text',
      },
      {
        content_type: 'text',
      }
    ];
    if (keywards == configConstants.GOOD_KEYWARDS) {
      quickReplies[0].payload = JSON.stringify({ action: configConstants.ADD_GOOD_KEYWARDS })
      quickReplies[0].title = 'Add Good Keywards';
      quickReplies[1].payload = JSON.stringify({ action: configConstants.LIST_GOOD_KEYWARDS })
      quickReplies[1].title = 'List Good Keywards';
    }
    else if (keywards == configConstants.BAD_KEYWARDS) {
      quickReplies[0].payload = JSON.stringify({ action: configConstants.ADD_BAD_KEYWARDS })
      quickReplies[0].title = 'Add Bad Keywards';
      quickReplies[1].payload = JSON.stringify({ action: configConstants.LIST_BAD_KEYWARDS })
      quickReplies[1].title = 'List Bad Keywards';
    }
    messengerService.sendQuickRepliesMessage(user.fbid, text, quickReplies);
  }
  
}

module.exports = SenderService;
