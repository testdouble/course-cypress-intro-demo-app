import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core'
import LoadingButton from '../../components/LoadingButton'

export default function ConfirmDeleteDialog({
  open,
  deleting,
  task,
  onCancel,
  onConfirm,
}) {
  const deleteTask = () => onConfirm(task)

  return (
    <Dialog open={open} maxWidth="xs">
      <DialogTitle>Delete Task</DialogTitle>

      <DialogContent dividers>
        <Typography variant="body1">
          Are you sure want to delete this task?
        </Typography>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          color="secondary"
          variant="contained"
          loading={deleting}
          onClick={deleteTask}
        >
          Yes
        </LoadingButton>

        <Button disabled={deleting} onClick={onCancel}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}
