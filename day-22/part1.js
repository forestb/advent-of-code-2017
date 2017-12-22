#!/usr/bin/env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');

const util = require('util')

/**
 * Classes 
 */
function Point(i, j) {
  this.i = i;
  this.j = j;
}

// Point.prototype.inspect = function () {
//   return `${this.i}, ${this.j}`;
// }

Point.prototype.toString = function () {
  return `${this.i}, ${this.j}`;
}

function Node(position, direction) {
  this.position = position;
  this.direction = direction;
}

Node.prototype.turnRight = function () {
  this.direction =
    this.direction == cardinalDirections.north ? cardinalDirections.east :
      this.direction == cardinalDirections.east ? cardinalDirections.south :
        this.direction == cardinalDirections.south ? cardinalDirections.west :
          cardinalDirections.north;
}

Node.prototype.turnLeft = function () {
  this.direction =
    this.direction == cardinalDirections.north ? cardinalDirections.west :
      this.direction == cardinalDirections.west ? cardinalDirections.south :
        this.direction == cardinalDirections.south ? cardinalDirections.east :
          cardinalDirections.north;
}

Node.prototype.isInfected = function (grid) {
  var gridValue = grid.nodes[this.position];

  if (gridValue == null) {
    grid.nodes[this.position] = ".";
  }

  return gridValue == "#" ? true : false;
}

Node.prototype.isClean = function(grid) {
  return !this.isInfected(grid);
}

Node.prototype.infect = function(grid){
  grid.nodes[this.position] = "#";
}

Node.prototype.clean = function(grid){
  grid.nodes[this.position] = ".";
}

Node.prototype.moveForward = function(){
  if(this.direction == cardinalDirections.north){
    this.position = new Point(this.position.i - 1, this.position.j);
  }
  else if(this.direction == cardinalDirections.east){
    this.position = new Point(this.position.i, this.position.j + 1);
  }
  else if(this.direction == cardinalDirections.south){
    this.position = new Point(this.position.i + 1, this.position.j);
  }
  else if(this.direction == cardinalDirections.west){
    this.position = new Point(this.position.i, this.position.j - 1);
  }
}

Node.prototype.print = function(){
  console.log(util.inspect(this));
}

var cardinalDirections = { north: "north", south: "south", east: "east", west: "west" };
var turncardinalDirections = { left: "left", right: "right" };

/**
 * Part 1 Helpers
 */

function turn(node, turnDirection) {
  if (turnDirection == turnDirection.right) {

  }
  else if (turnDirection == turnDirection.left) {

  }
}

/**
 * Part 1
 */
function initializeGrid(puzzleInput) {
  var grid = { height: null, width: null, nodes: {} };
  var rows = puzzleInput.split("\r\n");

  grid.height = rows.length;
  grid.width = rows[0].split("").length;

  for (var i = 0; i < grid.height; i++) {
    for (var j = 0; j < grid.width; j++) {
      grid.nodes[new Point(i, j)] = rows[i][j];
    }
  }

  return grid;
}

function initializeCurrentNode(grid) {
  var position = new Point(Math.floor(grid.height / 2), Math.floor(grid.width / 2));

  var currentNode = new Node(position, cardinalDirections.north);

  return currentNode;
}

function solvePart1() {
  var puzzleInput = {input: helpers.GetFileContentsSync("../puzzle-input/day-22-part1.txt")};
  //var puzzleInput = { input: helpers.GetFileContentsSync("../puzzle-input/day-22-part1-example.txt") };

  var grid = initializeGrid(puzzleInput.input);
  var currentNode = initializeCurrentNode(grid);

  var infectionCount = 0;

  for (var i = 0; i < 10000; i++) {
    if(currentNode.isInfected(grid)){
      currentNode.turnRight();
      currentNode.clean(grid);
    }
    else{
      currentNode.turnLeft();
      currentNode.infect(grid);
      infectionCount++;
    }

    currentNode.moveForward();
  }

  // 5360 - incorrect, too high
  console.log(`Part 1: Given your actual map, after 10000 bursts of activity, how many bursts cause a node to become infected? (Do not count nodes that begin infected.) - ${infectionCount}`);
}

solvePart1();

/**
* Part 2
*/
function solvePart2() {

}

solvePart2();