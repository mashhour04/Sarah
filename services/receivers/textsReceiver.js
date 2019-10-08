const config = require('config');
const senderService = require('../senderService');
const configConstants = require('../constants/configConstants');
const { facebook } = require('../facebook');

class TextsReceiver {
  static router(user, event) {
    const { message } = event;
    const { text } = message;
    const session = user.session || {};
    const { step } = session;
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa', step);
    // if(_.isNaN(Number(text))) console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    if (new RegExp('hi', 'i').test(text)) {
      TextsReceiver.receivedGreetingMessage(user, event);
    } else if (new RegExp('type', 'i').test(text)) {
      TextsReceiver.receivedBroadcastMessage(user, event);
    }
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
