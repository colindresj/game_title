App.Collections.Chapters = Backbone.Collection.extend({
  url: '/story',
  model: App.Models.Chapter,
  initialize: function(){
    this.fetch();
  },
  saveProgress: function(currentChapter){
    localStorage.setItem('currentChapter', currentChapter);
  },
  getProgress: function(){
    return localStorage.getItem('currentChapter');
  }
});
