module JsonRequestExampleGroup
  extend ActiveSupport::Concern

  include RSpec::Rails::RequestExampleGroup

  included do
    let(:body) { JSON.parse(response.body).with_indifferent_access }

    def get(url)
      super(url, as: :json)
    end

    def post(url, **kwargs)
      super(url, as: :json, **kwargs)
    end

    def put(url, **kwargs)
      super(url, as: :json, **kwargs)
    end

    def delete(url)
      super(url, as: :json)
    end
  end

  RSpec.configure do |config|
    config.include(self, type: :json_request)
  end
end
