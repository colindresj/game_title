// Backbone Namespacing
window.App = {
  Models      : {},
  Collections : {},
  Views       : {}
};


// Running the app
$(function(){
  App.router = new App.Router();
});

