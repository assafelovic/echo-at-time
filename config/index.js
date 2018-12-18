'use strict';

const nconf = require('nconf');
const path = require('path');
const fs = require('fs');

nconf.env().argv();

const environments = [
  'development',
  'production',
  'local',
  'test'
];

if (!nconf.get('NODE_ENV')) {
  throw new Error('NODE_ENV parameter not defined! \nPlease consider to use one of these environments: ' + environments.join(', '));
}

if (environments.indexOf(nconf.get('NODE_ENV')) < 0) {
  throw new Error('NODE_ENV parameter is not valid! \nPlease consider to use one of these environments: ' + environments.join(', '));
}

try {
  const envConfigFileName = 'config.' + nconf.get('NODE_ENV') + '.json';
  const configFile = path.join(__dirname, envConfigFileName);
  const hiddenConfigFile = path.join(__dirname, '.' + envConfigFileName);
  let currentConfigFile = configFile;

  if (!fs.existsSync(configFile)) {
    if (!fs.existsSync(hiddenConfigFile)) {
      throw new Error('Cannot locate ' + nconf.get('NODE_ENV') + ' environment configuration file');
    }
    currentConfigFile = hiddenConfigFile;
    console.log('\n\n');
    console.log('WARNING READING HIDDEN (dot-file) CONFIG FILE: ' + hiddenConfigFile);
    console.log('MAKE SURE TO HAVE LOCAL COPY OF IT WITHOUT dot (.) SYMBOL AS PREFIX IN FILE NAME');
    console.log('\n\n');
  }

  nconf.file(currentConfigFile);
} catch (exception) {
  throw new Error(exception);
}

if (process.env.PORT) nconf.set('http:port', process.env.PORT);
if (process.env.HOST) nconf.set('http:host', process.env.HOST);

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
if (nconf.get('NODE_ENV') !== 'production') process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

module.exports = nconf;
