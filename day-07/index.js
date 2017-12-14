#!/usr/bin/env node
'use strict';

/**
 * File IO - retrieve puzzle input
 */
var fs = require('file-system');
var HashMap = require('hashmap');

function getFileContents(filename){
    return fs.readFileSync(`../puzzle-input/${filename}`, 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
      });
}

var part1 = getFileContents("day-07-part1.txt");
var part1example = getFileContents("day-07-part1-example.txt");

/**
 * Helpers/extensions
 */
Array.prototype.contains = function(element){
  return this.indexOf(element) > -1;
};

HashMap.prototype.contains = function(key){
  return this.get(key);
};

/**
 * Part 1
 */
var nodes = new HashMap();
var children = [];

var lines = part1.split("\r\n");

lines.forEach(element => {
  var records = element.split("->");

  var name = records[0].split(" ")[0];
  var weight = +records[0].split(" ")[1].replace("(", "").replace(")", "");

  var node = { name: `${name}`, weight: +weight, totalWeight: +weight, level: null, children: []};

  var hasChildren = records.length > 1;

  if(hasChildren){
    records[1].split(",").forEach(childElement =>{
      children.push(childElement.trim());
      node.children.push(childElement.trim())
    });
  }

  nodes.set(name, node);
});

var rootNodeName;

nodes.forEach(function(value, key){
  var name = value.name;

  if(!children.contains(name)){
    rootNodeName = name;
  }
});

console.log(`Part 1: The name of the bottom program is ${rootNodeName}.`);

 /**
 * Part 2 helper(s)
 */
function areAllLevelsAssigned(nodes){
  for(var i = 0; i < nodes.values().length; i++){
    if(nodes.values()[i].level == null){
      return false;
    }
  }

  return true;
}

function getMaxDepth(nodes){
  var depth = [];
  
  nodes.values().forEach(element =>{
    depth.push(element.level);
  });
  
  return Math.max(...depth);
}

function sumLevels(nodes, level){
  nodes.forEach(function(value, key){
    if(value.level == level){
      var children = value.children;
      var weight = value.totalWeight;

      children.forEach(element => {
        var result = nodes.get(element);
        weight += result.totalWeight;
      });

      value.totalWeight = weight;
    }
  });
}

 /**
 * Part 2
 * Note: I am not particularly proud of this solution. It was a bit confusing
 * because I thought initially that the upper-most branch was the one that needed to be
 * adjusted. Also I definitely need to work on my naming here.
 */
nodes.get(rootNodeName).level = 1;

while(!areAllLevelsAssigned(nodes)){
  nodes.forEach(function(value, key){
    // find the parent for the current key
    // set the current level to the parent's level + 1
    nodes.forEach(function(subValue, subKey){
      if(subValue.children.contains(key) && subValue.level != null){
        value.level = subValue.level + 1;
      }
    });
  });
}

for(var i = getMaxDepth(nodes); i > 0; i--){
  sumLevels(nodes, i);
}

// recursively process each node and all it's child nodes
nodes.forEach(function(value, key){
  if(value.level == 2){
    console.log(value);
    printChildren(key);
  }  
});

function printChildren(name){
  var children = nodes.get(name).children;

  if(children.length == 0){
    return;
  }

  var weights = [];

  children.forEach(name => {
    weights.push(nodes.get(name).totalWeight);
  });

  var areWeightsDifferent = Math.max(...weights) != Math.min(...weights);

  if(areWeightsDifferent){
    console.log(`Part 2: The weight to be adjusted can be found in one of the following sets...`);

    children.forEach(name => {      
      console.log(nodes.get(name));
    });
  }

  children.forEach(element => {
    printChildren(element);
  });
}