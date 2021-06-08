Task.find_or_initialize_by(title: "Update verbiage").tap do |task|
  task.update!(
    description: "Update the verbiage on the landing page to hello world",
    status: :backlog,
    estimate: "1"
  )
end

Task.find_or_initialize_by(title: "Add cool widget").tap do |task|
  task.update!(
    description: "Add the thing to that page",
    status: :in_progress,
    estimate: "5"
  )
end
