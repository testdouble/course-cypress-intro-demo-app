class Task < ApplicationRecord
  enum status: [:backlog, :in_progress, :pr_review, :testing, :done]

  validates :title, :description, :status, presence: true

  has_many :task_dependencies, dependent: :destroy
  has_many :task_dependents, class_name: "TaskDependency", foreign_key: :dependency_id, dependent: :destroy
  has_many :dependencies, through: :task_dependencies, source: :dependency
  has_many :dependents, through: :task_dependents, source: :task

  scope :with_dependencies, -> { includes(:dependencies) }
  scope :with_dependents, -> { includes(:dependents) }
end
