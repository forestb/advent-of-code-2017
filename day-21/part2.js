#!/usr/bin/env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');
var ElapsedTime = require('elapsed-time');

// const console = require('console-sync');
const util = require('util');

// https://www.npmjs.com/package/array2d#features--quick-reference
const Array2D = require('array2d');

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

  for (var i = 0; i < Array2D.height(grid); i += offset) {
    for (var j = 0; j < Array2D.width(grid); j += offset) {
      grids.push(Array2D.crop(grid, i, j, offset, offset));
    }
  }

  return grids;
}

function convertPixels(grid, rules) {
  return convertStringToGrid(rules[convertGridToString(grid)]);
}

function joinGrids(grids) {
  if (grids.length == 1) {
    return grids[0];
  }

  // stitch grids together
  var index = 0;
  var count = Math.sqrt(grids.length);

  var width = Array2D.width(grids[0]);
  var height = Array2D.height(grids[0]);

  var grid = null;

  for (var i = 0; i < height * count; i += height) {
    for (var j = 0; j < width * count; j += width) {
      if (grid == null) {
        grid = grids[index];
      }
      else {
        var isInBounds = Array2D.inBounds(grid, i, j);
        var currentValue = Array2D.get(grid, i, j);

        // Note: This is a bit of a pain; it appears the library requires grids to be rectangular and fills
        // empty positions with 'null'.  If then a value is "glued" to those coordinates, the nulls are pushed over
        // and down then extending the rectangle even more.  We need to use the "paste" function instead, for these situations
        if(!isInBounds){
          grid = Array2D.glue(grid, grids[index], i, j);
        }
        else{
          grid = Array2D.paste(grid, grids[index], i, j);
        }

        // grid = Array2D.glue(grid, grids[index], i, j);
      }

      // printGrid(grid);

      index++;
    }
  }

  grid = Array2D.crop(grid, 0, 0, count * width, count * height);
  return grid;
}

function solve() {
  var input = helpers.GetFileContentsSync("../puzzle-input/day-21-part1.txt");
  //var input = helpers.GetFileContentsSync("../puzzle-input/day-21-part1-example.txt");
  var rules = initializeRules(input);

  var grid = convertStringToGrid(".#./..#/###");
  var onCount = 0;

  var iterationCount = 5;

  var et = ElapsedTime.new().start();

  for (var i = 1; i <= iterationCount; i++) {   
    var blockCounts = {};
    // printAsync(`Iteration ${i}...`);
    console.log(`Iteration ${i}...`);

    var brokenGrids = breakPixels(grid);
    var convertedGrids = [];

    brokenGrids.forEach(grid => {
      var convertedGrid = convertPixels(grid, rules);
      convertedGrids.push(convertedGrid);
    });

    grid = joinGrids(convertedGrids);  
    console.log(`${et.getValue()} elapsed. Still working...`);
    onCount = convertGridToString(grid).split("#").length - 1;
  }

  console.log(`Part 2: How many pixels stay on after 18 iterations? - ${onCount}`);
}

solve();