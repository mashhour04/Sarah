const { messengerService } = require('./messenger');
const configConstants = require('./constants/configConstants');

class SenderService {

  static sendDoneQuestionMessage(user) {
    const text = 'Are You Done ?';
    const quickReplies = [
      {
        content_type: 'text',
        title: 'Yes',
        payload: JSON.stringify({ action: configConstants.DONE_ADDING_KEYWORDS })
      },
      {
        content_type: 'text',
        title: 'No',
        payload: JSON.stringify({ action: configConstants.NOT_DONE_ADDING_KEYWORDS })
      }
    ];
    messengerService.sendQuickRepliesMessage(user.fbid, text, quickReplies);
  }

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

  static sendDoneResponse(user, message) {
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
      quickReplies[0].payload = JSON.stringify({ action: configConstants.ADD_GOOD_KEYWORDS })
      quickReplies[0].title = 'Add Good Keywords';
      quickReplies[1].payload = JSON.stringify({ action: configConstants.LIST_GOOD_KEYWORDS })
      quickReplies[1].title = 'List Good Keywords';
    }
    else if (keywords == configConstants.BAD_KEYWORDS) {
      quickReplies[0].payload = JSON.stringify({ action: configConstants.ADD_BAD_KEYWORDS })
      quickReplies[0].title = 'Add Bad Keywords';
      quickReplies[1].payload = JSON.stringify({ action: configConstants.LIST_BAD_KEYWORDS })
      quickReplies[1].title = 'List Bad Keywords';
    }

    messengerService.sendQuickRepliesMessage(user.fbid, text, quickReplies);
  }
  
}

module.exports = SenderService;
