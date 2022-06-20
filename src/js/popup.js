var server = {
  __call:function(method,params,responseCallback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {method:method,params:params},
        responseCallback || function(r) {}
      );
    });
  },
  getInfo:function(responseCallback){
    server.__call('getInfo', [], responseCallback);
  },
  setTheme:function(index, responseCallback){
    server.__call('setTheme', [index], responseCallback);
  }
}

server.getInfo(function(response) {
  $("ul").children().remove();
  var themes = response.themes;
  var index = response.themeIndex;
  for (var i in themes) {

    // remove prefix
    var theme = themes[i].split(' ').pop();
    if (theme == "")
        theme = "(no theme)"

    $("ul").append($("<li><a href='javascript:' id='"+i+"'>"+theme+"</a></li>"));
  }

  var displayCurrent = function(index) {
    $("a").removeClass("current");
    $("a[id="+index+"]").addClass("current");
  }

  $("a").click(function(){
    var index = $(this).attr("id");
    server.setTheme(index);
    displayCurrent(index)
  });

  displayCurrent(index);

});
