/**
* Returns a range keyed by the headers of the range.
*/
function getKeyedObjectFromRange(range) {
  var values = range.getValues();
  var headerRow = values.shift();
  var returnData = [];
  
  for (var k in values) {
    var row = values[k];
    var object = {};
    for (var h in headerRow) {
      if (!headerRow[h])
        continue;
      object[headerRow[h]] = row[h];
    }
    returnData.push(object);
  }
 
  return returnData;
}

/**
* Clean an object of empty values
* Retains false drops all other empty values.
*/
function clean(obj) {
  for (var propName in obj) { 
    if (typeof obj[propName] === "string") {
      obj[propName] = obj[propName].trim();
    }

    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName];
    }
  }
  
  return obj;
}

function except(obj, keys) {
  var newObj = {};
  for (var propName in obj) {
    if (keys.indexOf(propName) > -1) {
        continue;
    }
    newObj[propName] = obj[propName];
  }
        
  return newObj;
}

/**
* Return a single key from an object/array
*/
function pluckByKey(key, object){
  var result = [];
  for( var i = 0, n = object.length;  i < n;  ++i ) {
    var o = object[i];
    result.push(o[key]);
  } 
  
  return result;
}

/**
* Returns a column of data in a single array based on a given name.
*/
function getColumnValuesByName(name, sheet) {
  var range = sheet.getDataRange();
  var rowNumber = range.getRow();
  var columnNumber = getColumnByHeaderName(name, range);
  var values = sheet.getRange(rowNumber, columnNumber, sheet.getLastRow(), 1).getValues();
  
  // Shift first record (header row)
  values.shift();
  
  // Remove empty rows
  values = values.filter(function(element){
    return element[0] == "" ? false : true;
  });
  
  // Pull first column from each row
  values = values.map(function(element){
    return element = element[0];
  });
  
  return values;
}

/**
* For the range get the column number by the name of the header of this range.
*/
function getColumnByHeaderName(name, range) {
  var firstColumnNumber = range.getColumn();
  var headerRow = range.getValues().shift();
  
  for (var k in headerRow) {
    var headerValue = headerRow[k];
    if (headerValue == name){
      return Math.round(parseFloat(k) + parseFloat(firstColumnNumber));
    }
  }
  
  return false;
}