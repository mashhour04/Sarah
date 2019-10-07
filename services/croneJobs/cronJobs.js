const cron = require('node-cron');

class CronJob {
  static getJobs() {
    const ret = !this.Jobs ? (this.Jobs = new Map()) : this.Jobs;
    return ret;
  }

  static createClownJob(id, cb, formatTime, active) {
    const task = cron.schedule(formatTime, cb, {
      scheduled: active,
    });
    const jobs = this.getJobs();
    const _id = id.toString();
    jobs.set(_id, task);
  }

  static startClownJob(id) {
    const jobs = this.getJobs();
    const _id = id.toString();
    const task = jobs.get(_id);
    task.start();
  }

  static stopClownJob(id) {
    const jobs = this.getJobs();
    const _id = id.toString();
    const task = jobs.get(_id);
    task.stop();
  }

  static deleteClownJob(id) {
    const jobs = this.getJobs();
    const _id = id.toString();
    jobs.delete(_id);
  }
}

module.exports = CronJob;
