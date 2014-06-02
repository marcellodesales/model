var utils = require('utilities')
  , assert = require('assert')
  , model = require('../../../../lib')
  , helpers = require('.././helpers')
  , Adapter = require('../../../../lib/adapters/filesystem').Adapter
  , adapter
  , tests
  , shared = require('../shared');

tests = {
  'before': function (next) {
    var relations = helpers.fixtures.slice()
      , models = [];
    adapter = new Adapter();

    relations.forEach(function (r) {
      models.push({
        ctorName: r.ctorName
      , ctor: r.ctor
      });
    });
    model.registerDefinitions(models);
    model.adapters = {};
    relations.forEach(function (r) {
      model[r.ctorName].adapter = adapter;
    });

    adapter.createTable(Object.keys(model.adapters), next);

    // FIXME: registration should do this, no?
    model.adapters.filesystem = adapter;
  }

, 'after': function (next) {
    model.adapters.filesystem.destroy(next);
  }

, 'test create adapter': function () {
    assert.ok(adapter instanceof Adapter);
  }


};

for (var p in shared) {
  if (p == 'beforeEach' || p == 'afterEach') {
    tests[p] = shared[p];
  }
  else {
    tests[p + ' (Filesystem)'] = shared[p];
  }
}

module.exports = tests;


