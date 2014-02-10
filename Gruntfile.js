/*
 * grunt-gettext-finder
 * https://github.com/alicoding/grunt-gettext-finder
 *
 * Copyright (c) 2014 Ali Al Dallal
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },
    // Configuration to be run (and then tested).
    gettext_finder: {
      find: {
        options: {
          pathToJSON: "locale/en_US/msg.json",
          ignoreKeys: {
            "list": ["hello", "blah", "duh"],
          },
        },
        files: {
          "templates": ["views/*.html", "views/**/*.html"],
        },
      },
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // By default, lint.
  grunt.registerTask('default', ['jshint', 'gettext_finder']);

};
