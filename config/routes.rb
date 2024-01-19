Rails.application.routes.draw do
  resources :storefronts do
    member do
      get 'reasons/:reason_id/edit', to: 'storefronts#edit_reason', as: 'edit_reason', defaults: { format: 'json' }
      patch 'save_draft', to: 'storefronts#save_draft', as: 'save_draft', defaults: { format: 'json' }
      get 'publish_draft', to: 'storefronts#publish_draft', as: 'publish_draft', defaults: { format: 'json' }
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "storefronts#edit", id: 1
end
