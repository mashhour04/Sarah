const config = require('config');
const graph = require('fbgraph');
const constants = require('../constants');
const { adminModel } = require('../../model')
const options = {
  timeout: 3000,
  pool: { maxSockets: Infinity },
  headers: { connection: 'keep-alive' }
};
graph.setOptions(options);
graph.setAccessToken(config.get(constants.FACEBOOK_GROUP_API_TOKEN));
class PostsCollector {
  static async init() {
    let targets = [];
    const admins = await adminModel.find({});
    if (admins && admins.length > 0) {
      admins.map(admin => {
        if (admin.groupId) {
          targets.push(admin)
        }
      })
    } else {
      targets = [{ groupId: constants.DEFAULT_GROUP_ID }]
    }

    PostsCollector.initTargetsJobs(targets);
  }
  static initTargetsJobs(targets) {
    targets.map(async (target, index) => {
      PostsCollector.collectJob(target);
      setInterval(async (target) => {
        PostsCollector.collectJob(target)
      }, index * 25000, target)
    })
  }

  static async collectJob(target) {
    const posts = await PostsCollector.getPosts(target);

  }
  static getPosts(target) {
    return new Promise((resolve, reject) => {
      const { groupId } = target;

      const query = PostsCollector.getFieldsQuery();
      const path = `${groupId}/feed${query}`;
      graph.get(path, function (err, res) {
        if (err) { return reject(err); }
        resolve(res); // { id: '4', name: 'Mark Zuckerberg'... }
      });
    });
  }

  static getFieldsQuery(type = constants.FEED, fields) {
    fields = fields || config.get('defaultPostFields');
    if (type === constants.FEED) {
      let query = '?fields=';
      fields.map(field => {
        if (field.children.length > 0) {
          return query += field.name + '{' + field.children.join(',') + '},';
        }
        query += field.name + ',';
      })
      query = query.replace(/,$/, '');
      return query;
    }
  }
}

module.exports = PostsCollector;
