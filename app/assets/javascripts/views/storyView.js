App.Views.Story = Backbone.View.extend({
  el: '#story',
  template: JST['story/main'],
  initialize: function(){
    this.$el.append(this.template());
  }
});
