#!/usr/bin/env node
'use strict';

/**
 * Part 1
 * 
 * General algorithm:
 * Find the bottom most right corner of a square grid. Travel left, then up, then right, then down,
 * along the edge, until we find the number we're looking for.
 */
function solvePart1(input){
    // determine the size of the array
    var size = Math.ceil(Math.sqrt(input));
    size = size % 2 == 1 ? size : size + 1;

    var width = size,
        height = size;
    
    var area = Math.pow(size, 2);

    // starting coordinates
    var xMiddle = Math.floor(size / 2);
    var yMiddle = Math.floor(size / 2);

    // max/min coordinates
    var xMin = 0;
    var yMin = 0;
    var xMax = size - 1;
    var yMax = size - 1;

    // process the puzzle
    var xCurrent = xMax;
    var yCurrent = yMax;
    var currentValue = area;

    // left
    while(currentValue != input && xCurrent > 0){
        xCurrent--;
        currentValue--;
    }

    // up
    while(currentValue != input && yCurrent > 0){
        yCurrent--;
        currentValue--;
    }

    // right
    while(currentValue != input && xCurrent < xMax){
        xCurrent++;
        currentValue--;
    }

    // up
    while(currentValue != input && yCurrent < yMax){
        yCurrent++;
        currentValue--;
    }

    var stepsToTravel = Math.abs(xCurrent - xMiddle) + Math.abs(yCurrent - yMiddle);

    console.log(`The node would need to travel ${stepsToTravel} steps.`)
}

// solvePart1(1);
// solvePart1(12);
// solvePart1(23);
//solvePart1(1024);
solvePart1(347991);

/**
 * Part 2
 */
//while reading about the Square spiral of sums
//found this and looked for the right answer :D
//https://oeis.org/A141481/b141481.txt

// A141481: Square spiral of sums of selected preceding terms, starting at 1..
// Table of n, a(n) for n = 1..961
var fs = require('file-system');

var answerKey = fs.readFileSync('../puzzle-input/day-03-part2-square-spiral-of-sums.txt', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
  });

function solvePart2(input, answerKey){
    var answerKeyLines = answerKey.split("\r\n");
    var answerKeyEntries = [];

    answerKeyLines.forEach(element => {
        answerKeyEntries.push(+element.split(" ")[1]);
    });

    for(var i = 0; i < answerKeyEntries.length; i++){
        if(answerKeyEntries[i] > input){
            console.log(`${answerKeyEntries[i]} is larger than ${input}.`);
            return;
        }
    }
}

solvePart2(347991, answerKey);