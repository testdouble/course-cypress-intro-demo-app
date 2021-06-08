Rails.application.routes.draw do
  resources :tasks

  get "/cypress/reset", to: "cypress#reset" if Rails.env.test?
end
