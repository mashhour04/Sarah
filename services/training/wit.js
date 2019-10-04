/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
const axios = require('axios');
const config = require('config');
const _ = require('lodash');
const path = require('path');

const jsonfile = require('jsonfile');
const { Wit, log } = require('node-wit');
const expressions = require('../../black-list.json');


const apiKey = config.get('wit_key');

const client = new Wit({ accessToken: apiKey, logger: new log.Logger(log.DEBUG) });

// createExpressions();

createSamples({});

async function createExpression({ entity, value, expression }) {
  entity = entity || 'intent';
  value = value || 'profane';
  const url = `https://api.wit.ai/entities/${entity}/values/${value}/expressions?v=2019104`;

  console.log('url', url);
  try {
    const response = await axios.post(url, { expression }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.data) {
      const entities = response.data;
      console.log('response for', expression);
      return { entities, expression };
    }
    return response;
  } catch (err) {
    console.log('error in request', err);
    return { error: err.response };
  }
}


async function insertSamples({ samples }) {
  const url = 'https://api.wit.ai/samples?v=2019104';

  try {
    const response = await axios.post(url, samples, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.data) {
      const entities = response.data;
      console.log('response for', samples);
      return { entities, expression: samples };
    }
    return response;
  } catch (err) {
    console.log('error in request', err);
    return { error: err.response };
  }
}

async function createExpressions() {
  const chunks = _.chunk(expressions, 20);
  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    const trainPromises = [];
    const messagePromises = [];
    for (let j = 0; j < chunk.length; j += 1) {
      const expression = expressions[j];
      // console.log('expression', expression)
      if (!expression) { continue; }

      trainPromises.push(createSample({ sample: expression }));
      // messagePromises.push(messageWit({ expression }));
    }

    const train = await Promise.all(trainPromises);
    // const message = await Promise.all(messagePromises);


    train.map(async (response) => {
      if (response.error) {
        console.log('failed for ', response, 'with error', response.error);
        process.exit();
      } else {
        console.log('sucess for ', response);
      }
    });
    // command to print out a 50
    jsonfile.writeFileSync(path.resolve(`./services/data/second-train-response-${i}.json`), train, { encoding: 'utf-8' });
    //    jsonfile.writeFileSync(path.resolve(`./services/data/message-response-${i}.json`), message, { encoding: 'utf-8' });

    await delay(5000);
  }
}

async function createSamples({ entity, value }) {
  const chunks = _.chunk(expressions, 20);
  entity = entity || 'intent';
  value = value || 'profane';
  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    const samples = chunk.map((text) => ({
      text,
      entities: [{
        entity,
        value,
      }],
    }));
    const trainPromises = [];
    const messagePromises = [];

    const train = await insertSamples({ samples });
    // const message = await Promise.all(messagePromises);


    if (train.error) {
      console.log('failed for ', train, 'with error', train.error);
      process.exit();
    } else {
      console.log('sucess for ', train);
    }

    // command to print out a 50
    jsonfile.writeFileSync(path.resolve(`./services/data/second-train-response-${i}.json`), train, { encoding: 'utf-8' });
    //    jsonfile.writeFileSync(path.resolve(`./services/data/message-response-${i}.json`), message, { encoding: 'utf-8' });

    await delay(10000);
  }
}


async function messageWit({ expression }) {
  try {
    const data = await client.message(expression);
    return data;
  } catch (err) {
    return err;
  }
}
async function delay(amount, ...args) {
  return new Promise((resolve, reject) => {
    setTimeout((...args) => {
      resolve(...args);
    }, amount, ...args);
  });
}

// async..await is not allowed in global scope, must use a wrapper
async function email({ vehicle, total, index }) {
  // Generate test SMTP service account from ethereal.email

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
  const subject = (vehicle) ? `End Vehicle:  ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.body} ✔` : `${index}  Total of Vehicles`;
  const text = (vehicle) ? `Vehicle: ${JSON.stringify(vehicle)}` : `${index} Total : ${JSON.stringify(total)} `;
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Wit.AI Training  👻" <mpghknown9@gmail.com>', // sender address
    to: 'mpghknown@gmail.com, mpghfamous@gmail.com', // list of receivers
    subject, // Subject line
    text, // plain text body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}
