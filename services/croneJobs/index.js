const contentChecker = require('./contentChecker');
const spamDetector = require('./spamDetector');

module.exports = () => {
  contentChecker();
  spamDetector();
};
