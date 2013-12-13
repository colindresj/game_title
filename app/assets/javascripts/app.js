// Backbone Namespacing
window.App = {
  Templates   : {},
  Models      : {},
  Collections : {},
  Views       : {}
};


// Running the app
$(function(){
  App.router = new App.Router();
});

