namespace :cypress do
  desc "Start test server for end-to-end testing"
  task :start do
    def docker_compose(command)
      system("docker-compose -f docker-compose.yml -f docker-compose.cypress.yml #{command}")
    end

    docker_compose("build")
    docker_compose("run --rm web rails db:reset db:prepare")
    docker_compose("up")
  end
end
