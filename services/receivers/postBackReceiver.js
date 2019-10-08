const BotUtils = require('../botutil');
const senderService = require('../senderService');
const configConstants = require('../constants/configConstants');

class PostBackReceiver {
  static router(user, event) {
    const { postback } = event;
    const { payload } = postback;
    const parsed = BotUtils.parsePayload(payload);
    console.log('parsed.action: ', parsed.action);

    if (!parsed) throw new Error('received non JSON payload');
    // else if (parsed.action === configConstants.CONFIGURE_SARAH) {
    //   const actions = ['posts', 'comments', 'replies'];
    //   const message = 'WHAT TO MONITOR ?';
    //   const configAction = configConstants.WHAT_TO_MONITOR;
    //   PostBackReceiver.receivedConfigurationMessage(user, message, configAction, actions);
    // }
    else if (parsed.action === configConstants.CONFIGURE_SARAH) {
      PostBackReceiver.receivedStartConfiguration(user);
    }

    else if (parsed.action === configConstants.GOOD_KEYWARDS) {
      PostBackReceiver.receivedGoodKeywards(user);
    }

    else if (parsed.action === configConstants.BAD_KEYWARDS) {
      PostBackReceiver.receivedBadKeywards(user);
    }

    else PostBackReceiver.receivedGreetingMessage(user, event);
  }

  static async receivedStartConfiguration(user) {
    const session = user.session || {};
    session.step = configConstants.PERCENTAGE_OF_CONFIDENCE;
    user.markModified('session');
    await user.save();
    const message = 'can you enter percentage of confidence ?'
    senderService.sendConfidence(user, message);
  }

  static async receivedGoodKeywards(user) {
    const session = user.session || {};
    session.step = configConstants.GOOD_KEYWARDS;
    user.markModified('session');
    await user.save();
    const message = 'what do you want ?';
    senderService.sendKeywardsInstruction(user, message, configConstants.GOOD_KEYWARDS);
  }

  static async receivedBadKeywards(user) {
    const session = user.session || {};
    session.step = configConstants.BAD_KEYWARDS;
    user.markModified('session');
    await user.save();
    const message = 'what do you want ?';
    senderService.sendKeywardsInstruction(user, message, configConstants.BAD_KEYWARDS);
  }

  static receivedGreetingMessage(user, event) {
    senderService.sendGreetingMessage(user);
  }
  static receivedConfigurationMessage(user, message, configAction, actions) {
    senderService.sendConfigurationMessage(user, message, configAction, actions);
  }
}

module.exports = PostBackReceiver;
