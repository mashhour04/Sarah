const BotUtils = require('../botutil');
const senderService = require('../senderService');
const configConstants = require('../constants/configConstants');

class PostBackReceiver {
  static router(user, event) {
    const { postback } = event;
    const { payload } = postback;
    let parsed = BotUtils.parsePayload(payload);
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

  static receivedGreetingMessage(user, event) {
    senderService.sendGreetingMessage(user);
  }
  static receivedConfigurationMessage(user, message, configAction, actions) {
    senderService.sendConfigurationMessage(user, message, configAction, actions);
  }
}

module.exports = PostBackReceiver;
