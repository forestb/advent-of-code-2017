#!/usr/bin/env node
'use strict';

var fs = require('file-system');
var nodeUnique = require('node-unique-array');

/**
 * Part 1
 */
// Read puzzle file contents
var puzzleInput = fs.readFileSync('./puzzle-input/part1.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
});

/**
 * Part 1 
 */
function solvePart1(input){        
    // put all elements in their own line
    input = input.split("\r\n");

    var passphraseCount = input.length;
    var validPassphraseCount = 0;

    input.forEach(element => {
        var unique_array = new nodeUnique();

        var splitResults = element.split(" ");
        unique_array.add(...splitResults);
    
        var totalElementCount = splitResults.length;
        var uniqueElementCount = unique_array.uniqueArray.length;

        var isPassphraseValid = totalElementCount == uniqueElementCount;

        if(isPassphraseValid){
            validPassphraseCount++;
        }
    });

    console.log(`Part 1: Out of ${passphraseCount} passphrases, ${validPassphraseCount} are valid.`);
}

// solvePart1("aa bb cc dd ee");
// solvePart1("aa bb cc dd aa");
// solvePart1("aa bb cc dd aaa");
solvePart1(puzzleInput);

/**
 * Part 2 
 */
function solvePart2(input){
    // put all elements in their own line
    input = input.split("\r\n");

    var passphraseCount = input.length;
    var validPassphraseCount = 0;

    input.forEach(element => {
        var unique_array = new nodeUnique();

        var splitResults = element.split(" ");

        // part 2 -> sort each element alphabetically before hashing it
        splitResults.forEach(element => {
            var sortedElement = element.split("").sort(alphabetical).join("");
            unique_array.add(sortedElement);
        });
    
        var totalElementCount = splitResults.length;
        var uniqueElementCount = unique_array.uniqueArray.length;

        var isPassphraseValid = totalElementCount == uniqueElementCount;

        if(isPassphraseValid){
            validPassphraseCount++;
        }
    });

    console.log(`Part 2: Out of ${passphraseCount} passphrases, ${validPassphraseCount} are valid.`);
}

function alphabetical(a, b)
{
     var A = a.toLowerCase();
     var B = b.toLowerCase();
     if (A < B){
        return -1;
     }else if (A > B){
       return  1;
     }else{
       return 0;
     }
}

// solvePart2("abcde fghij");
// solvePart2("abcde xyz ecdab");
// solvePart2("a ab abc abd abf abj");
// solvePart2("iiii oiii ooii oooi oooo");
// solvePart2("oiii ioii iioi iiio");

solvePart2(puzzleInput);