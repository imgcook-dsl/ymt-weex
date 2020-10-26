const co = require('co');
const xtpl = require('xtpl');
const fs = require('fs');
const thunkify = require('thunkify');
const path = require('path');
const prettier = require('prettier');
const {NodeVM} = require('vm2');
const dslHelper = require('@imgcook/dsl-helper');
const _ = require('lodash');
const data = require('./data');

const vm = new NodeVM({
  console: 'inherit',
  sandbox: {}
});

co(function* () {
  const xtplRender = thunkify(xtpl.render);
  const code = fs.readFileSync(
      path.resolve(__dirname, '../src/index.js'),
      'utf8'
  );
  const renderInfo = vm.run(code)(data, {
    prettier: prettier,
    _: _,
    helper: dslHelper
  });
  const renderData = renderInfo.renderData;
  const ret = yield xtplRender(
      path.resolve(__dirname, '../src/template.xtpl'),
      renderData,
      {}
  );

  console.log(ret);
});
