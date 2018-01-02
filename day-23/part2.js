#!/usr/bin/env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');

var ElapsedTime = require('elapsed-time');

/**
 * Instructions
 */
function nop(system, program) {
  program.currentInstruction++;
}

function set(system, program, x, y) {
  // set X Y sets register X to the value of Y.
  program.registers[x] = getValueOrValueFromRegister(program, y);
  program.currentInstruction++;
}

function add(system, program, x, y) {
  // add X Y increases register X by the value of Y.
  program.registers[x] += getValueOrValueFromRegister(program, y);
  program.currentInstruction++;
}

function sub(system, program, x, y) {
  // add X Y increases register X by the value of Y.
  program.registers[x] -= getValueOrValueFromRegister(program, y);
  program.currentInstruction++;
}

function mul(system, program, x, y) {
  // mul X Y sets register X to the result of multiplying the value contained in register X 
  // by the value of Y.
  program.registers[x] *= getValueOrValueFromRegister(program, y);
  program.currentInstruction++;
}

function jnz(system, program, x, y) {
  // jnz X Y jumps with an offset of the value of Y, but only if the value of X is not zero. 
  // (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, 
  // and so on.)
  var valueX = getValueOrValueFromRegister(program, x);
  var valueY = getValueOrValueFromRegister(program, y);

  if (valueX != 0) {
    program.currentInstruction += valueY;
  }
  else {
    program.currentInstruction++;
  }
}

/**
 * 
 */
function initializeRegisters(puzzleInput, registers) {
  puzzleInput.instructions.forEach(instruction => {

    // initialize registers
    var instructionComponents = instruction.split(" ");

    var registerCandidateA = instructionComponents[1];
    var registerCandidateB = instructionComponents[2];

    if (helpers.IsAlpha(registerCandidateA)) { registers[registerCandidateA] = 0 };
    if (helpers.IsAlpha(registerCandidateB)) { registers[registerCandidateB] = 0 };

  });
}

function getValueOrValueFromRegister(system, value) {
  var result = isRegister(system.registers, value) ?
    system.registers[value] : parseInt(value, 10);

  return result;
}

function isRegister(registers, name) {
  return name in registers;
}

function printSystemState(system) {
  console.log(...Object.keys(system.program[0].registers));
  console.log(...Object.values(system.program[0].registers));
  console.log(...Object.keys(system.program[1].registers));
  console.log(...Object.values(system.program[1].registers));
}

/**
 * Part 1
 */
function processInstruction(system, program, instructions) {
  if (program.isComplete) {
    return;
  }

  var instruction = instructions[program.currentInstruction];
  var instructionComponents = instruction.split(" ");

  var instructionType = instructionComponents[0];
  var instructionX = instructionComponents[1];
  var instructionY = instructionComponents[2];

  // process an instruction
  if (instructionType == "set") {
    set(system, program, instructionX, instructionY);
  }
  else if (instructionType == "add") {
    add(system, program, instructionX, instructionY);
  }
  else if (instructionType == "mul") {
    program.mulCount++;
    mul(system, program, instructionX, instructionY);
  }
  else if (instructionType == "sub") {
    sub(system, program, instructionX, instructionY);
  }
  else if (instructionType == "jnz") {
    jnz(system, program, instructionX, instructionY);
  }
  else if(instructionType == "nop"){
    nop(system, program);
  }
  else {
    console.log(`Invalid instruction found: ${instructionType}`)
  }

  if (program.currentInstruction >= instructions.length) {
    program.isComplete = true;
  }
}

function solvePart2() {
  console.log("Part 2 will take some time - be patient or close the program.");
  var et = ElapsedTime.new().start();

  var puzzleInput = { instructions: helpers.GetFileContentsSync("../puzzle-input/day-23-part2.txt").split("\r\n") };
  // var puzzleInput = { instructions: helpers.GetFileContentsSync("../puzzle-input/day-23-part1-example.txt").split("\r\n") };

  var system = {
    program: [
      { id: 0, partnerId: 1, buffer: [], currentInstruction: 0, registers: {}, mulCount: 0, isComplete: false }
    ]
  };

  var instructions = [];

  // ignore commented out instructions
  puzzleInput.instructions.forEach(instruction => {
    if(!instruction.startsWith("//")){
      instructions.push(instruction);
    }
  });

  console.log(`Instruction count: ${instructions.length}`);

  initializeRegisters(puzzleInput, system.program[0].registers);

  system.program[0].registers["p"] = 0;

  // The debug mode switch is wired directly to register a. You flip the switch, 
  // which makes register a now start at 1 when the program is executed.
  // system.program[0].registers["a"] = 1;
  system.program[0].registers["a"] = 0;

  // Process each instruction synchronously
  var i = 0;

  while (!(system.program[0].isComplete)) {
    if (i != 0 && i % 10000000 == 0) {
      console.log(`Part 2: ${et.getValue()} elapsed - ${i} instructions processed.  Still working...`);
    }

    processInstruction(system, system.program[0], instructions);
    i++;
  }

  console.log(`Part 1: If you run the program (your puzzle input), how many times is the mul instruction invoked? - ${system.program[0].mulCount}.`);

  // The coprocessor's ultimate goal is to determine the final value left in register 
  // h once the program completes. Technically, if it had that... it wouldn't even need 
  // to run the program.
  console.log(`Part 2: After setting register a to 1, if the program were to run to completion, what value would be left in register h? - ${system.program[0].registers["h"]}.`);
}

solvePart2();