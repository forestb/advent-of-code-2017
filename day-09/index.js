#!/usr/bin/env node
'use strict';

/**
 * File IO - retrieve puzzle input
 */
var fs = require('file-system');

function getFileContents(filename){
    return fs.readFileSync(`../puzzle-input/${filename}`, 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
      });
}

var part1 = getFileContents("day-09-part1.txt");
var part1example = getFileContents("day-09-part1-example.txt");

/**
 * Part 1 Example(s)
 */
function getPart1Examples(input){
  var examples = [];
  
  part1example.split("\r\n").forEach(element => {
    var input = element.split(" ")[0].trim();

    // added the ability to comment out examples...
    if(!input.startsWith("//")){
      examples.push(input.substring(0, input.length - 1));
    };
  });

  return examples;
}

// var examples = getPart1Examples(part1example);

// examples.forEach(example => {
//   console.log(`Processing ${example}`);
//   processPart1(example);
// });

/**
 * Part 1
 */
function processPart1(input){
  var currentGroupScore = 0;
  var currentGroupDepth = 0;
  var isProcessingGarbage = false;
  var shouldIgnoreNextCharacter = false;

  var garbageRemovedCount = 0;

  var characters = input.split("");

  for(var i = 0; i < characters.length; i++){
    var character = characters[i];

    // do we ignore this character?
    if(shouldIgnoreNextCharacter){
      shouldIgnoreNextCharacter = false;
      continue;
    }

    var foundOpeningGarbageCharacter = !isProcessingGarbage && character == "<";

    if(foundOpeningGarbageCharacter){
      isProcessingGarbage = foundOpeningGarbageCharacter ? true : isProcessingGarbage;
      continue;
    }    

    var foundClosingGarbageCharacter = isProcessingGarbage && character == ">";

    if(foundClosingGarbageCharacter){
      isProcessingGarbage = foundClosingGarbageCharacter ? false : isProcessingGarbage;
      continue;
    }   

    var foundIgnoreCharacter = isProcessingGarbage && !shouldIgnoreNextCharacter && character == "!";

    if(foundIgnoreCharacter){
      shouldIgnoreNextCharacter = true;
      continue;
    }

    // Part 2
    if(isProcessingGarbage){
      garbageRemovedCount++;
    }

    var foundOpeningGroupCharacter = !isProcessingGarbage && character == "{";
    var foundClosingGroupCharacter = !isProcessingGarbage && character == "}";

    currentGroupDepth += foundOpeningGroupCharacter ? 1 : 0;
    currentGroupDepth -= foundClosingGroupCharacter ? 1 : 0;

    if(foundOpeningGroupCharacter){
      currentGroupScore += currentGroupDepth;
    }
  }

  console.log(`Part 1: The total score for all groups in your input is: ${currentGroupScore}.`);
  console.log(`Part 2: ${garbageRemovedCount} non-canceled characters are within the garbage in your puzzle input.`);
}

processPart1(part1);