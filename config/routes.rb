Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    resources :users, only: [:create, :update]
    resource :session, only: [:show, :create, :destroy]
    
    resources :posts, only: [:index, :show, :create, :update, :destroy]
    resources :reactions, only: [:create, :destroy, :index]
    resources :comments, only: [:destroy,:create, :index]
  end
  
  get '*path', to: 'static_pages#frontend', 
  constraints: lambda {|req| !req.xhr? && req.format.html?}
  
  root to: 'static_pages#frontend'
end

