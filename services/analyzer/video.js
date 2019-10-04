const config = require('config');
const cognitiveServices = require('cognitive-services');

const apiKey = config.get('cognitiveServices_api_key');
const endpoint = config.get('cognitiveServices_endpoint');

const contentModerator = new cognitiveServices.contentModerator({
  apiKey,
  endpoint,
});

