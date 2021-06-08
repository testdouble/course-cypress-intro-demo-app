class CreateTaskDependenciesJoinTable < ActiveRecord::Migration[6.1]
  def change
    create_table :task_dependencies, id: :uuid do |t|
      t.belongs_to :task, type: :uuid, null: false, index: true, foreign_key: true
      t.belongs_to :dependency, type: :uuid, null: false, index: true, foreign_key: {to_table: :tasks}

      t.index [:task_id, :dependency_id], unique: true

      t.check_constraint "task_id <> dependency_id"
    end
  end
end
