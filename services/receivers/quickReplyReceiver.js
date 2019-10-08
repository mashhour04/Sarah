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

    else if (parsed.action === configConstants.ADD_GOOD_KEYWORDS) {
      QuickReplyReceiver.receivedAddGoodKeywords(user);
    }

    else if (parsed.action === configConstants.ADD_BAD_KEYWORDS) {
      QuickReplyReceiver.receivedAddBadKeywords(user);
    }


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

  static async receivedAddGoodKeywords(user) {
    const session = user.session || {};
    session.step = configConstants.ADD_GOOD_KEYWORDS;
    user.markModified('session');
    await user.save();
    const message = 'Please Enter Your Good Keywords Separated By Commas "," !';
    senderService.sendGoodKeywordsInstruction(user, message);
  }

  static async receivedAddBadKeywords(user) {
    const session = user.session || {};
    session.step = configConstants.ADD_BAD_KEYWORDS;
    user.markModified('session');
    await user.save();
    const message = 'Please Enter Your Good Keywords Separated By Commas "," !';
    senderService.sendBadKeywordsInstruction(user, message);
  }
}

module.exports = QuickReplyReceiver;
