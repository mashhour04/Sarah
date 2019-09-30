const config = require('config');
const graph = require('fbgraph');

const options = {
  timeout: 3000,
  pool: { maxSockets: Infinity },
  headers: { connection: 'keep-alive' }
};
graph.setOptions(options);
graph.setAccessToken(config.get('facebookGroupAPIToken'));
class Test {
  static getPosts(groupId = '392352701458597') {
    return new Promise((resolve, reject) => {
      graph.get(`${groupId}/feed`, function(err, res) {
        if (err) { return reject(err); }
        resolve(res); // { id: '4', name: 'Mark Zuckerberg'... }
      });
    });
  }
}

module.exports = Test;
