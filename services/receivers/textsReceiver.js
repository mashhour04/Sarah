const senderService = require('../senderService');
const configConstants = require('../constants/configConstants');

class TextsReceiver {
  static router(user, event) {
    const { message } = event;
    const { text } = message;
    const session = user.session || {};
    const step = session.step;
    // if(_.isNaN(Number(text))) console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    if (new RegExp('hi', 'i').test(text)) {
      TextsReceiver.receivedGreetingMessage(user, event);
    }
    
  }

  static receivedGreetingMessage(user, event) {
    senderService.sendGreetingMessage(user);
  }

  static receivedPercentageOfConfidence(user, event) {
    senderService.sendWhatToMonitor(user);
  }
}

module.exports = TextsReceiver;
