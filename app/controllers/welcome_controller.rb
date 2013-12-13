class WelcomeController < ApplicationController
  def index
  end
  def show
    storyId = Time.now.month
    storyObject = YAML.load(File.read("#{Rails.root}/lib/stories/story#{storyId}.yml"))
    render json: storyObject
  end
end
