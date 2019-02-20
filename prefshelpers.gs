function getPreferences() {
  
  uPrefs = { } ;
  uProps = PropertiesService.getUserProperties() ;

  // accountList: array of ID (strings)  
  
  accountList = uProps.getProperty('accountList') ;
  
  if ( (accountList === null) || (/^\s*$/.exec(accountList) !== null) ) {
    
     uPrefs['accountList'] = [] ;
    
  } else {
    
     uPrefs['accountList'] = accountList.split(/,/) ;
       
     for (var loop=0; loop<uPrefs['accountList'].length; ++loop) {
        uPrefs['accountList'][loop] = uPrefs['accountList'][loop].replace(/\s*/g, '') ;
     }
    
  }
  
  return uPrefs ;
  
}

function savePreferences(uPrefs) {
  
  uProps = PropertiesService.getUserProperties() ;
  uProps.setProperty('accountList', uPrefs['accountList'].join(', '));
  
}
