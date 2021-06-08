import { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { indexBy, lensProp, over, prop } from 'ramda/es'
import { Box, Button, Container, LinearProgress } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { useCreateTask, useGetTasks } from '../api-hooks'
import * as Status from '../task-status'
import useSearchParams from '../hooks/use-search-params'
import { useSnackbar } from '../components/Snackbar'
import TaskForm from '../components/TaskForm'

const prepareTasks = over(lensProp('tasks'), indexBy(prop('id')))

function NewTaskPage({ otherTasks }) {
  const params = useSearchParams()
  const history = useHistory()
  const { setAlert } = useSnackbar()

  const onSuccess = useCallback(() => {
    setAlert({ type: 'success', message: 'Created task!' })
    history.push('/')
  }, [history, setAlert])

  const mutation = useCreateTask(onSuccess)

  const cancel = useCallback(() => history.push('/'), [history])

  const task = { status: Status.verify(params.get('status')) }

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Button
          component={Link}
          to="/"
          size="large"
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>

        <Box mt={2}>
          <TaskForm
            task={task}
            otherTasks={otherTasks}
            loading={mutation.isLoading}
            onCancel={cancel}
            onSave={mutation.mutate}
          />
        </Box>
      </Box>
    </Container>
  )
}

export default function NewTaskController() {
  const { isLoading, error, data } = useGetTasks({ transform: prepareTasks })

  if (isLoading) return <LinearProgress color="secondary" />
  if (error) return <Alert severity="error" error={error.message || error} />

  return <NewTaskPage otherTasks={data.tasks} />
}
