
/**
* Apps Script Specific Navigation Logic
*/
function onInstall(e) {
  onOpen(e);
}

function onOpen(e) {
  SpreadsheetApp.getUi().createAddonMenu()
      .addItem('Launch Sidebar', 'showSidebar')
      .addToUi();
}

function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle('GA Bulk View Editor');
  SpreadsheetApp.getUi().showSidebar(ui);
}

/**
* Execute the application and save data to Google Analytics.
*/
function executeApp() {
  var sheet = getMainSheet();
  var data = getKeyedObjectFromRange(sheet.getDataRange());
  var ui = SpreadsheetApp.getUi();
  
  data.forEach(function(item){
    // Delete empty properties
    item = clean(item);
    
    // Generate a resource from the item, by cloning a duplicate with specified keys removed.
    var resource = except(item, ['Account ID', 'Property ID', 'Property Name', 'View ID']);
    
    // Patch the data in the GA API.
    updateViewSettings(item["Account ID"], item["Property ID"], item["View ID"], resource);
  });
  
  ui.alert('Success!', 'Your changes have been sent to Google Analytics', ui.ButtonSet.OK);
}

/**
* Return a list of the accounts from the connected GA user.
*/
function getAccounts() {
  return Analytics.Management.Accounts.list().items;
}

/**
* Return a list of GA properties by accountID
*/
function getProperties(accountId) {
  return Analytics.Management.Webproperties.list(accountId).items;
}

/**
* Return a list of GA views by accountID and PropertyID
*/
function getViews(accountId, propertyId) {
  return Analytics.Management.Profiles.list(accountId, propertyId).items;
}

/**
* Return an account summary from GA.
*/
function getAccountSummary() {
  return Analytics.Management.AccountSummaries.list().items;
}

/**
* Update View Settings
*/
function updateViewSettings(accountId, propertyId, profileId, resource)
{  
  Analytics.Management.Profiles.patch(resource, accountId, propertyId, profileId);  
}

/**
* Output the views and the settings for the selected account.
*/
function printViewList(accountId, sheet) {
  var properties = getProperties(accountId);
  var viewPropertyNames = ['name', 'websiteUrl','timezone', 'botFilteringEnabled', 'currency', 'defaultPage', 'excludeQueryParameters', 'eCommerceTracking', 'enhancedECommerceTracking',  
                           'siteSearchCategoryParameters', 'siteSearchQueryParameters', 'stripSiteSearchCategoryParameters', 'stripSiteSearchQueryParameters'];
  var final = [];
  var j,i, property, views, row;
  
  // Build hierarchy of accounts, properties, and views
  if (properties) {
    // Loop through properties
    for (i = 0; i < properties.length; i++) {
      property = properties[i];
      views = getViews(accountId, property.id);
      if (views) {
        // Loop through properties
        for (j = 0; j < views.length; j++) {
          
          // Check if we have edit access to this view.
          // If we don't continue to the next view, we require edit access to do anything.
          if (views[j].permissions.effective.indexOf('EDIT') == -1) {
            continue;
          }
          
          // Build up a new row.
          row = [
            accountId,  
            property.id,
            property.name,
            views[j].id];
          
          viewPropertyNames.forEach(function(item){
            var value = views[j][item];
            value = value === undefined ? '' : value;
            row.push(value);
          });
          
          // Push to output array
          final.push(row);
        }
      }
    }
   
    /**
    * Create the main sheet and nuke any existing data.
    */
    var headers = ['Account ID', 'Property ID', 'Property Name', 'View ID'];
    headers = headers.concat(viewPropertyNames);
    var sheet = getMainSheet(headers, true);
   
    if (final.length > 0) {
      sheet.getRange(2, 1, final.length, headers.length).setNumberFormat('@').setValues(final);
    } else {
      var ui = SpreadsheetApp.getUi();
      ui.alert('No editable views', 'There are no editable views for this account', ui.ButtonSet.OK);
    }
  }
}

