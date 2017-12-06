#!/usr/bin/env node
'use strict';

/**
 * File IO - retrieve puzzle input
 */
var fs = require('file-system');

function getFileContents(filename){
    return fs.readFileSync(`./puzzle-input/${filename}`, 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
      });
}

var part1 = getFileContents("part1.txt");
var part1example = getFileContents("part1example.txt");
var part2 = getFileContents("part2.txt");
var part2example = getFileContents("part2example.txt");

/**
 * Part 1
 */


 /**
 * Part 2
 */
