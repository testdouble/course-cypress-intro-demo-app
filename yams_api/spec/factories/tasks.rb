FactoryBot.define do
  factory :task do
    title { Faker::Lorem.sentence }
    description { Faker::Lorem.paragraph }
    estimate { Faker::Number.between(from: 1, to: 8).to_s }
  end
end
