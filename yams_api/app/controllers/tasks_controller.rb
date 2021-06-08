class TasksController < ApplicationController
  before_action :load_task, only: [:show, :update, :destroy]

  def index
    tasks = Task.all
      .with_dependencies
      .with_dependents
      .order(updated_at: :desc)

    render json: {tasks: tasks_json(tasks)}
  end

  def show
    render json: {task: tasks_json(@task)}
  end

  def create
    task = Task.create!(task_params)

    render json: {task: tasks_json(task)}
  end

  def update
    @task.update!(task_params)

    render json: {task: tasks_json(@task)}
  end

  def destroy
    @task.destroy!

    render json: {task: @task}
  end

  private

  def tasks_json(task_or_tasks)
    task_or_tasks.as_json(include: [:dependencies, :dependents])
  end

  def load_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :description, :status, :estimate, dependency_ids: [])
  end
end
