require "rails_helper"

RSpec.describe TaskDependency do
  describe "associations" do
    it { should belong_to :task }
    it { should belong_to :dependency }
  end

  describe "validations" do
    context "self dependencies" do
      let(:task) { create(:task, :backlog) }

      subject { TaskDependency.new(task: task, dependency: task) }

      it "validates a task can't have itself as a dependency" do
        expect(subject).to_not be_valid
        expect(subject.errors[:task_id]).to include("cannot depend on itself")
      end
    end
  end
end
