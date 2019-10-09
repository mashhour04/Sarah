/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
const { contentModel } = require('../../model');

const getContentSymbol = Symbol('getContentSymbol');
const editDistSymbol = Symbol('editDistSymbol');

class spamAnalyzer {
  // @ Levenshtein distance algorithm
  // A Naive recursive C++ program to find minimum number
  // operations to convert listOfCandidateString to listOfTargetString
  static [editDistSymbol](listOfCandidateString, listOfTargetString, m, n) {
    // Create a table to store results of subproblems
    const dp = new Array(m + 1);
    for (let i = 0; i < dp.length; i++) dp[i] = new Array(n + 1).fill(0);

    // Fill d[][] in bottom up manner
    for (let i = 0; i <= m; i++) {
      for (let j = 0; j <= n; j++) {
        // If first string is empty, only option is to
        // insert all characters of second string
        if (i === 0) dp[i][j] = j;
        // Min. operations = j
        // If second string is empty, only option is to
        // remove all characters of second string
        else if (j === 0) dp[i][j] = i;
        // Min. operations = i
        // If last characters are same, ignore last char
        // and recur for remaining string
        // eslint-disable-next-line max-len
        else if (listOfCandidateString[i - 1] === listOfTargetString[j - 1])
          dp[i][j] = dp[i - 1][j - 1];
        // If the last character is different, consider all
        // possibilities and find the minimum
        else {
          dp[i][j] =
            1 +
            Math.min(
              dp[i][j - 1], // Insert
              dp[i - 1][j], // Remove
              dp[i - 1][j - 1]
            );
        } // Replace
      }
    }

    return dp[m][n];
  }

  static async [getContentSymbol]() {
    try {
      const pendingOrCleanContent = await contentModel
        .find({
          $or: [{ 'spam.status': 'pending' }, { 'spam.status': 'clean' }],
          message: { $exists: true }
        })
        .select('message from');
      // .select('message status from');
      return pendingOrCleanContent;
    } catch (error) {
      return false;
    }
  }

  static async analysis() {
    try {
      console.log('repeatedly-spam-analysis ===> start');
      const content = await this[getContentSymbol]();
      if (!content || !content.length) return false;

      const vs = new Map();
      let spamPromises = [];

      content.forEach(candidate => {
        spamPromises.push(
          // eslint-disable-next-line no-async-promise-executor
          new Promise(async (resolve, reject) => {
            try {
              let MEDPromises = [];
              const candidateTargets = content.filter(
                c => c.from.id.toString() === candidate.from.id.toString()
              );
              for (let i = 0; i < candidateTargets.length; i++) {
                const target = candidateTargets[i];
                if (
                  target._id.toString() === candidate._id.toString() ||
                  vs.get(`${target._id.toString()}-${candidate._id.toString()}`)
                )
                  continue;
                vs.set(
                  `${target._id.toString()}-${candidate._id.toString()}`,
                  true
                );
                vs.set(
                  `${candidate._id.toString()}-${target._id.toString()}`,
                  true
                );

                const listOfCandidateString = candidate.message.split(/\s+/g);
                const listOfTargetString = target.message.split(/\s+/g);

                MEDPromises.push(
                  new Promise(resolveMED => {
                    // console.time('> editDist');

                    const MED = this[editDistSymbol](
                      listOfCandidateString,
                      listOfTargetString,
                      listOfCandidateString.length,
                      listOfTargetString.length
                    );

                    // console.timeEnd('> editDist');

                    const candidateThresholdToBeFlaggedAsSpam = Math.floor(
                      0.2 * listOfCandidateString.length
                    );
                    const hasSpam = MED <= candidateThresholdToBeFlaggedAsSpam;
                    resolveMED(hasSpam);
                  })
                );
              }
              MEDPromises = await Promise.all(MEDPromises);
              let countCandidateSpamDetection = 0;
              // eslint-disable-next-line no-return-assign
              MEDPromises.forEach(mP => (countCandidateSpamDetection += mP));
              // eslint-disable-next-line no-unused-expressions
              resolve(countCandidateSpamDetection);
            } catch (error) {
              reject(error);
            }
          })
        );
      });

      spamPromises = await Promise.all(spamPromises);
      const savePromises = [];
      content.forEach((c, ind) => {
        const status = spamPromises[ind] ? 'bad' : 'clean';
        savePromises.push(
          contentModel.findByIdAndUpdate(c._id, {
            'spam.status': status,
            'spam.count': spamPromises[ind] + (spamPromises[ind] ? 1 : 0)
          })
        );
      });
      await Promise.all(savePromises);
      console.log('repeatedly-spam-analysis ===> done');
      return true;
    } catch (error) {
      console.log(
        'something went wrong while repeatedly-spam-analysis: ',
        error
      );
      return false;
    }
  }
}

module.exports = spamAnalyzer;
