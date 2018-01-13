#!/usr/bin / env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');

const util = require('util');

/**
 * Helper functions
 */
function calculateDiagnosticChecksum(tape) {
  var sum = 0;

  Object.values(tape).forEach(value => {
    sum += value;
  });

  return sum;
}

function getTapeValue(tape, cursor) {
  if (tape[cursor] == null) {
    tape[cursor] = 0;
  }

  return tape[cursor];
}

/**
 * Solve the example problem
 */
// function solveExample() {
//   var puzzleParameters = { startingState: "A", checkSumCount: 6 };
//   var puzzleStates = { A: "A", B: "B" };

//   var tape = {};
//   var cursor = 0;
//   var currentState = puzzleParameters.startingState;

//   for (var i = 0; i < puzzleParameters.checkSumCount; i++) {
//     var value = getTapeValue(tape, cursor);

//     if (currentState == puzzleStates.A) {
//       // STATE A
//       if (value == 0) {
//         tape[cursor] = 1;
//         cursor++;
//         currentState = puzzleStates.B;
//       }
//       else {
//         tape[cursor] = 0;
//         cursor--;
//         currentState = puzzleStates.B;
//       }
//     }
//     else if (currentState == puzzleStates.B) {
//       // STATE B
//       if (value == 0) {
//         tape[cursor] = 1;
//         cursor--;
//         currentState = puzzleStates.A;
//       }
//       else {
//         tape[cursor] = 1;
//         cursor++;
//         currentState = puzzleStates.B;
//       }
//     }
//   }

//   var result = calculateDiagnosticChecksum(tape);

//   console.log(`Part 1 Example: What is the diagnostic checksum it produces once it's working again? - ${result}`)
// }

// solveExample();

/**
 * Solve Part 1
 */
function solvePart1() {
  var puzzleParameters = { startingState: "A", checkSumCount: 12399302 };
  var puzzleStates = { A: "A", B: "B", C: "C", D: "D", E: "E", F: "F" };
  var directions = { RIGHT: 1, LEFT: -1 };

  var tape = {};
  var cursor = 0;
  var currentState = puzzleParameters.startingState;

  for (var i = 0; i < puzzleParameters.checkSumCount; i++) {
    var value = getTapeValue(tape, cursor);

    if (currentState == puzzleStates.A) {
      // STATE A
      if (value == 0) {
        tape[cursor] = 1;
        cursor += directions.RIGHT;
        currentState = puzzleStates.B;
      }
      else {
        tape[cursor] = 0;
        cursor += directions.RIGHT;
        currentState = puzzleStates.C;
      }
    }
    else if (currentState == puzzleStates.B) {
      // STATE B
      if (value == 0) {
        tape[cursor] = 0;
        cursor += directions.LEFT;
        currentState = puzzleStates.A;
      }
      else {
        tape[cursor] = 0;
        cursor += directions.RIGHT;
        currentState = puzzleStates.D;
      }
    }
    else if (currentState == puzzleStates.C) {
      // STATE C
      if (value == 0) {
        tape[cursor] = 1;
        cursor += directions.RIGHT;
        currentState = puzzleStates.D;
      }
      else {
        tape[cursor] = 1;
        cursor += directions.RIGHT;
        currentState = puzzleStates.A;
      }
    }
    else if (currentState == puzzleStates.D) {
      // STATE D
      if (value == 0) {
        tape[cursor] = 1;
        cursor += directions.LEFT;
        currentState = puzzleStates.E;
      }
      else {
        tape[cursor] = 0;
        cursor += directions.LEFT;
        currentState = puzzleStates.D;
      }
    }
    else if (currentState == puzzleStates.E) {
      // STATE E
      if (value == 0) {
        tape[cursor] = 1;
        cursor += directions.RIGHT;
        currentState = puzzleStates.F;
      }
      else {
        tape[cursor] = 1;
        cursor += directions.LEFT;
        currentState = puzzleStates.B;
      }
    }
    else if (currentState == puzzleStates.F) {
      // STATE F
      if (value == 0) {
        tape[cursor] = 1;
        cursor += directions.RIGHT;
        currentState = puzzleStates.A;
      }
      else {
        tape[cursor] = 1;
        cursor += directions.RIGHT;
        currentState = puzzleStates.E;
      }
    }
  }

  var result = calculateDiagnosticChecksum(tape);

  console.log(`Part 1: What is the diagnostic checksum it produces once it's working again? - ${result}`)
}

solvePart1();