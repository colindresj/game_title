StoryApp::Application.routes.draw do
  root to: "welcome#index"
  get "/story", to: "welcome#show"
end
