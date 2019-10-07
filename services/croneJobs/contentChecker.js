const cronJobs = require('./cronJobs');
const witAnalyzer = require('../witAnalysis/witAnalyzer');

module.exports = () => {
  try {
    cronJobs.createClownJob(
      'content-checker-job',
      () => witAnalyzer.analysis(),
      '*/5 * * * *',
      true,
    );
  } catch (e) {
    console.log(`content-checker-job failed ${e}`);
  }
};
