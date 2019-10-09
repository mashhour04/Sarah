const BotUtils = require('../botutil');
const senderService = require('../senderService');
const configConstants = require('../constants/configConstants');

const { i18n } = require('../helpers');

class QuickReplyReceiver {
  static router(user, event) {
    const { payload } = event.message.quick_reply;
    const parsed = BotUtils.parsePayload(payload);
    if (!parsed) {
      throw new Error('received non JSON payload');
    } else if (parsed.action === configConstants.ADD_GOOD_KEYWORDS) {
      QuickReplyReceiver.receivedAddGoodKeywords(user);
    } else if (parsed.action === configConstants.ADD_BAD_KEYWORDS) {
      QuickReplyReceiver.receivedAddBadKeywords(user);
    } else if (parsed.action === configConstants.LIST_GOOD_KEYWORDS) {
      QuickReplyReceiver.receivedListKeyWords(user, 'good');
    } else if (parsed.action === configConstants.LIST_BAD_KEYWORDS) {
      QuickReplyReceiver.receivedListKeyWords(user, 'bad');
    } else if (
      parsed.action === configConstants.DONE_ADDING_KEYWORDS
      || parsed.action === configConstants.NOT_DONE_ADDING_KEYWORDS
    ) {
      QuickReplyReceiver.receivedDoneAnswer(user, parsed.action);
    } else if (parsed.action === configConstants.GET_DASHBOARD_LINK) {
      QuickReplyReceiver.receivedGetDashboardLink(user);
    } else if (parsed.action === configConstants.CONTENT_SEARCH) {
      QuickReplyReceiver.receivedStartSearch(user);
    }  else if (parsed.action === configConstants.SEARCH_ALL_CONTENT) {
      QuickReplyReceiver.receivedSearchType(user, configConstants.SEARCH_ALL_CONTENT);
    }  else if (parsed.action === configConstants.SEARCH_FILTERED_CONTENT) {
      QuickReplyReceiver.receivedSearchType(user, configConstants.SEARCH_FILTERED_CONTENT);
    } else {
      // Unhandled_Quick_Reply
    }
  }

  static async receivedDoneAnswer(user, action) {
    let message;
    if (action === configConstants.DONE_ADDING_KEYWORDS) {
      const key = 'new_keywords_saved';
      message = i18n.__(key);
      const session = user.session || {};
      session.step = configConstants.NORMAL;
      user.markModified('session');
      await user.save();
    } else message = i18n.__('okay_complete');
    senderService.sendDoneResponse(user, message);
  }

  static async receivedPostType(user, event) {
    const session = user.session || {};
    session.step = configConstants.PERCENTAGE_OF_CONFIDENCE;
    user.markModified('session');
    await user.save();
    const message = 'can you enter PERCENTAGE OF CONFIDENCE ?';
    senderService.sendConfidence(user, message);
  }

  static async receivedAddGoodKeywords(user) {
    const session = user.session || {};
    session.step = configConstants.ADD_GOOD_KEYWORDS;
    user.markModified('session');
    await user.save();
    const key = 'add_comma_sperated';
    // const message = 'Please Enter Your Good Keywords Separated By Commas "," !';
    const message = i18n.__(key);
    senderService.sendGoodKeywordsInstruction(user, message);
  }

  static async receivedAddBadKeywords(user) {
    const session = user.session || {};
    session.step = configConstants.ADD_BAD_KEYWORDS;
    user.markModified('session');
    await user.save();
    const key = 'add_comma_sperated';
    // const message = 'Please Enter Your Good Keywords Separated By Commas "," !';
    const message = i18n.__(key);
    senderService.sendBadKeywordsInstruction(user, message);
  }

  static async receivedListKeyWords(user, type) {
    try {
      senderService.sendKeywords(user, type);
    } catch (err) {
      console.log('unable to send the keywords list', err.message);
    }
  }

  static async receivedGetDashboardLink(user) {
    try {
      senderService.sendDashboardLink(user);
    } catch (err) {
      console.log('unable to send the keywords list', err.message);
    }
  }

  static async receivedStartSearch(user) {
    try {
      senderService.sendSearchType(user);
    } catch (err) {
      console.log('unable to send the keywords list', err.message);
    }
  }

  static async receivedSearchType(user, searchType) {
    const session = user.session || {};
    session.step = searchType;
    user.markModified('session');
    await user.save();
    const key = 'enter_search_content';
    // const message = 'Please Enter Your Good Keywords Separated By Commas "," !';
    const message = i18n.__(key);
    senderService.sendBadKeywordsInstruction(user, message);
  }
}

module.exports = QuickReplyReceiver;
