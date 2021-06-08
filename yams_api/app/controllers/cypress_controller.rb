class CypressController < ApplicationController
  def reset
    Task.destroy_all

    render json: {success: true}
  end
end
