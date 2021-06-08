class TaskDependency < ApplicationRecord
  validate :no_self_dependencies

  belongs_to :task
  belongs_to :dependency, class_name: "Task"

  private

  def no_self_dependencies
    errors.add(:task_id, "cannot depend on itself") if task_id == dependency_id
  end
end
