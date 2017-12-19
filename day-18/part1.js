#!/usr/bin/env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');

var RADIX = 10;

/**
 * Part 1 Helpers
 */
function snd(system, x) {
  // snd X plays a sound with a frequency equal to the value of X.
  system.sentFrequency = getValueOrValueFromRegister(system, x);
  system.currentInstruction++;
}

function set(system, x, y) {
  // set X Y sets register X to the value of Y.
  system.registers[x] = getValueOrValueFromRegister(system, y);
  system.currentInstruction++;
}

function add(system, x, y) {
  // add X Y increases register X by the value of Y.
  system.registers[x] += getValueOrValueFromRegister(system, y);
  system.currentInstruction++;
}

function mul(system, x, y) {
  // mul X Y sets register X to the result of multiplying the value contained in register X 
  // by the value of Y.
  system.registers[x] *= getValueOrValueFromRegister(system, y);
  system.currentInstruction++;
}

function mod(system, x, y) {
  // mod X Y sets register X to the remainder of dividing the value contained in register X 
  // by the value of Y (that is, it sets X to the result of X modulo Y).
  system.registers[x] %= getValueOrValueFromRegister(system, y);
  system.currentInstruction++;
}

function rcv(system, x) {
  // rcv X recovers the frequency of the last sound played, but only when the value of X is 
  // not zero. (If it is zero, the command does nothing.)
  var valueX = getValueOrValueFromRegister(system, x);

  if (valueX != 0) {
    system.recoveredFrequency = system.sentFrequency;
  }

  system.currentInstruction++;
}

function jgz(system, x, y) {
  // jgz X Y jumps with an offset of the value of Y, but only if the value of X is greater 
  // than zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the 
  // previous instruction, and so on.)
  var valueX = getValueOrValueFromRegister(system, x);
  var valueY = getValueOrValueFromRegister(system, y);

  if (valueX > 0) {
    system.currentInstruction += valueY;
  }
  else {
    system.currentInstruction++;
  }
}

function initializeRegisters(puzzleInput, registers) {
  puzzleInput.instructions.forEach(instruction => {
    // initialize registers
    var instructionComponents = instruction.split(" ");

    var registerCandidateA = instructionComponents[1];
    var registerCandidateB = instructionComponents[2];

    if (isChar(registerCandidateA)) { registers[registerCandidateA] = 0 };
    if (isChar(registerCandidateB)) { registers[registerCandidateB] = 0 };
  });
}

function isChar(s) {
  return s != null &&
    ((s.charCodeAt() >= 65 && s.charCodeAt() <= 90) || (s.charCodeAt() >= 97 && s.charCodeAt() <= 122));
}

function getValueOrValueFromRegister(system, value) {
  var result = isRegister(system.registers, value) ?
    system.registers[value] : parseInt(value, RADIX);

  return result;
}

function isRegister(registers, name) {
  return name in registers;
}

/**
 * Part 1
 */
function solvePart1() {
  var puzzleInput = {instructions: helpers.GetFileContentsSync("../puzzle-input/day-18-part1.txt").split("\r\n")};
  //var puzzleInput = { instructions: helpers.GetFileContentsSync("../puzzle-input/day-18-part1-example.txt").split("\r\n") };

  var system = { currentInstruction: 0, sentFrequency: null, recoveredFrequency: null, registers: {} }
  var instructions = puzzleInput.instructions;

  initializeRegisters(puzzleInput, system.registers);

  // process instructions
  do {
    var instruction = instructions[system.currentInstruction];
    var instructionComponents = instruction.split(" ");

    var instructionType = instructionComponents[0];
    var instructionX = instructionComponents[1];
    var instructionY = instructionComponents[2];

    // process instructions
    if (instructionType == "snd") {
      snd(system, instructionX);
    }
    else if (instructionType == "set") {
      set(system, instructionX, instructionY);
    }
    else if (instructionType == "add") {
      add(system, instructionX, instructionY);
    }
    else if (instructionType == "mul") {
      mul(system, instructionX, instructionY);
    }
    else if (instructionType == "mod") {
      mod(system, instructionX, instructionY);
    }
    else if (instructionType == "rcv") {
      rcv(system, instructionX);

      if (system.recoveredFrequency != null) {
        console.log(`What is the value of the recovered frequency (the value of the most recently played sound) the first time a rcv instruction is executed with a non-zero value? - ${system.recoveredFrequency}`);
        return;
      }
    }
    else if (instructionType == "jgz") {
      jgz(system, instructionX, instructionY);
    }
  } while (system.currentInstruction < instructions.length);
}

solvePart1();

/**
* Part 2
*/
function solvePart2() {

}

solvePart2();