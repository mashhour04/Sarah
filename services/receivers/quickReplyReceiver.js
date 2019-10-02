const BotUtils = require('../botutil');
const senderService = require('../senderService');
const configConstants = require('../constants/configConstants');

class QuickReplyReceiver {
  static router(user, event) {
    let payload = event.message.quick_reply.payload;
    let parsed = BotUtils.parsePayload(payload);
    if (!parsed) {
      throw new Error('received non JSON payload');
    }
    // parsed.action === configConstants.CONFIGURE_SARAH ==> should send the PERCENTAGE_OF_CONFIDENCE
    /*
  PERCENTAGE_OF_CONFIDENCE  // not_now
  WHAT_TO_MONITOR
  ANALYZE_WHAT
  WHAT_ACTION_TO_DO
  TRAIN_THE_BOT_BLACK_LIST
  TRAIN_THE_BOT_WHITE_LIST
    */
    else QuickReplyReceiver.receivedGreetingMessage(user, event);
  }

  static receivedGreetingMessage(user, event) {
    senderService.sendGreetingMessage(user);
  }
  static async receivedPostType(user, event) {
    const session = user.session || {};
    session.step = configConstants.PERCENTAGE_OF_CONFIDENCE;
    user.markModified('session');
    await user.save();
    const message = 'can you enter PERCENTAGE OF CONFIDENCE ?'
    senderService.sendConfidence(user, message);
  }
}

module.exports = QuickReplyReceiver;
