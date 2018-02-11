#!/usr/bin/env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');
var ElapsedTime = require('elapsed-time');

// const console = require('console-sync');
const util = require('util');

// https://www.npmjs.com/package/array2d#features--quick-reference
const Array2D = require('array2d');

// profiling
// https://www.codementor.io/codementorteam/nodejs-profiling-build-a-high-performance-app-babjg4jf9
// node --prof server.js
// node --prof-process isolate-0x101804a00-v8.log

/**
 * Part 1
 */
function initializeRules(input) {
  var rules = {};

  input.split("\r\n").forEach(rule => {
    var inputRule = rule.split("=>")[0].trim();
    var outputRule = rule.split("=>")[1].trim();

    addRuleSubsets(rules, inputRule, outputRule);
  });

  return rules;
}

function addRuleSubsets(rules, inputRule, outputRule) {
  // generate possible inputs as keys for the output rule
  var grid = convertStringToGrid(inputRule);

  rules[convertGridToString(grid)] = outputRule;
  rules[convertGridToString(Array2D.transpose(grid))] = outputRule;

  grid = Array2D.rrotate(grid);

  rules[convertGridToString(grid)] = outputRule;
  rules[convertGridToString(Array2D.transpose(grid))] = outputRule;

  grid = Array2D.rrotate(grid);

  rules[convertGridToString(grid)] = outputRule;
  rules[convertGridToString(Array2D.transpose(grid))] = outputRule;

  grid = Array2D.rrotate(grid);

  rules[convertGridToString(grid)] = outputRule;
  rules[convertGridToString(Array2D.transpose(grid))] = outputRule;
}

function convertStringToGrid(s) {
  var grid = [];
  var rows = s.split("/");

  rows.forEach(row => {
    grid.push([]);
    row.split("").forEach(column => {
      grid[grid.length - 1].push(column);
    });
  });

  return grid;
}

function convertGridToString(grid) {
  var s = "";

  grid.forEach(row => {
    row.forEach(column => {
      s += column;
    });

    s += "/";
  });

  return s.substr(0, s.length - 1);
}

function breakPixels(grid, rules) {
  var grids = [];
  var gridSize = Array2D.width(grid);

  // If the size is evenly divisible by 2, break the pixels up into 2x2 squares
  // Otherwise, the size is evenly divisible by 3; break the pixels up into 3x3 squares
  var offset = (gridSize % 2 == 0 ? 2 : 3);

  var height = Array2D.height(grid);
  var width = Array2D.width(grid);

  for (var i = 0; i < height; i += offset) {
    for (var j = 0; j < width; j += offset) {
      grids.push(Array2D.crop(grid, i, j, offset, offset));
    }
  }

  return grids;
}

function convertPixels(grid, rules) {
  var gridAsString = convertGridToString(grid);

  var ruleToApply = rules[gridAsString];

  return convertStringToGrid(ruleToApply);
}

function joinGridStrings(grids){
  if (grids.length == 1) {
    return grids[0];
  }

  // the new, composed grid will contain the sqrt of the number of grids to combin
  var gridsToCombineWidthCount = Math.sqrt(grids.length);
  var gridsToCombineHeightCount = Math.sqrt(grids.length);

  var unitGridWidth = Array2D.width(grids[0]);
  var unitGridHeight = Array2D.height(grids[0]);

  // loop through the number of grids to collect
  // for each of those grids, append all of that grids rows
  // return that as a string
  var composedGrid = [];

  // process this many sets of rows of grids
  for(var size = 0; size < gridsToCombineHeightCount; size++){

    // select all the grids to process for each row
    var gridsToProcess = [];

    for(var i = 0; i < gridsToCombineWidthCount; i++){
      gridsToProcess.push(grids.shift());
    }
    
    // for each grid to process, process each of its rows
    for(var i = 0; i < unitGridHeight; i++){
      var tempGridRow = [];

      gridsToProcess.forEach(grid => {
        tempGridRow = tempGridRow.concat(grid[i]);
      });

      composedGrid.push(tempGridRow);
    }
  }  

  return composedGrid;
}

function solve() {
  var input = helpers.GetFileContentsSync("../puzzle-input/day-21-part1.txt");
  // var input = helpers.GetFileContentsSync("../puzzle-input/day-21-part1-example.txt");
  var rules = initializeRules(input);

  var grid = convertStringToGrid(".#./..#/###");
  var onCount = 0;

  var iterationCount = 18;

  var et = ElapsedTime.new().start();

  for (var i = 1; i <= iterationCount; i++) {   
    var blockCounts = {};
    // printAsync(`Iteration ${i}...`);
    console.log(`Iteration ${i}...`);

    var brokenGrids = breakPixels(grid);
    var convertedGrids = [];

    // for each broken grid
    brokenGrids.forEach(grid => {
      // converts grids to strings, finds their conversion, and converts them back to grids
      var convertedGrid = convertPixels(grid, rules);
      convertedGrids.push(convertedGrid);
    });

    // convert broken strings to unified grid
    grid = joinGridStrings(convertedGrids);

    console.log(`${et.getValue()} elapsed. Still working...`);
    onCount = convertGridToString(grid).split("#").length - 1;
  }

  console.log(`Part 2: How many pixels stay on after 18 iterations? - ${onCount}`);
}

solve();