/*
 * grunt-gettext-finder
 * https://github.com/alicoding/grunt-gettext-finder
 *
 * Copyright (c) 2014 Ali Al Dallal
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {
  var _ = require('lodash');
  var path = require('path');

  grunt.registerMultiTask('gettext_finder', 'gettext finder', function () {
    var done = this.async();

    var options = this.options();
    var localeJSON = {};
    var files = grunt.file.expand({
            filter: function (filePath) {
              return path.basename(filePath)[0] !== '_';
            }
          }, options.pathToJSON);
    var keys = [];

    files.forEach(function(f, i) {
      localeJSON = _.merge(localeJSON, grunt.file.readJSON(f));
    });
    localeJSON = _.keys(localeJSON);

    var regexps = [
      /gettext\(["'][^)]+["']\)/g
    ].concat(this.options().extraSearchRegexp || []);

    this.filesSrc.forEach(function (f) {
      if (grunt.file.exists(f)) {
        var content = grunt.file.read(f);

        regexps.forEach(function (regexp) {
          content.replace(regexp, function (wholeMatch, key) {
            var match = (/["']([^)]+)["']/g).exec(wholeMatch);
            keys.push(match[1]);
            return wholeMatch;
          });
        });
      }
    });

    var compare = _.difference(localeJSON, keys);
    var diff = _.difference(compare, options.ignoreKeys);

    var inverseCompare = _.difference(keys, localeJSON);
    var inverseDiff = _.difference(inverseCompare, options.ignoreKeys);

    if (!diff.length && !inverseDiff.length) {
      grunt.log.ok("No unused key names found in locale JSON provided.\n");
      done(true);
    } else {
      if (diff.length) {
        grunt.log.warn("Found keys in locale JSON not used in given source.\n",
          "Please consider removing them or add to the ignoreKeys.\n list:", diff);
      }
      if (inverseDiff.length) {
        grunt.log.warn("Found keys in source not used in given locale JSON.\n",
          "Please consider removing them or add to the ignoreKeys.\n list:", inverseDiff);
      }
      done(false);
    }
  });
};
