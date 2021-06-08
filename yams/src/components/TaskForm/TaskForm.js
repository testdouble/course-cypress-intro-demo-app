import { useState } from 'react'
import * as yup from 'yup'
import { identity, ifElse, isNil, map, mergeRight, pipe } from 'ramda/es'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import {
  Box,
  Button,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  MenuItem,
  TextField,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import LoadingButton from '../../components/LoadingButton'
import TaskCard from '../../components/TaskCard'
import * as Status from '../../task-status'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import Blockers from './Blockers'
import Blocking from './Blocking'

const taskSchema = yup.object().shape({
  title: yup
    .string()
    .required()
    .label('Title'),
  description: yup
    .string()
    .required()
    .label('Description'),
  status: yup
    .string()
    .required()
    .oneOf(Status.list)
    .label('Status'),
  estimate: yup.string().label('Estimate'),
  dependencies: yup
    .array()
    .of(yup.string())
    .label('Blockers'),
})

const defaultValues = {
  title: '',
  description: '',
  status: '',
  estimate: '',
  dependencies: [],
}

const isEmptyString = value => typeof value === 'string' && value.trim() === ''
const replaceValues = (matches, replaceWith) =>
  map(ifElse(matches, () => replaceWith, identity))
const nullsToEmptyStrings = replaceValues(isNil, '')
const emptyStringsToNulls = replaceValues(isEmptyString, null)
const buildDefaultValues = pipe(mergeRight(defaultValues), nullsToEmptyStrings)

function Input({ name, label, control, errors, ...props }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <TextField
          {...field}
          {...props}
          label={label}
          error={!!errors[name]}
          helperText={errors[name]?.message}
        />
      )}
    />
  )
}

const useStyles = makeStyles(theme => ({
  saveButton: {
    marginLeft: theme.spacing(1),
  },

  deleteButton: {
    marginLeft: 'auto',
  },
}))

export default function TaskForm({
  task,
  otherTasks,
  loading,
  deleting,
  onCancel,
  onDelete,
  onSave,
}) {
  const classes = useStyles()
  const [showDeleteTask, setShowDeleteTask] = useState(false)

  const form = useForm({
    defaultValues: buildDefaultValues(task),
    resolver: yupResolver(taskSchema),
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = form

  const isNew = !task?.id

  const save = handleSubmit(pipe(emptyStringsToNulls, onSave))

  return (
    <>
      <TaskCard>
        <Box p={2}>
          <CardContent>
            <Grid container direction="column" spacing={6}>
              <Grid item container spacing={4}>
                <Grid item xs={12} sm={9}>
                  <Input
                    fullWidth
                    control={control}
                    errors={errors}
                    label="Title"
                    name="title"
                  />
                </Grid>

                <Grid item xs={12} sm>
                  <Input
                    fullWidth
                    select
                    control={control}
                    errors={errors}
                    label="Status"
                    name="status"
                  >
                    {Status.listWithLabels.map(({ status, label }) => (
                      <MenuItem key={status} value={status}>
                        {label}
                      </MenuItem>
                    ))}
                  </Input>
                </Grid>
              </Grid>

              <Grid item>
                <Input
                  fullWidth
                  multiline
                  control={control}
                  errors={errors}
                  label="Description"
                  name="description"
                  rows={8}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={8} sm={4} md={3}>
                <Input
                  fullWidth
                  select
                  control={control}
                  errors={errors}
                  label="Estimate"
                  name="estimate"
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="8">8</MenuItem>
                </Input>
              </Grid>

              <Grid item>
                <Blockers form={form} task={task} otherTasks={otherTasks} />
              </Grid>

              {!isNew && (
                <Grid item>
                  <Blocking task={task} otherTasks={otherTasks} />
                </Grid>
              )}
            </Grid>
          </CardContent>

          <Box mt={2}>
            <CardActions disableSpacing>
              <Button disabled={loading} variant="outlined" onClick={onCancel}>
                Cancel
              </Button>

              <LoadingButton
                className={classes.saveButton}
                color="primary"
                loading={loading}
                variant="contained"
                onClick={save}
              >
                Save
              </LoadingButton>

              {!isNew && (
                <IconButton
                  aria-label="delete task"
                  className={classes.deleteButton}
                  color="secondary"
                  disabled={loading}
                  onClick={() => setShowDeleteTask(true)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </CardActions>
          </Box>
        </Box>
      </TaskCard>

      <ConfirmDeleteDialog
        open={showDeleteTask}
        deleting={deleting}
        task={task}
        onCancel={() => setShowDeleteTask(false)}
        onConfirm={onDelete}
      />
    </>
  )
}
