const senderService = require('../senderService');
class TextsReceiver {
  static router(user, event) {
    const { message } = event;
    const { text } = message;
    console.log('checking on that text', text);
    if (new RegExp('hi', 'i').test(text)) {
      console.log('user said hi');
      TextsReceiver.receivedGreetingMessage(user, event);
    }
  }

  static receivedGreetingMessage(user, event) {
    senderService.sendGreetingMessage(user);
  }
}

module.exports = TextsReceiver;
