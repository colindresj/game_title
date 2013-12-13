StoryApp::Application.routes.draw do
  root to: "welcome#index"
  match "story", to: "welcome#show", via: [:get]
end
