import { pick, pipe } from 'ramda/es'

// TODO: env
const apiHost = 'http://localhost:3001'

const taskParams = task => ({
  ...pick(['title', 'description', 'status', 'estimate'], task),
  ...(task.dependencies && { dependency_ids: task.dependencies }),
})

const taskBody = pipe(taskParams, task => JSON.stringify({ task }))

const headers = { 'Content-Type': 'application/json' }

class RequestError extends Error {
  constructor({ status, message }) {
    super(message)
    this.status = status
  }
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...options.headers },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new RequestError({
      message: data.message,
      status: response.status,
    })
  }

  return data
}

export const getTasks = () => request(`${apiHost}/tasks`)
export const getTask = id => request(`${apiHost}/tasks/${id}`)

export const createTask = task =>
  request(`${apiHost}/tasks`, {
    method: 'POST',
    body: taskBody(task),
  })

export const updateTask = task =>
  request(`${apiHost}/tasks/${task.id}`, {
    method: 'PUT',
    body: taskBody(task),
  })

export const deleteTask = task =>
  request(`${apiHost}/tasks/${task.id}`, { method: 'DELETE' })
