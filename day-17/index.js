#!/usr/bin/env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');

var cbuffer = require('CBuffer'); // https://www.npmjs.com/package/CBuffer

/**
 * Part 1
 */
function solvePart1() {
  // Puzzle Input
  var puzzleInput = {stepCount: 316, numberOfInsertions:2017};
  //var puzzleInput = {stepCount: 3, numberOfInsertions:2017};

  var values = cbuffer(puzzleInput.numberOfInsertions + 1);
  values.push(0);

  for(var i = 1; i <= puzzleInput.numberOfInsertions; i++){
    values.rotateLeft(puzzleInput.stepCount);
    values.push(i);
  }

  var indexOfLastValue = values.indexOf(puzzleInput.numberOfInsertions);
  var valueAfterLastValue = values.get(indexOfLastValue+1);

  console.log(`Part 1: What is the value after 2017 in your completed circular buffer? - ${valueAfterLastValue}`)
}

solvePart1();

/**
* Part 2
*/
function solvePart2() {
  console.log("Part 2 took 538739.329ms/~9 minutes to complete - be patient or close the program.")
  console.time("Part2");

  // Puzzle Input
  var puzzleInput = {stepCount: 316, numberOfInsertions:50000000};
  //var puzzleInput = {stepCount: 3, numberOfInsertions:2017};

  var values = cbuffer(puzzleInput.numberOfInsertions + 1);
  values.push(0);

  for(var i = 1; i <= puzzleInput.numberOfInsertions; i++){
    values.rotateLeft(puzzleInput.stepCount);
    values.push(i);
  }

  var indexOfLastValue = values.indexOf(0);
  var valueAfterLastValue = values.get(indexOfLastValue+1);

  console.timeEnd("Part2");
  console.log(`Part 2: What is the value after 0 the moment 50000000 is inserted? - ${valueAfterLastValue}`)
}

solvePart2();