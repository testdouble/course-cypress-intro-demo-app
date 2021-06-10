namespace :cypress do
  desc "Start test server for end-to-end testing"
  task :start do
    exec("RAILS_ENV=test bin/rails db:reset db:prepare && RAILS_ENV=test bin/rails s")
  end
end
