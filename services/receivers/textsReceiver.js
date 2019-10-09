/* eslint-disable no-use-before-define */
/* eslint-disable global-require */
const config = require('config');
const senderService = require('../senderService');
const configConstants = require('../constants/configConstants');
const { facebook } = require('../facebook');
const keywords = require('../../model').keywordsModel;
const witTrainer = require('../training/wit');
const { i18n } = require('../helpers');
const { contentModel } = require('../../model');
const { PostsCollector } = require('../collector');

class TextsReceiver {
  static router(user, event) {
    const { message } = event;
    const { text } = message;
    const session = user.session || {};
    const { step } = session;
    const addedKeywords = String(text).split(',');
    // if(_.isNaN(Number(text))) console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    if ((new RegExp('hi', 'i').test(text) || new RegExp('hello', 'i').test(text) || new RegExp('hey', 'i').test(text)) && (step != configConstants.ADD_GOOD_KEYWORDS && step != configConstants.ADD_BAD_KEYWORDS)) {
      TextsReceiver.receivedGreetingMessage(user, event);
    } else if (new RegExp('type', 'i').test(text)) {
      TextsReceiver.receivedBroadcastMessage(user, event);
    } else if (step === configConstants.ADD_GOOD_KEYWORDS) {
      addedKeywords.map(async (goodKeyword) => {
        const keyword = {
          keyword: String(goodKeyword).trim(),
          type: 'good',
        };
        await keywords.create(keyword);
      });
      // TextsReceiver.receivedGreetingMessage(user, event);
      TextsReceiver.sendDoneQuestionMessage(user, event);
    } else if (step === configConstants.ADD_BAD_KEYWORDS) {
      addedKeywords.map(async (goodKeyword) => {
        const keyword = {
          keyword: goodKeyword.trim(),
          type: 'bad',
        };
        await keywords.create(keyword);
      });
      if (witTrainer && !witTrainer.createSamplesFromKeywords) {
        const trainer = require(witTrainer);
        trainer.createSamplesFromKeywords({ keywords: addedKeywords });
      } else {
        witTrainer.createSamplesFromKeywords({ keywords: addedKeywords });
      }
      // TextsReceiver.receivedGreetingMessage(user, event);
      TextsReceiver.sendDoneQuestionMessage(user, event);
    } else if (step === configConstants.SEARCH_ALL_CONTENT) {
      // Searching groups api for posts matching this keyword
      TextsReceiver.receivedGroupSearchQuery(user, text);
    } else if (step === configConstants.SEARCH_FILTERED_CONTENT) {
      TextsReceiver.receivedBadSearchQuery(user, text);
    }
  }

  static sendDoneQuestionMessage(user, event) {
    senderService.sendDoneQuestionMessage(user);
  }

  static receivedGreetingMessage(user, event) {
    senderService.sendGreetingMessage(user);
  }

  static receivedPercentageOfConfidence(user, event) {
    senderService.sendWhatToMonitor(user);
  }

  static receivedBroadcastMessage(user, event) {
    const { text } = event.message;
    const threadID = config.get('default_threadId');
    facebook.sendTextMessage({ text, threadID });
  }

  static async receivedGroupSearchQuery(user, query) {
    const posts = await PostsCollector.searchGroup(query);

    if (posts && posts.length > 0) {
      const elements = generateTemplateFromPosts(posts);
      senderService.sendPosts(user.fbid, elements);
    } else {
      const sorryKey = 'sorry_no_posts_found';
      const message = i18n.__(sorryKey);
      senderService.sendTextMessage(user.fbid, message);
    }
  }

  static async receivedBadSearchQuery(user, query) {
    const posts = await contentModel.find({
      $or: [{
        message: { $regex: new RegExp(query), $options: 'i' },
      }, {
        story: { $regex: new RegExp(query), $options: 'i' },
      }],
    });

    if (posts && posts.length > 0) {
      const elements = generateTemplateFromPosts(posts);
      senderService.sendPosts(user.fbid, elements);
    } else {
      const sorryKey = 'sorry_no_posts_found';
      const message = i18n.__(sorryKey);
      senderService.sendTextMessage(user.fbid, message);
    }
  }
}


function generateTemplateFromPosts(posts) {
  const elements = posts.map((post) => ({
    subtitle: post.from.name,
    title: post.message,
    image_url: (post.full_picture) ? post.full_picture : "https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/06/1498595311facebook.jpg",
    buttons: [{
      title: i18n.__('read_post'),
      type: 'web_url',
      url: `https://www.facebook.com/${post.id}`,
    }],
  }));
  return elements;
}
module.exports = TextsReceiver;
