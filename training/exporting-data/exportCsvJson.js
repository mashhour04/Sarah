const XLSX = require('xlsx');
const fs = require('fs');

const csvJsonExtractor = (path) => {
  const workbook = XLSX.readFile(path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  return data;
};

const jsonWriter = (formattedResult, fName) => {
  if (fs.existsSync(`training/data-json/${fName}`)) fs.unlinkSync(`training/data-json/${fName}`);

  const jsonContent = JSON.stringify(formattedResult, undefined, 4);

  fs.writeFile(`training/data-json/${fName}`, jsonContent, 'utf8', (err) => {
    if (err) console.log(err);
    console.log(`${fName} was saved with length of ${formattedResult.length}`);
  });
};

module.exports.TweetsExport = () => {
  const path = 'training/data-csv/tweets.xlsx';
  const data = csvJsonExtractor(path);
  const formattedResult = data
    .filter((el) => el.aggregatedAnnotation < 0 && el.aggregatedAnnotationConfidence >= 0.5)
    .map((el) => ({
      text: el.text,
      type: el.aggregatedAnnotation === -1 ? 'offensive' : 'obscene',
    }));
  const fName = 'tweets.json';

  jsonWriter(formattedResult, fName);
};

module.exports.ALJCommentsExport = () => {
  const path = 'training/data-csv/ALJComments.xlsx';
  const data = csvJsonExtractor(path);
  const formattedResult = data
    .filter((el) => el.languagecomment < 0 && el['languagecomment:confidence'] >= 0.5)
    .map((el) => ({
      text: el.body,
      type: el.languagecomment === -1 ? 'offensive' : 'obscene',
    }));
  const fName = 'ALJComments.json';

  jsonWriter(formattedResult, fName);
};
