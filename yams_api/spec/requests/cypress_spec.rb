require "rails_helper"

RSpec.describe "Cypress", type: :json_request do
  describe "GET /reset" do
    before { create_list(:task, 3, :backlog) }

    it "destroys all tasks" do
      expect { get "/cypress/reset" }.to change(Task, :count).from(3).to(0)
      expect(body).to include(success: true)
    end
  end
end
