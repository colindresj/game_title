App.Collections.Chapters = Backbone.Collection.extend({
  url: '/story',
  model: App.Models.Chapter,
  initialize: function(){

    // grab the current user points or set it to zero if no saved points
    this.points = parseInt(this.getPoints(), 10) || 0;
    this.fetch();
  },
  saveProgress: function(currentChapter){
    localStorage.setItem('currentChapter', currentChapter);
  },
  getProgress: function(){
    return localStorage.getItem('currentChapter');
  },
  pointsBump: function(){
    this.points += 50;
    this.savePoints();
    return this.points;
  },
  savePoints: function(){
    localStorage.setItem('currentPoints', this.points);
  },
  getPoints: function(){
    return localStorage.getItem('currentPoints');
  }
});
