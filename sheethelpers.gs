/**
* Create the Property list Sheet
*/
function createSheet(name) {
  // Get current spreadsheet and add our properties sheet.
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.insertSheet(name);

  return sheet;
}

/**
* Get a sheet or create if doesn't exist by name and optional headers.
*/
function getOrCreateSheetByName(name, headers, clear){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  
  // Create sheet if doesn't exist
  if (sheet == null){
    sheet = createSheet(name);
  }
  
  // Clear sheet if true
  if (clear) {
    sheet.clear();
  }
 
  // Add the headers to the sheet if the headers are defined and the sheet is empty
  if (headers != null && isSheetEmpty(sheet)) {
    var range = sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers]).setFontWeight('bold');
  }  
  
  return sheet;
}

/**
* Helper for returning the property sheet
*/
function getMainSheet(headers, clear) {
  const sheetName = "GA View Editor";
  return getOrCreateSheetByName(sheetName, headers, clear);
}

/**
* Check if sheet is empty.
*/
function isSheetEmpty(sheet) {
  return sheet.getDataRange().getValues().join("") === "";
}