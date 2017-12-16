#!/usr/bin/env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');

var cbuffer = require('CBuffer'); // https://www.npmjs.com/package/CBuffer

/**
 * Dance Moves
 */
function swap(programs, swapCount) {
  programs.rotateRight(swapCount);
}

function exchange(programs, positionA, positionB) {
  var objectA = programs.get(positionA);
  var objectB = programs.get(positionB);

  programs.set(positionA, objectB);
  programs.set(positionB, objectA);
}

function partner(programs, nameA, nameB) {
  // get the position of nameA and nameB, then call exchange to swap those by position
  var indexNameA = programs.indexOf(programs.toArray().find(p => p.name === nameA));
  var indexNameB = programs.indexOf(programs.toArray().find(p => p.name === nameB));
  exchange(programs, indexNameA, indexNameB);
}

/**
 * Part 1
 */
function getInitializedPrograms(programCount) {
  var programs = cbuffer(programCount);

  for (var i = 0; i < programCount; i++) {
    var character = String.fromCharCode(i + 97);
    programs.push({ name: character });
  }

  return programs;
}

function printPrograms(programs) {
  programs.forEach(program => {
    console.log(program);
  });
}

function getProgramState(programs) {
  var result = "";

  programs.forEach(program => {
    result += program.name;
  });

  return result;
}

function solvePart1() {
  // Puzzle Input
  var puzzleInput = {input: helpers.GetFileContentsSync("../puzzle-input/day-16-part1.txt"), programCount: 16 };
  //var puzzleInput = { input: helpers.GetFileContentsSync("../puzzle-input/day-16-part1-example.txt"), programCount: 5 };

  var programs = getInitializedPrograms(puzzleInput.programCount);

  var instructions = puzzleInput.input.split(",");

  instructions.forEach(instruction => {
    var instructionType = instruction[0];
    var remainingInstruction = instruction.substring(1, instruction.length);

    if (instructionType == "s") {
      // swap
      var swapCount = +remainingInstruction;
      swap(programs, swapCount);
    }
    else if (instructionType == "x") {
      // exchange
      var positionA = +remainingInstruction.split("/")[0];
      var positionB = +remainingInstruction.split("/")[1];
      exchange(programs, positionA, positionB);
    }
    else if (instructionType == "p") {
      // partner
      var nameA = remainingInstruction.split("/")[0];
      var nameB = remainingInstruction.split("/")[1];
      partner(programs, nameA, nameB);
    }
  });

  console.log(`Part 1: In what order are the programs standing after their dance? - ${getProgramState(programs)}`)
}

solvePart1();

/**
* Part 2
*/
function solvePart2() {
  // Puzzle Input
  var puzzleInput = {input: helpers.GetFileContentsSync("../puzzle-input/day-16-part1.txt"), programCount: 16 };
  //var puzzleInput = { input: helpers.GetFileContentsSync("../puzzle-input/day-16-part1-example.txt"), programCount: 5 };

  var programs = getInitializedPrograms(puzzleInput.programCount);

  var instructions = puzzleInput.input.split(",");

  var programStates = [];
  var loopCounter = 1000000000;

  for (var i = 0; i < loopCounter; i++) {
    instructions.forEach(instruction => {
      var instructionType = instruction[0];
      var remainingInstruction = instruction.substring(1, instruction.length);

      if (instructionType == "s") {
        // swap
        var swapCount = +remainingInstruction;
        swap(programs, swapCount);
      }
      else if (instructionType == "x") {
        // exchange
        var positionA = +remainingInstruction.split("/")[0];
        var positionB = +remainingInstruction.split("/")[1];
        exchange(programs, positionA, positionB);
      }
      else if (instructionType == "p") {
        // partner
        var nameA = remainingInstruction.split("/")[0];
        var nameB = remainingInstruction.split("/")[1];
        partner(programs, nameA, nameB);
      }
    });

    var programState = getProgramState(programs);

    if(programStates.includes(programState)){
      break;
    }else{
      programStates[i] = programState;
    }    
  }

  var indexToRetrieve = (loopCounter - 1) % Object.values(programStates).length;

  console.log(`Part 2: In what order are the programs standing after their billion dances? - ${programStates[indexToRetrieve]}`)
}

solvePart2();