/**
 * Scale Labs E-Commerce Web App Gruntfile
 * Author:Arun Raju
 * Version: 0.0.1
 * Last Updated: 29th OCT 2017
 */

'use strict';

var packageJson = require('./package.json');

// Angular JS Source Files
var sourceJsFiles = ['app/*.js',
    'app/config/*.js',
    'app/home/*.js',
    'app/home/**/*.js',
    'app/shared/*.js',
    'app/userManagement/*.js',
    'app/userManagement/**/*.js',
    'app/allocateSellers/*.js',
    'app/allocateSellers/**/*.js',
    'app/configureMarketPlace/*.js',
    'app/configureMarketPlace/**/*.js'
];
// Source files for common library JS files.
var libJsFiles = [
    'vendor/angular/angular.min.js',
    'vendor/angular/angular-route.min.js',
    'vendor/angular/angular-local-storage.js', 
    'vendor/angular/angular-animate.js', 
    'vendor/angular/angular-sanitize.js', 
    'vendor/angular/angular-touch.js', 
    'vendor/ui-bootstrap/ui-bootstrap-tpls-2.2.0.js', 
    'vendor/ui-grid/release/ui-grid.js', 
    'vendor/jquery/jquery.min.js',
    'vendor/popper/popper.min.js',
    'vendor/bootstrap/js/bootstrap.min.js',
    'vendor/jquery-easing/jquery.easing.min.js', 
    'vendor/lodash/lodash.js'
];
// Source CSS files.
var sourceCssFiles = [
    'vendor/bootstrap/css/bootstrap.css',
    'vendor/ui-grid/release/ui-grid.css',
    'vendor/font-awesome/css/font-awesome.min.css',
    'css/navbar.css',
    'css/app.css',
];

var outputJsFile = 'dist/slDashboare.js';
var outputJsMinFile = 'dist/slDashboare.min.js';
var outputLibJsFile = 'dist/slDashboare-vendor.js';
var outputLibJsMinFile = 'dist/slDashboare-vendor.min.js';
var outputCssFile = 'dist/css/slDashboare.css';
var outputCssMinFile = 'dist/css/slDashboare.min.css';


//Angular JS Specific End

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            files: [sourceJsFiles, sourceCssFiles],
            tasks: ['newer:jshint', 'concat', 'cssmin', 'uglify:distJs', 'file-creator'] // Run all these tasks when watch triggers a change found.
        },
         copy: {
            distFonts: {
                expand: true,
                flatten: true,
                filter: 'isFile',
                src: ['vendor/font-awesome/fonts/fonts/*.*'],
                dest: 'dist/fonts'
            },
            uiGridFonts: {
                expand: true,
                flatten: true,
                filter: 'isFile',
                src: ['vendor/ui-grid/release/ui-grid.woff', 'vendor/ui-grid/release/ui-grid.ttf'],
                dest: 'dist/css'
            },
            images: {
                expand: true,
                flatten: true,
                filter: 'isFile',
                src: 'assets/images/*.*',
                dest: 'dist/images'
            }
        },
        concat: {
            distJs: {
                src: sourceJsFiles,
                dest: outputJsFile
            },
            libJs: {
                src: libJsFiles,
                dest: outputLibJsFile
            },
            distCss: {
                src: sourceCssFiles,
                dest: outputCssFile
            }
        },
        cssmin: {
            options: {
                rebase: false // Skip rebasing imports & other URLs.
            },
            distCssMin: {
                src: outputCssFile,
                dest: outputCssMinFile
            }
        },
        uglify: {
            options: {
                mangle: false, // Don't mangle variable names & functions.
                screwIE8: true, // Screw you Internet Explorer 8! *shakes fist*
                report: 'min', // Report 'maxmin', showing before and after filesizes.
                preserveComments: false, // Remove all comments.
                sourceMap: true // Generate source map.
            },
            distJs: {
                src: outputJsFile,
                dest: outputJsMinFile
            },
            libJs: {
                src: outputLibJsFile,
                dest: outputLibJsMinFile
            }
        },
        jshint: {
            all: {
                src: jshintSourceFiles,
                options: {
                    strict: true,
                    curly: true,
                    nonbsp: true,
                    undef: true,
                    unused: 'vars',
                    force: false,
                    node: ['require'],
                    globals: {
                        // Mocha
                        'describe': false,
                        'it': false,
                        'angular': false,
                        'document': false,
                        'navigator': false
                    },
                }
            }
        },
       
    });

    // Load plugins.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-newer');

    //task(s).
    // Default task for use in development.
    //grunt.registerTask('dev', ['browserSync', 'watch']);

    grunt-newernt.registerTask('default', ['jshint', 'copy', 'concat', 'cssmin', 'uglify', 'file-creator', 'obfuscator', 'usebanner']);

};