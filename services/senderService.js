/* eslint-disable no-use-before-define */
const { messengerService } = require('./messenger');
const { i18n } = require('./helpers');
const { keywordsModel } = require('../model');
const configConstants = require('./constants/configConstants');
const BotUtils = require('./botutil');

class SenderService {
  static sendDoneQuestionMessage(user) {
    const key = 'are_you_done';
    const text = i18n.__(key);

    const quickReplies = [
      {
        content_type: 'text',
        title: i18n.__('yes'),
        payload: JSON.stringify({ action: configConstants.DONE_ADDING_KEYWORDS }),
      },
      {
        content_type: 'text',
        title: i18n.__('no'),
        payload: JSON.stringify({ action: configConstants.NOT_DONE_ADDING_KEYWORDS }),
      },
    ];
    messengerService.sendQuickRepliesMessage(user.fbid, text, quickReplies);
  }

  static sendGreetingMessage(user) {
    const text = i18n.__('hello_ready', `${user.firstName} ${user.lastName}`);
    const quickReplies = [
      {
        content_type: 'text',
        title: i18n.__('dashboard'),
        payload: JSON.stringify({ action: configConstants.GET_DASHBOARD_LINK }),
      },
      {
        content_type: 'text',
        title: i18n.__('search'),
        payload: JSON.stringify({ action: configConstants.CONTENT_SEARCH }),
      },
    ];
    messengerService.sendQuickRepliesMessage(user.fbid, text, quickReplies);
  }

  static sendConfigurationMessage(user, message, configAction, actions) {
    console.log('sending greeting');
    const text = message;
    const quickReplies = [];
    actions.map((action) => {
      quickReplies.push({
        content_type: 'text',
        title: action,
        payload: JSON.stringify({ action: configAction }),
      });
    });
    messengerService.sendQuickRepliesMessage(user.fbid, text, quickReplies);
  }

  static sendConfidence(user, message) {
    console.log('sending confidence');
    const text = message;
    messengerService.sendTextMessage(user.fbid, text);
  }

  static sendDoneResponse(user, message) {
    const text = message;
    messengerService.sendTextMessage(user.fbid, text);
  }

  static sendGoodKeywordsInstruction(user, message) {
    console.log('sending adding Good Keywords Instruction');
    const text = message;
    messengerService.sendTextMessage(user.fbid, text);
  }

  static sendBadKeywordsInstruction(user, message) {
    console.log('sending adding Bad Keywords Instruction');
    const text = message;
    messengerService.sendTextMessage(user.fbid, text);
  }

  static sendKeywordsChoices(user, message, keywords) {
    const text = message;

    const quickReplies = [
      {
        content_type: 'text',
      },
      {
        content_type: 'text',
      },
    ];
    if (keywords == configConstants.GOOD_KEYWORDS) {
      const addKey = 'add_good_keywords';
      const listKey = 'list_keywords';
      quickReplies[0].payload = JSON.stringify({ action: configConstants.ADD_GOOD_KEYWORDS });
      quickReplies[0].title = i18n.__(addKey);
      quickReplies[1].payload = JSON.stringify({ action: configConstants.LIST_GOOD_KEYWORDS });
      quickReplies[1].title = i18n.__(listKey);
    } else if (keywords === configConstants.BAD_KEYWORDS) {
      const addKey = 'add_bad_keywords';
      const listKey = 'list_keywords';
      quickReplies[0].payload = JSON.stringify({ action: configConstants.ADD_BAD_KEYWORDS });
      quickReplies[0].title = i18n.__(addKey);
      quickReplies[1].payload = JSON.stringify({ action: configConstants.LIST_BAD_KEYWORDS });
      quickReplies[1].title = i18n.__(listKey);
    }
    messengerService.sendQuickRepliesMessage(user.fbid, text, quickReplies);
  }

  static async sendKeywords(user, type) {
    console.log('thew model ', keywordsModel);
    const keywords = await keywordsModel.find({ type });
    if (keywords && keywords.length > 0) {
      const firstText = type === 'good'
        ? i18n.__('here_is_good_keywordslist')
        : i18n.__('here_is_bad_keywordslist');
      await messengerService.sendTextMessage(user.fbid, firstText);
      await BotUtils.chatDelay(user.fbid, 2000);
      const text = keywords.map((keyword) => keyword.keyword).join('\n');
      return messengerService.sendTextMessage(user.fbid, text);
    }
    const sorryKey = 'sorry_no_keywords_inserted';
    const sorryText = i18n.__(sorryKey);
    const identifier = type === 'good' ? configConstants.GOOD_KEYWORDS : configConstants.BAD_KEYWORDS;
    const quickReplies = getKeywordsQuickReplies(identifier, true);
    return messengerService.sendQuickRepliesMessage(user.fbid, sorryText, quickReplies);
  }

  static async sendDashboardLink(user) {
    const key = 'send_dashboard_link';
    const message = i18n.__(key);
    messengerService.sendTextMessage(user.fbid, message);
  }

  static async sendSearchType(user) {
    const key = 'what_to_search';
    const attachment = i18n.__(key);
    const quickReplies = getSearchTypesQuickReplies();
    return messengerService.sendQuickRepliesMessage(user.fbid, attachment, quickReplies);
  }

  static async sendPosts(id, elements) {
    return messengerService.sendGenerTemplate(id, elements);
  }
}

function getKeywordsQuickReplies(keywords, splice = false) {
  let quickReplies = [
    {
      content_type: 'text',
    },
    {
      content_type: 'text',
    },
  ];
  if (keywords === configConstants.GOOD_KEYWORDS) {
    const addKey = 'add_good_keywords';
    const listKey = 'list_keywords';
    quickReplies[0].payload = JSON.stringify({ action: configConstants.ADD_GOOD_KEYWORDS });
    quickReplies[0].title = i18n.__(addKey);
    quickReplies[1].payload = JSON.stringify({ action: configConstants.LIST_GOOD_KEYWORDS });
    quickReplies[1].title = i18n.__(listKey);
  } else if (keywords === configConstants.BAD_KEYWORDS) {
    const addKey = 'add_bad_keywords';
    const listKey = 'list_keywords';
    quickReplies[0].payload = JSON.stringify({ action: configConstants.ADD_BAD_KEYWORDS });
    quickReplies[0].title = i18n.__(addKey);
    quickReplies[1].payload = JSON.stringify({ action: configConstants.LIST_BAD_KEYWORDS });
    quickReplies[1].title = i18n.__(listKey);
  }

  if (splice) {
    quickReplies = quickReplies.splice(0, 1);
  }
  return quickReplies;
}

function getSearchTypesQuickReplies() {
  const quickReplies = [{
    content_type: 'text',
    title: i18n.__('all_content'),
    payload: JSON.stringify({ action: configConstants.SEARCH_ALL_CONTENT }),
  }, {
    content_type: 'text',
    title: i18n.__('filtered_content'),
    payload: JSON.stringify({ action: configConstants.SEARCH_FILTERED_CONTENT }),
  }];

  return quickReplies;
}
module.exports = SenderService;
