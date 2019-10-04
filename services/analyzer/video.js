const config = require('config');
const Vindexer = require('video-indexer');

const vindexer = new Vindexer(config.get('video_indexer_key'));

// Get user id and name associated with API Key
vindexer.getAccounts()
  .then((result) => { console.log (result.body) });
