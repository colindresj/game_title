class WelcomeController < ApplicationController
  def index
  end
  def show
    storyObject = YAML.load File.read("#{Rails.root}/lib/stories/story.yml")
    render json: storyObject
  end
end
