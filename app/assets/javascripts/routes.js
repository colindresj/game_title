App.Router = Backbone.Router.extend({
  routes: {
    ""       : "index"
  },
  initialize: function(){
    Backbone.history.start();
    App.story = new App.Views.Story({ collection: new App.Collections.Chapters() });
  },
  index: function(){}
});
