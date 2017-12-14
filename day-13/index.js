#!/usr/bin/env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');

var ElapsedTime = require('elapsed-time');

/**
 * Part 1 helpers/methods
 */
function getPuzzleState(input) {
  var puzzleState = { packetPosition: -1, picoSecond: 0, min: 0, max: 0, layers: [] };

  input.split("\r\n").forEach(layer => {
    var depth = +layer.split(":")[0];
    var range = +layer.split(":")[1];

    puzzleState.layers[depth] = { depth: depth, range: range, currentPosition: 0, currentDirection: "+" };
  });

  puzzleState.max = Math.max(...Object.values(Object.keys(puzzleState.layers)));

  return puzzleState;
}

function printLayers(layers) {
  Object.values(layers).forEach(layer => {
    console.log(`${layer.depth} ${layer.range}`);
  });
}

function move(puzzleState) {
  Object.values(puzzleState.layers).forEach(layer => {
    // change direction?
    if(layer != null){
      if (layer.currentPosition == 0 && layer.currentDirection == "-") {
        layer.currentDirection = "+";
      }
      else if (layer.currentPosition == (layer.range - 1) && layer.currentDirection == "+") {
        layer.currentDirection = "-";
      }
  
      // move the security scanner
      layer.currentPosition = layer.currentDirection == "+" ? layer.currentPosition += 1 : layer.currentPosition -= 1;
    }    
  });

  puzzleState.picoSecond++;
}

function isCaught(puzzleState) {
  var packetPosition = puzzleState.packetPosition;
  var layers = puzzleState.layers;
  
  return layers[packetPosition] != null && layers[packetPosition].currentPosition == 0;
}

/**
 * Part 1
 */
function solvePart1() {
  // Puzzle Input
  var input = helpers.GetFileContentsSync("../puzzle-input/day-13-part1.txt");
  //var input = helpers.GetFileContentsSync("../puzzle-input/day-13-part1-example.txt");

  var puzzleState = getPuzzleState(input);

  var severity = 0;

  for (var i = puzzleState.min; i <= puzzleState.max; i++) {
    puzzleState.packetPosition++;

    if(isCaught(puzzleState)){
      severity += puzzleState.layers[i].depth * puzzleState.layers[i].range;
    }

    move(puzzleState);
  }

  console.log(`Part 1: What is the severity of your whole trip? - ${severity}`);
}

solvePart1();

/**
* Part 2
*/
function isSuccessfulStateFound(puzzleState) {
  return puzzleState.packetPosition > puzzleState.max;
}

function processState(puzzleState) {
  while (puzzleState.packetPosition <= puzzleState.max) {
    puzzleState.packetPosition++;

    if (isCaught(puzzleState)) {
      return false;
    }

    move(puzzleState);    
  }

  return true;
}

function solvePart2() {
  console.log("Part 2 took 287016.661ms/~5 minutes to complete - be patient or close the program.")
  console.time("Part 2");
  var et = ElapsedTime.new().start();

  // Puzzle Input
  var input = helpers.GetFileContentsSync("../puzzle-input/day-13-part1.txt");
  //var input = helpers.GetFileContentsSync("../puzzle-input/day-13-part1-example.txt");

  var puzzleState = getPuzzleState(input);

  var wasSuccessfulStateFound = false;

  do {
    var copiedState = helpers.Clone(puzzleState);

    if(puzzleState.picoSecond != 0 && puzzleState.picoSecond % 100000 == 0){
      console.log(`Part 2: ${et.getValue()} elapsed - ${puzzleState.picoSecond} picoseconds processed.  Still working...`);
    }

    move(puzzleState);
  } while (!processState(copiedState));

  console.timeEnd("Part 2");
  console.log(`Part 2: What is the fewest number of picoseconds that you need to delay the packet to pass through the firewall without being caught? - ${puzzleState.picoSecond - 1}`);
}

solvePart2();