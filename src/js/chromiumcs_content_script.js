
if (window == top) {

  var StorageArea = chrome.storage.sync;

  var load = function( readyCallback ) {
    StorageArea.get( null, function(items) {
      readyCallback(items);
    });
  }; // load

  var store = function(items) {
    StorageArea.set( items, function() {});
  }; // store


  // default settings
  var settings = {
    themeIndex: 0
  };

  var ready = function() {

      var themes = GENERATED.themes;

      var body = document.getElementsByTagName("body")[0];
      var prefixBodyClass = body.className;

      var setTheme = function(index) {
        var theme = prefixBodyClass + " " + themes[index];
        body.className = theme;

        settings['themeIndex'] = index;
        store(settings);
      }

      var nextTheme = function() {
        themeIndex = (themeIndex+1) % themes.length;
        setTheme(themeIndex);
      }

      var prevTheme = function(){
        themeIndex = (themeIndex + themes.length - 1) % themes.length;
        setTheme(themeIndex);
      }

      document.addEventListener("keydown", function(e) {
        if (e.ctrlKey && e.shiftKey && e.keyCode == 75)
          prevTheme();
        if (e.ctrlKey && e.shiftKey && e.keyCode == 76)
          nextTheme();
      }); // document.addEventListener


      // init
      var themeIndex = settings['themeIndex'];
      setTheme( themeIndex );

      var server = {
        setTheme:function(params){
          themeIndex = params[0];
          setTheme(themeIndex);
        },
        getInfo:function(params){
          return {
            themes:themes,
            themeIndex:themeIndex
          };
        }
      };

      // TODO: one format for all messages
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
          sendResponse(server[request.method](request.params));
      });


   }; // ready

  // both events need to finish
  var readyCounter = 2;
  var partialReady = function(){
    if (--readyCounter > 0) return;
    ready();
  };

  // failsafe
  setTimeout(function(){
    if (readyCounter > 0) ready();
  },500);

  load(function(s) {
    if (typeof s == typeof {})
      for (var x in s)
        settings[x] = s[x];
    partialReady();
  });

  document.addEventListener('DOMContentLoaded', partialReady, false);

} // if
