import { Button, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'relative',
  },

  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))

export default function LoadingButton({
  loading,
  disabled,
  children,
  ...props
}) {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <Button {...props} disabled={loading || disabled}>
        {children}
      </Button>

      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </div>
  )
}
