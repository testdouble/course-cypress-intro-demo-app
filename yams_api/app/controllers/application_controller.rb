class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordInvalid do |e|
    render json: {success: false, message: e.message}, status: 422
  end

  rescue_from ActiveRecord::RecordNotFound do |e|
    render json: {success: false, message: "Not Found"}, status: 404
  end
end
