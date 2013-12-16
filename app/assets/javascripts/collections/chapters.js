App.Collections.Chapters = Backbone.Collection.extend({
  url: '/story',
  model: App.Models.Chapter,
  initialize: function(){

    // grab the current user points and hints left or set to 0 and 3 if not saved
    this.points = parseInt(this.getPoints(), 10) || 0;
    this.hints = parseInt(this.getHints(), 10) || 4;
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
  pointsDrop: function(amount){
    this.points -= amount;
    this.savePoints();
    return this.points;
  },
  savePoints: function(){
    localStorage.setItem('currentPoints', this.points);
  },
  getPoints: function(){
    return localStorage.getItem('currentPoints');
  },
  lowerHints: function(){
    this.hints--;
    localStorage.setItem('hintsLeft', this.hints);
  },
  getHints: function(){
    return localStorage.getItem('hintsLeft');
  }
});
