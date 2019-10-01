const BotUtils = require('../botutil');
const senderService = require('../senderService');
class QuickReplyReceiver {
  static router(user, event) {
    let payload = event.message.quick_reply.payload;
    let parsed = BotUtils.parsePayload(payload);
    if (!parsed) {
      throw new Error('received non JSON payload');
    }
    QuickReplyReceiver.receivedGreetingMessage(user, event);
  }

  static receivedGreetingMessage(user, event) {
    senderService.sendGreetingMessage(user);
  }
}

module.exports = QuickReplyReceiver;
