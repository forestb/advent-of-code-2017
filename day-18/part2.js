#!/usr/bin/env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');

/**
 * Part 2 Commands
 */
function snd(system, program, x) {
  // snd X sends the value of X to the other program. These values wait in a queue until 
  // that program is ready to receive them. Each program has its own message queue, so a 
  // program can never receive a message it sent.
  var valueToSend = getValueOrValueFromRegister(program, x);
  system.program[program.partnerId].buffer.push(valueToSend);

  program.sndCount++;
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

function mul(system, program, x, y) {
  // mul X Y sets register X to the result of multiplying the value contained in register X 
  // by the value of Y.
  program.registers[x] *= getValueOrValueFromRegister(program, y);
  program.currentInstruction++;
}

function mod(system, program, x, y) {
  // mod X Y sets register X to the remainder of dividing the value contained in register X 
  // by the value of Y (that is, it sets X to the result of X modulo Y).
  program.registers[x] %= getValueOrValueFromRegister(program, y);
  program.currentInstruction++;
}

function rcv(system, program, x) {
  // rcv X receives the next value and stores it in register X. If no values are in the queue, 
  // the program waits for a value to be sent to it. Programs do not continue to the next 
  // instruction until they have received a value. Values are received in the order they are sent.
  if(program.buffer.length == 0) {
    // spin wait...
    program.isLocked = true;

    var isPartnerProgramLocked = system.program[program.partnerId].isLocked;
    var isPartnerProgramComplete = system.program[program.partnerId].isComplete;

    if (program.isLocked && (isPartnerProgramLocked || isPartnerProgramComplete)) {
      program.isComplete = true;
      system.program[program.partnerId].isComplete;
      return;
    }
  }
  else{
    program.isLocked = false;
    program.registers[x] = program.buffer.shift();
    program.currentInstruction++;
  }  
}

function jgz(system, program, x, y) {
  // jgz X Y jumps with an offset of the value of Y, but only if the value of X is greater 
  // than zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the 
  // previous instruction, and so on.)
  var valueX = getValueOrValueFromRegister(program, x);
  var valueY = getValueOrValueFromRegister(program, y);

  if (valueX > 0) {
    program.currentInstruction += valueY;
  }
  else {
    program.currentInstruction++;
  }
}

/**
 * Part 2 Helpers
 */
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
 * Part 2
 */
function processInstruction(system, program, instructions) {
  if(program.isComplete){
    return;
  }

  var instruction = instructions[program.currentInstruction];
  var instructionComponents = instruction.split(" ");

  var instructionType = instructionComponents[0];
  var instructionX = instructionComponents[1];
  var instructionY = instructionComponents[2];

  // process an instruction
  if (instructionType == "snd") {
    snd(system, program, instructionX);
  }
  else if (instructionType == "set") {
    set(system, program, instructionX, instructionY);
  }
  else if (instructionType == "add") {
    add(system, program, instructionX, instructionY);
  }
  else if (instructionType == "mul") {
    mul(system, program, instructionX, instructionY);
  }
  else if (instructionType == "mod") {
    mod(system, program, instructionX, instructionY);
  }
  else if (instructionType == "rcv") {
    rcv(system, program, instructionX);
  }
  else if (instructionType == "jgz") {
    jgz(system, program, instructionX, instructionY);
  }

  if(program.currentInstruction >= instructions.length){
    program.isComplete = true;
  }
}

function solvePart2() {
  var puzzleInput = {instructions: helpers.GetFileContentsSync("../puzzle-input/day-18-part1.txt").split("\r\n")};
  //var puzzleInput = { instructions: helpers.GetFileContentsSync("../puzzle-input/day-18-part2-example.txt").split("\r\n") };

  var system = {
    program: [
      { id: 0, partnerId: 1, buffer: [], currentInstruction: 0, registers: {}, sndCount: 0, isLocked: false, isComplete: false },
      { id: 1, partnerId: 0, buffer: [], currentInstruction: 0, registers: {}, sndCount: 0, isLocked: false, isComplete: false }
    ]
  };

  var instructions = puzzleInput.instructions;

  initializeRegisters(puzzleInput, system.program[0].registers);
  initializeRegisters(puzzleInput, system.program[1].registers);

  system.program[0].registers["p"] = 0;
  system.program[1].registers["p"] = 1;

  // Process each instruction synchronously
  var i = 0;

  while(!(system.program[0].isComplete && system.program[1].isComplete)){
    var programToProcess = i % 2;
    processInstruction(system, system.program[programToProcess], instructions);    
    i++;
  }

  console.log(`Programs completed after ${i} total iterations.`);
  console.log(`Once both of your programs have terminated (regardless of what caused them to do so), how many times did program 1 send a value? - ${system.program[1].sndCount}`);
}

solvePart2();