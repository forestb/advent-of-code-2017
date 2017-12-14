#!/usr/bin/env node
'use strict';

var fs = require('file-system');

/**
 * Puzzle input parsing
 */
// Read puzzle file contents
var puzzleInputSample = fs.readFileSync('../puzzle-input/day-05-part1-example.txt', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
  });

var puzzleInput = fs.readFileSync('../puzzle-input/day-05-part1.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
});

//var puzzleInputToUse = puzzleInputSample;
var puzzleInputToUse = puzzleInput;

/**
 * Helper method(s)
 */
function isIndexOutOfBounds(array, index){
    return index < 0 || index >= array.length;
}

/**
 * Part 1
 */
var instructionSet = [];

puzzleInputToUse.split("\r\n").forEach(element => {
    instructionSet.push(+element);
});

function solvePart1(instructionSet){
    var stepCount = 0;
    var index = 0;
    
    while(!isIndexOutOfBounds(instructionSet, index)){
        stepCount++;

        // analyze
        var valueAtIndex = instructionSet[index];
    
        // add
        instructionSet[index]++;
    
        // execute
        index += valueAtIndex;           
    }
    
    console.log(`Part 1: ${stepCount} steps before exiting the loop at index ${index}.`);
}

solvePart1(instructionSet);

/**
 * Part 2
 */
instructionSet = [];

puzzleInputToUse.split("\r\n").forEach(element => {
    instructionSet.push(+element);
});

function solvePart2(instructionSet){
    var stepCount = 0;
    var index = 0;
    
    while(!isIndexOutOfBounds(instructionSet, index)){
        stepCount++;

        // analyze
        var valueAtIndex = instructionSet[index];
    
        // adjust index
        if(valueAtIndex >= 3 ){
            instructionSet[index]--;
        }
        else{
            instructionSet[index]++;
        }        
    
        // execute
        index += valueAtIndex;           
    }
    
    console.log(`Part 2: ${stepCount} steps before exiting the loop at index ${index}.`);
}

solvePart2(instructionSet);