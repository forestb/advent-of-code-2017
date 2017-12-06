'use strict';

/**
 * Libraries
 */
var hash = require('object-hash');

/**
 * Helpers/extensions
 */
Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

Array.prototype.hashKey = function(){
    return hash.keys(this);
};

Array.prototype.pushUnique = function(value){
    if(!this.contains(value)){
        this.push(value);
    }
};

/**
 * Main
 */
var puzzleSampleArrayPart1 = "0 2 7 0".split(" ");
var puzzleInputArray = "0	5	10	0	11	14	13	4	11	8	8	7	1	4	12	11".split("\t");

/**
 * Helper functions 
 */
function processBuckets(buckets, index){
    var count = buckets[index];
    buckets[index] = 0; // reset the value within the bucket
    
    index++;
    
    do{
        var indexToIncriment = index % buckets.length;
        
        buckets[indexToIncriment]++;

        index++;
        count--;
    }while(count > 0);
}

/**
 * Part 1
 */
var puzzleInput = puzzleInputArray;

var buckets = [];
var bucketStates = [];

puzzleInput.forEach(element => {
    buckets.push(+element);
});

bucketStates.pushUnique(buckets.hashKey());

var redistributionCycleCount = 0;

do{
    redistributionCycleCount++;

    var maxValueInBucket = Math.max(...buckets);
    var bucketIndexToProcess = buckets.indexOf(maxValueInBucket);

    // process the buckets
    processBuckets(buckets, bucketIndexToProcess);

    bucketStates.pushUnique(buckets.hashKey());
}while(redistributionCycleCount < bucketStates.length);

console.log(`Went through ${redistributionCycleCount} iterations before reaching a duplicate state.`);

/**
 * Part 2
 */
// Starting with the current set of bucketStates, and the current state of buckets
// how many more times can we process the buckets until, again, we reach a duplicate state...?
redistributionCycleCount = 0;
bucketStates = [];

bucketStates.pushUnique(buckets.hashKey());

do{
    redistributionCycleCount++;

    var maxValueInBucket = Math.max(...buckets);
    var bucketIndexToProcess = buckets.indexOf(maxValueInBucket);

    // process the buckets
    processBuckets(buckets, bucketIndexToProcess);

    bucketStates.pushUnique(buckets.hashKey());
}while(redistributionCycleCount < bucketStates.length);

console.log(`Went through ${redistributionCycleCount} iterations before reaching a duplicate state.`);