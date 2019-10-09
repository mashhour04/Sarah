
const { sendTypingOn, sendTypingOff } = require('./messenger');

class BotUtils {
  static parsePayload(payload) {
    try {
      const parsed = JSON.parse(payload);
      return parsed;
    } catch (err) {
      return null;
    }
  }

  static async chatDelay(fbid, amount) {
    await sendTypingOn(fbid);
    await BotUtils.delay(amount);
    await sendTypingOff(fbid);
  }

  static delay(amount, ...args) {
    return new Promise((resolve, reject) => {
      setTimeout(
        (...args) => {
          resolve(...args);
        },
        amount,
        ...args,
      );
    });
  }
}

module.exports = BotUtils;
