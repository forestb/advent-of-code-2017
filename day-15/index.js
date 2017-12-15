#!/usr/bin/env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');

/**
 * Part 1
 */
function getCalculatedNextValue(previousValue, factor) {
  var divisor = 2147483647;
  var result = (previousValue * factor) % divisor;
  // console.log(result);
  return result;
}

function isMatch(generatorA, generatorB) {
  var aResultBinary = helpers.pad(helpers.Dec2Bin(generatorA.currentValue), 32);
  var bResultBinary = helpers.pad(helpers.Dec2Bin(generatorB.currentValue), 32);

  var aResultSubstring = aResultBinary.substring(16, 32);
  var bResultSubstring = bResultBinary.substring(16, 32);

  if (aResultSubstring == bResultSubstring) {
    return true;
  }

  return false;
}

function solvePart1() {
  // sample input
  // var generatorA = { name: "a", factor: 16807, currentValue: 65 };
  // var generatorB = { name: "b", factor: 48271, currentValue: 8921 };

  // live input
  var generatorA = { name: "a", factor: 16807, currentValue: 679 };
  var generatorB = { name: "b", factor: 48271, currentValue: 771 };

  console.log("Solving part 1... this will take about a minute, be patient...");

  var iteratorSize = 40000000;
  var candidateCount = 0;

  for (var i = 0; i < iteratorSize; i++) {
    generatorA.currentValue = getCalculatedNextValue(generatorA.currentValue, generatorA.factor);
    generatorB.currentValue = getCalculatedNextValue(generatorB.currentValue, generatorB.factor);

    if (isMatch(generatorA, generatorB)) {
      candidateCount++;
    }

    if (i % 5000000 == 0) {
      console.log(`${i} processed...`)
    }
  }

  console.log(`Part 1: After ${iteratorSize} pairs, what is the judge's final count? - ${candidateCount}`)
}

solvePart1();

/**
 * Part 2
 */
function solvePart2() {
  // sample input
  // var generatorA = { name: "a", factor: 16807, currentValue: 65 };
  // var generatorB = { name: "b", factor: 48271, currentValue: 8921 };

  // live input
  var generatorA = { name: "a", factor: 16807, currentValue: 679 };
  var generatorB = { name: "b", factor: 48271, currentValue: 771 };

  console.log("Solving part 2... this will take about 15 seconds, be patient...");

  var iteratorSize = 5000000;
  var candidateCount = 0;

  for (var i = 0; i < iteratorSize; i++) {
    do {
      generatorA.currentValue = getCalculatedNextValue(generatorA.currentValue, generatorA.factor);
    } while (generatorA.currentValue % 4 != 0);

    do {
      generatorB.currentValue = getCalculatedNextValue(generatorB.currentValue, generatorB.factor);
    } while (generatorB.currentValue % 8 != 0);

    if (isMatch(generatorA, generatorB)) {
      candidateCount++;
    }

    if (i % 1000000 == 0) {
      console.log(`${i} processed...`)
    }
  }

  console.log(`Part 2: After ${iteratorSize} pairs, but using this new generator logic, what is the judge's final count? - ${candidateCount}`)
}

solvePart2();