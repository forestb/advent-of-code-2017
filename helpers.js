module.exports = {
    checkBin: checkBin,
    checkDec : checkDec,
    checkHex : checkHex,
    pad : pad,
    unpad : unpad,

    Dec2Bin : Dec2Bin,
    Dec2Hex : Dec2Hex,

    Bin2Dec : Bin2Dec,
    Bin2Hex : Bin2Hex,

    Hex2Bin : Hex2Bin,
    Hex2Dec : Hex2Dec,

    Hex2Bin : Hex2Bin
};

// Useful Functions
// https://stackoverflow.com/questions/7695450/how-to-program-hex2bin-in-javascript
function checkBin(n){return/^[01]{1,64}$/.test(n)}
function checkDec(n){return/^[0-9]{1,64}$/.test(n)}
function checkHex(n){return/^[0-9A-Fa-f]{1,64}$/.test(n)}
function pad(s,z){s=""+s;return s.length<z?pad("0"+s,z):s}
function unpad(s){s=""+s;return s.replace(/^0+/,'')}

//Decimal operations
function Dec2Bin(n){if(!checkDec(n)||n<0)return 0;return n.toString(2)}
function Dec2Hex(n){if(!checkDec(n)||n<0)return 0;return n.toString(16)}

//Binary Operations
function Bin2Dec(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(10)}
function Bin2Hex(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(16)}

//Hexadecimal Operations
function Hex2Bin(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(2)}
function Hex2Dec(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(10)}

function Hex2Bin(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(2)};