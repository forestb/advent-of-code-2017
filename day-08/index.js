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

var input = part1;

/**
 * Part 1 Helper(s)
 */
function isConditionTrue(a, condition, b){  
  if(condition == "<"){
    return a < b;
  }
  else if(condition == "<="){
    return a <= b;
  }
  else if(condition == ">"){
    return a > b;
  }
  else if(condition == ">="){
    return a >= b;
  }
  else if(condition == "!="){
    return a != b;
  }
  else if(condition == "=="){
    return a == b;
  }
}

function getOperationResult(source, operation, value){
  if(operation.toLowerCase() == "inc"){
    return source += value;
  }
  else if(operation.toLowerCase() == "dec"){
    return source -= value;
  }
  else{

  }
}

/**
 * Part 1
 */
var instructions = [];
var registers = {};

var lines = input.split("\r\n");

lines.forEach(element => {
  var elements = element.split(" ");

  instructions.push({ 
    target: elements[0], 
    operation: elements[1], 
    value: +elements[2], 
    source: elements[4], 
    condition: elements[5], 
    conditionValue: +elements[6] 
  });

  registers[elements[0]] = 0; // initialize all register values to 0
});

// part 2, What was the max value stored in a register?
var maxValueStoredInRegister = 0;

// process all instructions from beginning to end
instructions.forEach(element => {
  if(isConditionTrue(registers[element.source], element.condition, element.conditionValue)){
    var valueToPutInRegister = getOperationResult(registers[element.target], element.operation, element.value);

    maxValueStoredInRegister = valueToPutInRegister > maxValueStoredInRegister ? valueToPutInRegister : maxValueStoredInRegister;

    registers[element.target] = valueToPutInRegister;
  }
});

console.log(`The largest value remaining in any register is ${Math.max(...Object.values(registers))}.`);

/**
 * Part 2
 */
console.log(`The largest value ever stored in a register was ${maxValueStoredInRegister}.`)