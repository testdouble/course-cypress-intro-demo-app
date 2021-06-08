# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_05_26_184958) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "task_dependencies", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "task_id", null: false
    t.uuid "dependency_id", null: false
    t.index ["dependency_id"], name: "index_task_dependencies_on_dependency_id"
    t.index ["task_id", "dependency_id"], name: "index_task_dependencies_on_task_id_and_dependency_id", unique: true
    t.index ["task_id"], name: "index_task_dependencies_on_task_id"
    t.check_constraint "task_id <> dependency_id"
  end

  create_table "tasks", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title", null: false
    t.string "description", null: false
    t.integer "status", null: false
    t.string "estimate"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "task_dependencies", "tasks"
  add_foreign_key "task_dependencies", "tasks", column: "dependency_id"
end
