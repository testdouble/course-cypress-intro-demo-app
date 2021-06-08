require "rails_helper"

RSpec.describe "Tasks", type: :json_request do
  describe "GET /tasks" do
    let(:task1) { create(:task, :in_progress) }
    let(:task2) { create(:task, :in_progress) }
    let(:task3) { create(:task, :in_progress) }

    before do
      task1.dependencies << task2
      task2.dependencies << task3
    end

    it "returns all tasks" do
      get "/tasks"

      expect(body[:tasks]).to have_attributes(size: 3)
        .and include(hash_including(
          dependencies: [include(task_attributes(task2))],
          dependents: [],
          **task_attributes(task1)
        ))
        .and include(hash_including(
          dependencies: [include(task_attributes(task3))],
          dependents: [include(task_attributes(task1))],
          **task_attributes(task2)
        ))
        .and include(hash_including(
          dependencies: [],
          dependents: [include(task_attributes(task2))],
          **task_attributes(task3)
        ))
    end
  end

  describe "GET /tasks/:id" do
    let(:task) { create(:task, :in_progress) }
    let(:dependency) { create(:task, :in_progress) }
    let(:dependent) { create(:task, :in_progress) }

    before do
      task.dependencies << dependency
      task.dependents << dependent
    end

    it "returns the task" do
      get "/tasks/#{task.id}"

      expect(body[:task]).to include(
        dependencies: [include(task_attributes(dependency))],
        dependents: [include(task_attributes(dependent))],
        **task_attributes(task)
      )
    end
  end

  describe "POST /tasks" do
    let(:attributes) { attributes_for(:task, status: "backlog") }

    it "creates the task" do
      expect { post "/tasks", params: {task: attributes} }.to change { Task.count }.by(1)
      expect(body).to include task: include(id: be_present, **attributes)
    end

    context "with task dependencies" do
      let(:dependencies) { create_list(:task, 2, :backlog) }
      let(:task) { Task.find(body[:task][:id]) }

      before do
        attributes[:dependency_ids] = dependencies.pluck(:id)
      end

      it "can be created with task dependencies" do
        post "/tasks", params: {task: attributes}

        expect(task.dependencies).to contain_exactly(*dependencies)
      end
    end
  end

  describe "PUT /tasks/:id" do
    let!(:task) { create(:task, :backlog) }
    let(:attributes) { attributes_for(:task, status: "in_progress") }

    it "updates the task" do
      put "/tasks/#{task.id}", params: {task: attributes}

      expect(body[:task]).to include(attributes)
      expect(task.reload).to have_attributes(attributes)
    end

    context "with no existing dependencies" do
      let(:dependencies) { create_list(:task, 2, :backlog) }

      it "can be updated with task dependencies" do
        attributes[:dependency_ids] = dependencies.pluck(:id)

        put "/tasks/#{task.id}", params: {task: attributes}

        expect(task.reload.dependencies).to contain_exactly(*dependencies)
      end

      it "can't depend on itself" do
        attributes[:dependency_ids] = [task.id]

        put "/tasks/#{task.id}", params: {task: attributes}

        expect(response).to_not be_ok
        expect(body).to include(
          success: false,
          message: /Task cannot depend on itself/
        )
        expect(task.reload.dependencies).to eq []
      end
    end

    # TODO: prevent dependency depending on dependent
    context "with existing dependencies" do
      let(:dependencies) { create_list(:task, 2, :backlog) }

      before do
        task.dependencies = dependencies
        attributes[:dependency_ids] = []
      end

      it "can have dependencies removed" do
        put "/tasks/#{task.id}", params: {task: attributes}

        expect(task.reload.dependencies).to eq []
      end
    end
  end

  describe "DELETE /tasks/:id" do
    let!(:task) { create(:task, :in_progress) }

    it "deletes the task" do
      delete "/tasks/#{task.id}"

      expect(body[:task]).to include(task_attributes(task))
      expect { task.reload }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  def task_attributes(task)
    task.attributes.except("created_at", "updated_at")
  end
end
