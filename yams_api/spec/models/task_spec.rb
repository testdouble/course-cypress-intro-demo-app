require "rails_helper"

RSpec.describe Task do
  describe "validations" do
    it { should validate_presence_of :title }
    it { should validate_presence_of :description }
    it { should validate_presence_of :status }
  end

  describe "associations" do
    it { should have_many :task_dependencies }
    it { should have_many :task_dependents }
    it { should have_many :dependencies }
    it { should have_many :dependents }

    context "self dependencies" do
      let(:task) { create(:task, :backlog) }

      it "can't have itself as a dependency" do
        expect { task.dependencies << task }.to raise_error(ActiveRecord::RecordInvalid, /cannot depend on itself/)
      end

      it "can't have itself as a dependent" do
        expect { task.dependents << task }.to raise_error(ActiveRecord::RecordInvalid, /cannot depend on itself/)
      end
    end
  end
end
