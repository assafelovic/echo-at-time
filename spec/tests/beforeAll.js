/* eslint-disable */

'use strict';

const
  config = require('../../config'),
  JasmineReporter = require('jasmine-console-reporter');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
const jasmineReporter = new JasmineReporter({
  'colors': true,
  'cleanStack': true,
  'verbosity': 4,
  'listStyle': 'indent',
  'activity': false
});
jasmine.getEnv().addReporter(jasmineReporter);

describe('Env test', () => {
  it('expects environment to be: test',
    (done) => {
      if (config.get('env') === 'test') {
        return done();
      }

      done.fail('environment: ' + config.get('env') + ' is not as expected');
    });
});
