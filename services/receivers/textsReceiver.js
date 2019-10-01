const senderService = require('../senderService');
class TextsReceiver {
  static router(user, event) {
    const { message } = event;
    const { text } = message;

    if (new RegExp('hi', 'i').test(text)) {
      TextsReceiver.receivedGreetingMessage(user, event);
    }
  }

  static receivedGreetingMessage(user, event) {
    senderService.sendGreetingMessage(user);
  }
}

module.exports = TextsReceiver;
