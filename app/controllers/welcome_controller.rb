class WelcomeController < ApplicationController
  def index
  end
  def show
    storyObject = YAML.load(File.read("#{Rails.root}/app/assets/story.yml"))
    render json: storyObject
  end
end
