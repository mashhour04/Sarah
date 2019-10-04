const PostsCollector = require('./posts');

function init() {
  PostsCollector.init();
}


module.exports = {
  PostsCollector,
  init,
};
