#!/usr/bin/env node
'use strict';

/**
 * File IO - retrieve puzzle input
 */
var assert = require('assert')
var fs = require('file-system');
var FixedArray = require("fixed-array");
var CBuffer = require("CBuffer");

const leftPad = require('left-pad')

module.exports = {
  getCalculatedDenseHash: getCalculatedDenseHash,
  solvePart2 : solvePart2
};

function getFileContents(filename){
    return fs.readFileSync(`./puzzle-input/${filename}`, 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
      });
}

var inputPart1 = getFileContents("part1.txt");
var inputPart1example = getFileContents("part1example.txt");
var inputPart2 = getFileContents("part2.txt");
var inputPart2example = getFileContents("part2example.txt");

/**
 * Helper(s)
 */
function getInitializedArray(listSize){
  var a = [];

  for(var i = 0; i < listSize; i++){
    a[i] = i;
  }

  return a;
}

function getLengthsPart1(puzzleInput){
  var a = [];

  puzzleInput.split(",").forEach(element => {
    a.push(+element);
  });

  return a;
}

/**
 * First, from now on, your input should be taken not as a list of numbers, but as a string of bytes instead. 
 * Unless otherwise specified, convert characters to bytes using their ASCII codes. This will allow you to 
 * handle arbitrary ASCII strings, and it also ensures that your input lengths are never larger than 255. For 
 * example, if you are given 1,2,3, you should convert it to the ASCII codes for each character: 49,44,50,44,51.
 */
function getLengthsPart2(puzzleInput){
  // "Once you have determined the sequence of lengths to use, add the following lengths to the end of the sequence:"
  var sequenceToAdd = "17, 31, 73, 47, 23";

  // For example, if you are given 1,2,3, your final sequence of lengths should be 49,44,50,44,51,17,31,73,47,23
  var a = [];
  
  puzzleInput.split("").forEach(character => {
    a.push(character.charCodeAt(0));
  });

  sequenceToAdd.split(",").forEach(character => {
    a.push(+character);
  });

  return a;
}

function reverseSubArray(a, indexStart, length){
  if(length == 0){
    return;
  }

  var indexStart = indexStart % a.length;
  var indexEnd = (indexStart + length) % a.length;
  var b = [];

  var conditionalIndexEnd = (indexEnd <= indexStart ? a.length : indexEnd );

  // collect array values to be reversed
  for(var i = indexStart; i < conditionalIndexEnd; i++){
    b.push(a[i]);
  }

  if(indexEnd <= indexStart){
    for(var i = 0; i < indexEnd; i++){
      b.push(a[i]);
    }
  }

  b.reverse();

  // put reversed values back in
  for(var i = indexStart; i < conditionalIndexEnd; i++){
    a[i] = b.shift();
  }

  if(indexEnd <= indexStart){
    for(var i = 0; i < indexEnd; i++){
      a[i] = b.shift();
    }
  }
}

/**
 * Part 1, sample
 */
// solvePart1(5, part1example);
/**
 * Part 1
 */
function solvePart1(input){
  input.lengths.forEach(length =>{
    // Reverse the order of that length of elements in the list, starting with the element at the current position.
    reverseSubArray(input.array, input.currentPosition, length);

    // Move the current position forward by that length plus the skip size.
    input.currentPosition += length + input.skipSize;    

    // Increase the skip size by one.
    input.skipSize++;
  });

  var solution = +input.array[0] * +input.array[1];

  return solution;
}

var part1Input = { 
  array: getInitializedArray(256), 
  lengths: getLengthsPart1(inputPart1), 
  currentPosition: 0, 
  skipSize: 0 
};

var solutionPart1 = solvePart1(part1Input);
console.log(`Part 1: ${solutionPart1} is the result of multiplying the first two numbers in the list.`);

 /**
 * Part 2 Helper(s)
 */
/**
 * Your next task is to reduce these to a list of only 16 numbers called the dense hash. To do this, 
 * use numeric bitwise XOR to combine each consecutive block of 16 numbers in the sparse hash (there 
 * are 16 such blocks in a list of 256 numbers). So, the first element in the dense hash is the first 
 * sixteen elements of the sparse hash XOR'd together, the second element in the dense hash is the 
 * second sixteen elements of the sparse hash XOR'd together, etc. 
 */
function getCalculatedDenseHash(sparseHash){
  if(sparseHash.length % 16 != 0){
    console.log("Cannot calculate dense hash.");
    return null;
  }

  var denseHash = [];
  var currentCalculation = 0;

  for( var i = 0; i < sparseHash.length; i++){
    currentCalculation ^= +sparseHash[i];

    // push the value and clear it for every 16 calculations
    if((i + 1) % 16 == 0){
      denseHash.push(currentCalculation);
      currentCalculation = 0;
    }
  }

  return denseHash;
}

/**
 * Finally, the standard way to represent a Knot Hash is as a single hexadecimal string; the final output is the dense 
 * hash in hexadecimal notation. Because each number in your dense hash will be between 0 and 255 (inclusive), always 
 * represent each number as two hexadecimal digits (including a leading zero as necessary). So, if your first three 
 * numbers are 64, 7, 255, they correspond to the hexadecimal numbers 40, 07, ff, and so the first six characters of 
 * the hash would be 4007ff. Because every Knot Hash is sixteen such numbers, the hexadecimal representation is always 
 * 32 hexadecimal digits (0-f) long.
 */
function convertDenseHashToString(denseHash){
  var denseHashString = "";

  denseHash.forEach(element => {
    var hex = element.toString(16);
    var paddedHex = leftPad(hex, 2, '0');
    denseHashString += paddedHex;
  });

  return denseHashString;
}

 /**
 * Part 2
 */
function solvePart2(inputString){
  var inputObject = { 
    array: getInitializedArray(256), 
    lengths: getLengthsPart2(inputString), 
    currentPosition: 0, 
    skipSize: 0 
  };

  /**
   * Second, instead of merely running one round like you did above, run a total of 64 rounds, using the same 
   * length sequence in each round. The current position and skip size should be preserved between rounds.
   */
  for(var i = 0; i < 64; i++){
    solvePart1(inputObject);
  }

  var sparseHash = inputObject.array;
  var denseHash = getCalculatedDenseHash(sparseHash);
  var denseHashString = convertDenseHashToString(denseHash);

  return denseHashString;
}

var denseHashString = solvePart2(inputPart1);
console.log(`Part 2: The Knot Hash of your puzzle input is ${denseHashString} - length=${denseHashString.length}.`);