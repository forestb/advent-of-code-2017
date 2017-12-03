#!/usr/bin/env node
'use strict';

var fs = require('file-system');

/**
 * Part 1
 */
// Read puzzle file contents
var puzzleInput = fs.readFileSync('./puzzle-input/part1.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
});

function solvePart1(input){
        var rows = input.split('\r\n');
        var sum = 0;

        rows.forEach((element, index) => {

        // Remove all whitespace except one space
        var columns = element.split(' ').map(function(item) {
            return parseInt(item, 10);
        });

        /**
         * The new spread operator is a shorter way of writing the apply solution to get the maximum of an array
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator
         */
        var rowMax = Math.max(...columns);
        var rowMin = Math.min(...columns);

        sum += (rowMax - rowMin);
    });

    console.log(`The answer to part 1 is ${sum}.`);
}

//solvePart1(puzzleInput);

/**
 * Part 2
 */
function solvePart2(input){
        var rows = input.split('\r\n');
        var sum = 0;

        rows.forEach((element, index) => {
            // Convert the string array into an integer array
            var columns = element.split(' ').map(function(item) {
                return parseInt(item, 10);
            });

            sum += calculateDivideByTwo(columns);
    });

    console.log(`The answer to part 2 is ${sum}.`);
}

/**
 * Helper function(s)
 */
function calculateDivideByTwo(columns){
    for(var i = 0; i < columns.length; i++){
        for(var j = 0; j < columns.length; j++){
            if( i != j){
                var larger = Math.max(columns[i], columns[j]);
                var smaller = Math.min(columns[i], columns[j]); 

                if(larger % smaller == 0){
                    var result = larger / smaller;
                    return result;
                }
            }
        }
    }
}

solvePart2(puzzleInput);