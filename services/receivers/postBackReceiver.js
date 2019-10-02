const BotUtils = require('../botutil');
const senderService = require('../senderService');
class PostBackReceiver {
  static router(user, event) {
    const { postback } = event;
    const { payload } = postback;
    let parsed = BotUtils.parsePayload(payload);
    if (!parsed) throw new Error('received non JSON payload');

    PostBackReceiver.receivedGreetingMessage(user, event);
  }

  static receivedGreetingMessage(user, event) {
    senderService.sendGreetingMessage(user);
  }
}

module.exports = PostBackReceiver;
