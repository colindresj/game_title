App.Collections.Chapters = Backbone.Collection.extend({
  url: '/story',
  model: App.Models.Chapter,
  initialize: function(){
    this.fetch();
    // this.riddles = new App.Collections.Riddles();
  }
});
