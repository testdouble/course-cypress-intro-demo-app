class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks, id: :uuid do |t|
      t.string :title, null: false
      t.string :description, null: false
      t.integer :status, null: false
      t.string :estimate, null: true

      t.timestamps
    end
  end
end
