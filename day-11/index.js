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

var puzzleInputFileContents = getFileContents("day-11-part1.txt");

var example1 = "ne,ne,ne";
var example2 = "ne,ne,sw,sw";
var example3 = "ne,ne,s,s";
var example4 = "se,sw,se,sw,sw";

/**
 * Part 1
 */
function updateTraveler(traveler, direction, count){
  traveler[direction] = {direction: direction, stepCount: count};
}

function getInitializedTraveler(){
  var traveler = {};

  var cardinalDirections = ["n", "ne", "nw", "s", "se", "sw"];
  
  cardinalDirections.forEach(direction => {
    updateTraveler(traveler, direction, 0);
  });

  return traveler;
}

function travel(traveler, direction){  
  traveler[direction].stepCount++;
}

function getTravelerDisplacement(traveler){
  var travelerCopy = {};

  Object.values(traveler).forEach(element => {
    updateTraveler(travelerCopy, element.direction, element.stepCount);
  });

  travelerCopy["sw"].stepCount -= traveler["sw"].stepCount <= traveler["ne"].stepCount ? traveler["sw"].stepCount : traveler["ne"].stepCount;
  travelerCopy["ne"].stepCount -= traveler["sw"].stepCount <= traveler["ne"].stepCount ? traveler["sw"].stepCount : traveler["ne"].stepCount;

  travelerCopy["se"].stepCount -= traveler["se"].stepCount <= traveler["nw"].stepCount ? traveler["se"].stepCount : traveler["nw"].stepCount;
  travelerCopy["nw"].stepCount -= traveler["se"].stepCount <= traveler["nw"].stepCount ? traveler["se"].stepCount : traveler["nw"].stepCount;

  travelerCopy["s"].stepCount -= traveler["s"].stepCount <= traveler["n"].stepCount ? traveler["s"].stepCount : traveler["n"].stepCount;
  travelerCopy["n"].stepCount -= traveler["s"].stepCount <= traveler["n"].stepCount ? traveler["s"].stepCount : traveler["n"].stepCount;

  var summedDirectVertical = Math.abs(travelerCopy["n"].stepCount, travelerCopy["s"].stepCount);
  var maxNorthDisplacement = Math.max(travelerCopy["ne"].stepCount, travelerCopy["nw"].stepCount);
  var maxSouthDisplacement = Math.max(travelerCopy["se"].stepCount, travelerCopy["sw"].stepCount);

  return summedDirectVertical + maxNorthDisplacement + maxSouthDisplacement;
}

function solvePuzzle(puzzleInput){
  var directions = puzzleInput.split(",");
  var traveler = getInitializedTraveler();
  var displacements = [];

  directions.forEach(direction => {
    travel(traveler, direction);
    displacements.push(getTravelerDisplacement(traveler));
  })

  console.log(`Part 1: Starting where he started, you need to determine the fewest number of steps required to reach him - ${displacements[displacements.length - 1]}.`);
  console.log(`Part 2: How many steps away is the furthest he ever got from his starting position? - ${Math.max(...displacements)}.`);
}

solvePuzzle(puzzleInputFileContents);