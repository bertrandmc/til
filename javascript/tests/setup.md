### Testing with Enzyme, Mocha and Chai

I prefer running mocha tests programmatically because it allows me
to fine control how tests are executed, easily select the test files I
want to run, require and configure global dependencies etc.

For that I create a **tests.js** file inside **project/test** folder
to configure Mocha and use npm test script to run it.

```
"scripts": {
    "test": "nodemon test/tests.js",
  }
```

The tests.js file sample:

```
'use strict';

const glob = require('glob');
const Mocha = require('mocha');
const colors = require('colors');

require('babel-register');

const mocha = new Mocha({
  // reporter: 'TAP' // change reporter whenever needed
  bail: true,
  timeout: 10000,
  compilers: ['js:babel-register']
});

// add setup file needed to configure
mocha.addFile(`${__dirname}/setup.js`);

const globOptions = {
  matchBase: true,
  root: '../',
  ignore: ['node_modules']
};

// Add each .Spec.js file to the mocha instance
glob("*.Spec.js", globOptions, function (er, files) {
  let specific;

  // comment specific out to run all tests
  // specific = 'containers/Items/items.Spec.js';

  if(specific) {
    const file = files.filter(file => file.indexOf(specific) > -1);
    mocha.addFile(file[0]);
  } else {
    files.forEach(function(file) {
      mocha.addFile(file);
    });
  }

  console.warn(colors.green.underline('\r\n\tGoing to start testing\r\n'));

  // Run the tests.
  const runner = mocha.run(function(failures) {
    if(failures && process.env.NODE_ENV === 'production') {
      // maybe you want to crash server and
      // ping developers if tests fail etc.
      process.exit(1);
    }

    if(!failures && process.env.NODE_ENV === 'production') {
      // All tests passed, exist nodemon process
      process.exit(0);
    }
  });
});
```

I use glob to search for **.Spec.js** files inside project folder (excluding node_modules)
and add each file to mocha with mocha.addFile (I prefer to keep Spec files close to their components in case of a FE applications, for BE with NodeJS I keep all tests inside /test folder).

If I want to run a specific test file, lets say while coding a React component that has no relation to the rest of the app, I can specify the file and speed things up.

Two things to pay attention on this file:
*require('babel-register');* is used to hook Babel's require to node's to automatically compile files.
*mocha.addFile(`${__dirname}/setup.js`);* I use separate files to setup other dependencies, this improves organization and maintainability.

The setup.js file is used to execute some hooks and
require the specific setup files, for example:

```
require('./setup-jsdom');

beforeEach(function () {
  this.jsdom = require('jsdom-global')();
});

afterEach(function () {
  this.jsdom();
});
```
