import { useCallback, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { identity } from 'ramda/es'
import { createTask, deleteTask, getTask, getTasks, updateTask } from './api'
import { mapNonNull } from './utils'

const keys = {
  tasks: 'tasks',
  task: id => ['tasks', id],
}

const noop = () => {}

const useDataTransformer = (query, transform = identity) =>
  useMemo(
    () => ({
      ...query,
      data: mapNonNull(transform, query.data),
    }),
    [query, transform],
  )

function useQueryCache() {
  const queryClient = useQueryClient()

  return useMemo(
    () => ({
      removeTasks: () => queryClient.removeQueries(keys.tasks, { exact: true }),
      invalidateTasks: () => queryClient.invalidateQueries(keys.tasks),
      updateTasks: update =>
        queryClient.setQueryData(keys.tasks, ({ tasks }) => ({
          tasks: update(tasks),
        })),
      getTasks: () => queryClient.getQueryData(keys.tasks),
      clearTask: task =>
        queryClient.removeQueries(keys.task(task.id), { exact: true }),
      setTask: task => queryClient.setQueryData(keys.task(task.id), { task }),
    }),
    [queryClient],
  )
}

export const useGetTasks = ({ transform, ...options } = {}) =>
  useDataTransformer(useQuery(keys.tasks, getTasks, options), transform)

export const useGetTask = (id, { transform, ...options } = {}) =>
  useDataTransformer(
    useQuery(keys.task(id), () => getTask(id), options),
    transform,
  )

export function useCreateTask(onSuccess = noop) {
  const cache = useQueryCache()

  return useMutation(createTask, {
    onSuccess(data) {
      const { task } = data

      cache.removeTasks()
      task.dependencies.forEach(cache.clearTask)

      onSuccess(data)
    },
  })
}

export function useMoveTask() {
  const queryClient = useQueryClient()
  const cache = useQueryCache()

  const update = useCallback(
    ({ task, newStatus }) => updateTask({ ...task, status: newStatus }),
    [],
  )

  return useMutation(update, {
    async onMutate({ task, newStatus }) {
      const updatedTask = { ...task, status: newStatus }

      await queryClient.cancelQueries(keys.tasks)

      const previousTasks = cache.getTasks()

      cache.updateTasks(tasks => [
        updatedTask,
        ...tasks.filter(task => task.id !== updatedTask.id),
      ])

      return { previousTasks }
    },

    onSuccess(data) {
      cache.setTask(data.task)
    },

    onSettled() {
      cache.invalidateTasks()
    },
  })
}

export function useUpdateTask(onSuccess = noop) {
  const cache = useQueryCache()

  return useMutation(updateTask, {
    onSuccess(data) {
      const { task } = data

      cache.removeTasks()
      cache.setTask(task)
      task.dependencies.forEach(cache.clearTask)

      onSuccess(data)
    },
  })
}

export function useDeleteTask(onSuccess = noop) {
  const cache = useQueryCache()

  return useMutation(deleteTask, {
    onSuccess(data) {
      cache.removeTasks()
      cache.clearTask(data.task)

      onSuccess(data)
    },
  })
}
