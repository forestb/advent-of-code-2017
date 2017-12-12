#!/usr/bin/env node
'use strict';

/**
 * File IO - retrieve puzzle input
 */
var fs = require('file-system');

function getFileContents(filename){
    return fs.readFileSync(`./puzzle-input/${filename}`, 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
      });
}

var part1 = getFileContents("part1.txt");
var part1example = getFileContents("part1example.txt");
var part2 = getFileContents("part2.txt");
var part2example = getFileContents("part2example.txt");

/**
 * Part 1
 */
function getProgramRelationships(input){
  var relationships = input.split("\r\n");
  var programs = {};
  
  relationships.forEach(relationship => {
    var relationshipComponents = relationship.split("<->");
    
    var programId = +relationshipComponents[0];
    var relatedProgramIds = [];

    relationshipComponents[1].split(",").forEach(id => {
      relatedProgramIds.push(+id);
    });

    programs[programId] = {programId: programId, relatedProgramIds: relatedProgramIds, searched: false};
  });

  return programs;
}

function getRelatedPrograms(relationships, id){
  var found = [];
  var search = [];

  Object.values(relationships).forEach(value => {
    value.searched = false;
  });

  // get the initial relationships to search
  found.push(id);
  search.push(...relationships[id].relatedProgramIds);
  relationships[id].searched = true;

  while(search.length > 0){
    var nextId = search.shift();
    
    if(relationships[nextId].searched == true){
      continue;
    }

    found.push(nextId);
    search.push(...relationships[nextId].relatedProgramIds);
    relationships[nextId].searched = true;
  }

  return found;
}

var valueToFind = 0;
var programRelationships = getProgramRelationships(part1);
//var programRelationships = getProgramRelationships(part1example);
var relatedPrograms = getRelatedPrograms(programRelationships, valueToFind);
console.log(`Part 1: How many programs are in the group that contains program ID ${valueToFind}? - ${relatedPrograms.length}.`);

 /**
 * Part 2
 * 
 *  For each program
 *    If this program has not already been found as a member of a group
 *      Get a list of it's related programs
 *      Store that list as a 'group'
 */
var relatedProgramGroups = [];

var programIds = Object.keys(programRelationships);

outer:
for(var i = 0; i < programIds.length; i++){
  var programId = +programIds[i];

  // was the program already found as part of another group?
  for(var j = 0; j < relatedProgramGroups.length; j++){
    if(relatedProgramGroups[j].includes(programId)){
      continue outer;
    }
  }

  // if program id not already within identified group
  var relatedProgramGroup = getRelatedPrograms(programRelationships, programId);
  relatedProgramGroups.push(relatedProgramGroup);
}

console.log(`Part 2: How many groups are there in total? - ${relatedProgramGroups.length}`);