const exportCsvJson = require('./exportCsvJson');

// exportCsvJson.TweetsExport();
// exportCsvJson.ALJCommentsExport();

module.exports = () => {
  exportCsvJson.TweetsExport();
  exportCsvJson.ALJCommentsExport();
};
