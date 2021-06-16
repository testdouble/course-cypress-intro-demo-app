import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { groupBy, lensProp, over, prop, propEq } from 'ramda/es'
import {
  Box,
  Button,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import AddIcon from '@material-ui/icons/Add'
import BlockIcon from '@material-ui/icons/Block'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useGetTasks, useMoveTask } from '../api-hooks'
import * as Status from '../task-status'
import TaskCard from '../components/TaskCard'

const categorizeTasks = over(lensProp('tasks'), groupBy(prop('status')))

function Task({ task, index }) {
  const isBlocked = task.dependencies.length > 0

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <TaskCard>
            <CardActionArea component={Link} to={`/tasks/${task.id}`}>
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1">{task.title}</Typography>

                  {isBlocked && (
                    <Box ml={1}>
                      <BlockIcon color="secondary" fontSize="small" />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </CardActionArea>
          </TaskCard>
        </div>
      )}
    </Draggable>
  )
}

function Column({ status, title, tasks }) {
  return (
    <Grid item xs id={`column-${status}`}>
      <Box mb={2}>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
      </Box>

      <Box mb={2}>
        <Button
          fullWidth
          component={Link}
          to={`/tasks/new?status=${status}`}
          size="small"
          startIcon={<AddIcon />}
        >
          Add Task
        </Button>
      </Box>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            height="100vh"
            style={{
              ...(snapshot.isDraggingOver && {
                backgroundColor: '#f0f0f0',
              }),
            }}
            {...provided.droppableProps}
          >
            <Grid container direction="column" spacing={2}>
              {provided.placeholder}

              {(tasks || []).map((task, index) => (
                <Grid
                  item
                  key={task.id}
                  style={{
                    ...(snapshot.isDraggingOver &&
                      task.id !== snapshot.draggingOverWith && {
                      display: 'none',
                    }),
                  }}
                >
                  <Task key={task.id} task={task} index={index} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Droppable>
    </Grid>
  )
}

function HomePage({ tasks }) {
  const moveMutation = useMoveTask()

  const moveTask = useCallback(
    (taskId, oldStatus, newStatus) => {
      const task = Object.values(tasks)
        .flat()
        .find(propEq('id', taskId))

      moveMutation.mutate({ task, newStatus })
    },
    [moveMutation, tasks],
  )

  const onDragEnd = useCallback(
    (result, provided) => {
      const taskId = result.draggableId
      const oldStatus = result.source?.droppableId
      const newStatus = result.destination?.droppableId

      if (
        result.reason === 'DROP' &&
        oldStatus &&
        newStatus &&
        newStatus !== oldStatus
      ) {
        moveTask(taskId, oldStatus, newStatus)
      }
    },
    [moveTask],
  )

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box bgcolor="white" pb={1} pt={2}>
        <Container maxWidth={false}>
          <img src="yams-logo.png" alt="yams logo" height="60" />
        </Container>
      </Box>

      <Box borderTop="5px solid #d5d5d5" pb={4} pt={2} width="100%">
        <Container maxWidth={false}>
          <Box>
            <Grid container spacing={3}>
              {Status.listWithLabels.map(({ status, label }) => (
                <Column
                  key={status}
                  status={status}
                  title={label}
                  tasks={tasks[status]}
                />
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </DragDropContext>
  )
}

export default function HomeController() {
  const { isLoading, data, error } = useGetTasks({
    retry: false,
    transform: categorizeTasks,
  })

  if (isLoading) return <LinearProgress color="secondary" />
  if (error) return <Alert severity="error">{error.message || error}</Alert>

  return <HomePage tasks={data.tasks} />
}
