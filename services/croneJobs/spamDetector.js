const cronJobs = require('./cronJobs');
const spamAnalyzer = require('../Spams/spamAnalyzer');

module.exports = () => {
  try {
    cronJobs.createClownJob(
      'content-spam-checker-job',
      () => spamAnalyzer.analysis(),
      '*/1 * * * *',
      true,
    );
  } catch (e) {
    console.log(`content-spam-checker-job failed ${e}`);
  }
};
