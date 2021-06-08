import { useMemo } from 'react'
import { useWatch, Controller } from 'react-hook-form'
import { difference } from 'ramda/es'
import {
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import AddIcon from '@material-ui/icons/Add'
import BlockIcon from '@material-ui/icons/Block'
import DeleteIcon from '@material-ui/icons/Delete'

export default function Blockers({
  form: { control, getValues, setValue },
  task,
  otherTasks,
}) {
  const watchedDependencies = useWatch({
    control,
    name: 'dependencies',
    defaultValue: task?.dependencies || [],
  })

  const availableDependencies = useMemo(
    () => difference(Object.keys(otherTasks), task?.dependents || []),
    [task?.dependents, otherTasks],
  )

  const removeDependency = dependencyId => {
    const dependencies = getValues('dependencies')
    const newDependencies = dependencies.filter(id => id !== dependencyId)

    setValue('dependencies', newDependencies)
  }

  return (
    <>
      <Box mb={1}>
        <Typography variant="subtitle1">Blocked by</Typography>
      </Box>

      {watchedDependencies.length > 0 && (
        <List dense>
          {watchedDependencies.map(dependencyId => (
            <ListItem key={dependencyId}>
              <ListItemIcon>
                <BlockIcon />
              </ListItemIcon>

              <ListItemText primary={otherTasks[dependencyId].title} />

              <ListItemSecondaryAction>
                <IconButton
                  aria-label="remove dependency"
                  color="secondary"
                  edge="end"
                  onClick={() => removeDependency(dependencyId)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <Controller
        control={control}
        name="dependencies"
        renderTags={() => null}
        render={({ field }) => (
          <Autocomplete
            {...field}
            multiple
            filterSelectedOptions
            options={availableDependencies}
            getOptionLabel={id => otherTasks[id].title}
            renderOption={id => (
              <Grid container spacing={1}>
                <Grid item>
                  <AddIcon />
                </Grid>

                <Grid item>{otherTasks[id].title}</Grid>
              </Grid>
            )}
            renderInput={params => (
              <TextField
                fullWidth
                label="Search tasks"
                inputRef={params.InputProps.ref}
                inputProps={params.inputProps}
                variant="outlined"
              />
            )}
            onChange={(_, data) => field.onChange(data)}
          />
        )}
      />
    </>
  )
}
