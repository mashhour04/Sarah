/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
const config = require('config');
const graph = require('fbgraph');
const constants = require('../constants');
const { adminModel, contentModel } = require('../../model');

const options = {
  timeout: 3000,
  pool: { maxSockets: Infinity },
  headers: { connection: 'keep-alive' },
};
graph.setOptions(options);
graph.setVersion('4.0');
graph.setAccessToken(config.get(constants.FACEBOOK_GROUP_API_TOKEN));
class PostsCollector {
  static async init() {
    let targets = [];
    const admins = await adminModel.find({});
    // eslint-disable-next-line no-constant-condition
    if (admins && admins.length > 0 && false) {
      admins.map((admin) => {
        if (admin.groupId) {
          targets.push(admin);
        }
      });
    } else {
      targets = [{ groupId: constants.DEFAULT_GROUP_ID }];
    }

    PostsCollector.initTargetsJobs(targets);
  }

  static initTargetsJobs(targets) {
    console.log('colll', targets);
    targets.map(async (target, index) => {
      
      PostsCollector.collectJob(target);
      setTimeout(async (t) => {
        setInterval(() => {
          PostsCollector.collectJob(t);
        }, 40 * 1000);
      }, index * 2 * 60000, target);
    });
  }

  static async collectJob(target) {
    try {
      const graphResult = await PostsCollector.getPosts(target);

      const posts = await preparePosts(graphResult.data);
      console.log('posts', posts);
      contentModel.insertMany(posts);
    } catch (err) {
      console.log('error getting popsts', err.message);
    }
  }

  static getPosts(target) {
    return new Promise((resolve, reject) => {
      const { groupId } = target;

      const query = PostsCollector.getFieldsQuery();
      const path = `${groupId}/feed${query}`;
      graph.get(path, (err, res) => {
        if (err) { return reject(err); }
        resolve(res); // { id: '4', name: 'Mark Zuckerberg'... }
      });
    });
  }

  static getFieldsQuery(type = constants.FEED, fields = config.get('defaultPostFields')) {
    if (type === constants.FEED) {
      let query = '?fields=';
      fields.map((field) => {
        if (field.children.length > 0) {
          query += `${field.name}{${field.children.join(',')}},`;
          return;
        }
        query += `${field.name},`;
      });
      query = query.replace(/,$/, '');
      return query;
    }
    return '';
  }
}

const preparePosts = async (data) => {
  const existance = data.map((post) => contentModel.findOne({ id: post.id }, { id: 1 }));
  let existedPosts = [];
  try {
    existedPosts = await Promise.all(existance);
  } catch (err) {
    console.log('something wrong happened checking extistance', err.message);
  }
  let posts = existedPosts.length > 0 ? data.filter((post) => !existedPosts.find((o) => o && o.id === post.id)) : data;
  posts = posts.map((post) => {
    if (post.attachments) {
      post.attachments = post.attachments.data;
      post.attachments = post.attachments.map((attachment) => {
        if (attachment.subattachments && attachment.subattachments.data) {
          attachment.subattachments = attachment.subattachments.data;
        }
        return attachment;
      });
    }

    return post;
  });

  return posts;
};

module.exports = PostsCollector;
