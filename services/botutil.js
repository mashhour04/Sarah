class BotUtils {
  static parsePayload(payload) {
    try {
      let parsed = JSON.parse(payload);
      return parsed;
    } catch (err) {
      return null;
    }
  }
}

module.exports = BotUtils;
