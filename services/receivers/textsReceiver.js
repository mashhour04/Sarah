const config = require('config');
const senderService = require('../senderService');
const configConstants = require('../constants/configConstants');
const { facebook } = require('../facebook');
const keywords = require('../../model').keywordsModel;

class TextsReceiver {
  static router(user, event) {
    const { message } = event;
    const { text } = message;
    const session = user.session || {};
    const { step } = session;
    const addedKeywords = String(text).split(",")
    // if(_.isNaN(Number(text))) console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    if ((new RegExp('hi', 'i').test(text) || new RegExp('hello', 'i').test(text) || new RegExp('hey', 'i').test(text)) && (step != configConstants.ADD_GOOD_KEYWORDS && step != configConstants.ADD_BAD_KEYWORDS)) {
      TextsReceiver.receivedGreetingMessage(user, event);
    } else if (new RegExp('type', 'i').test(text)) {
      TextsReceiver.receivedBroadcastMessage(user, event);
    } else if (step == configConstants.ADD_GOOD_KEYWORDS) {
      addedKeywords.map(async(goodKeyword) => {
        let keyword = {
          keyword: String(goodKeyword).trim(),
          Type: 'good'
        }
        await keywords.create(keyword);
      })
      // TextsReceiver.receivedGreetingMessage(user, event);
      TextsReceiver.sendDoneQuestionMessage(user, event);
    } else if (step == configConstants.ADD_BAD_KEYWORDS) {
      addedKeywords.map(async(goodKeyword) => {
        let keyword = {
          keyword: goodKeyword.trim(),
          type: 'bad'
        }
        await keywords.create(keyword);
      })
      // TextsReceiver.receivedGreetingMessage(user, event);
      TextsReceiver.sendDoneQuestionMessage(user, event);
    }
  }

  static sendDoneQuestionMessage(user, event) {
    senderService.sendDoneQuestionMessage(user);
  }

  static receivedGreetingMessage(user, event) {
    senderService.sendGreetingMessage(user);
  }

  static receivedPercentageOfConfidence(user, event) {
    senderService.sendWhatToMonitor(user);
  }

  static receivedBroadcastMessage(user, event) {
    const { text } = event.message;
    const threadID = config.get('default_threadId');
    facebook.sendTextMessage({ text, threadID });
  }
}

module.exports = TextsReceiver;
