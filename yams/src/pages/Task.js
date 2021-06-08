import { useCallback, useMemo } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { identity, indexBy, lensProp, over, pipe, prop, reject } from 'ramda/es'
import { Button, Box, Container, LinearProgress } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import {
  useDeleteTask,
  useGetTask,
  useGetTasks,
  useUpdateTask,
} from '../api-hooks'
import * as Maybe from '../maybe'
import { useSnackbar } from '../components/Snackbar'
import TaskForm from '../components/TaskForm'

const prepareTasks = task =>
  task
    ? over(
      lensProp('tasks'),
      pipe(
        reject(({ id }) => id === task.id),
        indexBy(prop('id')),
      ),
    )
    : identity

const prepareTask = over(lensProp('task'), task => ({
  ...task,
  dependencies: task.dependencies.map(prop('id')),
  dependents: task.dependents.map(prop('id')),
}))

function useGetData(taskId) {
  const taskQuery = useGetTask(taskId, { retry: false, transform: prepareTask })
  const task = taskQuery.data?.task
  const transformTasks = useMemo(() => prepareTasks(task), [task])
  const tasksQuery = useGetTasks({ enabled: !!task, transform: transformTasks })
  const tasks = tasksQuery.data?.tasks

  return useMemo(
    () => ({
      isLoading: taskQuery.isLoading || tasksQuery.isLoading,
      error: taskQuery.error || tasksQuery.error,
      data: Maybe.of(task)
        .map2(Maybe.of(tasks), (task, tasks) => ({ task, tasks }))
        .value(() => null),
    }),
    [
      task,
      taskQuery.error,
      taskQuery.isLoading,
      tasks,
      tasksQuery.error,
      tasksQuery.isLoading,
    ],
  )
}

function useOnSuccess(message) {
  const history = useHistory()
  const { setAlert } = useSnackbar()

  return useCallback(() => {
    setAlert({ message, type: 'success' })
    history.push('/')
  }, [history, message, setAlert])
}

function BackButton() {
  return (
    <Button component={Link} to="/" size="large" startIcon={<ArrowBackIcon />}>
      Back
    </Button>
  )
}

function TaskPage({ task, otherTasks }) {
  const history = useHistory()
  const updateMutation = useUpdateTask(useOnSuccess('Updated task!'))
  const deleteMutation = useDeleteTask(useOnSuccess('Deleted task!'))
  const cancel = useCallback(() => history.push('/'), [history])

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <BackButton />

        <Box mt={2}>
          <TaskForm
            task={task}
            otherTasks={otherTasks}
            deleting={deleteMutation.isLoading}
            loading={updateMutation.isLoading}
            onCancel={cancel}
            onDelete={deleteMutation.mutate}
            onSave={updateMutation.mutate}
          />
        </Box>
      </Box>
    </Container>
  )
}

function Error({ error }) {
  const message = error.status === 404 ? 'Task Not Found' : error.message

  return (
    <Container maxWidth="sm">
      <Box mt={2}>
        <Box mb={2}>
          <BackButton />
        </Box>

        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {message}
        </Alert>
      </Box>
    </Container>
  )
}

export default function TaskController() {
  const { id } = useParams()
  const { isLoading, error, data } = useGetData(id)

  if (isLoading) return <LinearProgress color="secondary" />
  if (error) return <Error error={error} />

  return <TaskPage task={data.task} otherTasks={data.tasks} />
}
