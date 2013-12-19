App.Collections.Chapters = Backbone.Collection.extend({
  url: '/story',
  model: App.Models.Chapter,
  initialize: function(){

    // grab the current user points and hints left or set to 0 and 3 if not saved
    this.points = parseInt(this.getPoints(), 10) || 0;
    this.hints = parseInt(this.getHints(), 10) || 10;

    // manually fetch the collection of chapters because our json response contains
    // more than just models. It has title and author as well, so we have to manually
    // add models and assign collection attributes
    $.ajax({
      url: this.url,
      context: this,
      type: 'GET'
    })
    .done(function(response) {
      this.title = response.title;
      this.author = response.author;
      _.each(response.chapters, function(chapter){
        this.add(new this.model(chapter));
      }, this);
      this.trigger('done');
      this.trigger('sync');
    })
    .fail(function() {
      console.log("Couldn't load story.");
    });
  },
  saveProgress: function(currentChapter){
    localStorage.setItem('currentChapter', currentChapter);
  },
  getProgress: function(){
    return localStorage.getItem('currentChapter');
  },
  finishGame: function(){
    localStorage.setItem('gameComplete', true);
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
