const { messengerService } = require('./messenger');
const { i18n } = require('./helpers');
const { keywordsModel } = require('../model');
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

  static sendGoodKeywordsInstruction(user, message) {
    console.log('sending adding Good Keywords Instruction');
    const text = message;
    messengerService.sendTextMessage(user.fbid, text);
  }

  static sendBadKeywordsInstruction(user, message) {
    console.log('sending adding Bad Keywords Instruction');
    const text = message;
    messengerService.sendTextMessage(user.fbid, text);
  }

  static sendKeywordsChoices(user, message, keywords) {
    const text = message;

    const quickReplies = [
      {
        content_type: 'text',
      },
      {
        content_type: 'text',
      }
    ];
    if (keywords == configConstants.GOOD_KEYWORDS) {
      const addKey = 'add_good_keywords';
      const listKey = 'list_keywords';
      quickReplies[0].payload = JSON.stringify({ action: configConstants.ADD_GOOD_KEYWORDS })
      quickReplies[0].title = i18n.__(addKey);
      quickReplies[1].payload = JSON.stringify({ action: configConstants.LIST_GOOD_KEYWORDS })
      quickReplies[1].title = i18n.__(listKey);
    } else if (keywords === configConstants.BAD_KEYWORDS) {
      const addKey = 'add_bad_keywords';
      const listKey = 'list_keywords';
      quickReplies[0].payload = JSON.stringify({ action: configConstants.ADD_BAD_KEYWORDS })
      quickReplies[0].title = i18n.__(addKey);
      quickReplies[1].payload = JSON.stringify({ action: configConstants.LIST_BAD_KEYWORDS })
      quickReplies[1].title = i18n.__(listKey);
    }
    messengerService.sendQuickRepliesMessage(user.fbid, text, quickReplies);
  }
  
  static sendKeywords(user, type) {
    console.log('thew model ', keywordsModel)
    // const keywords  = keywordsModel.find({ type });
  }

}

module.exports = SenderService;
