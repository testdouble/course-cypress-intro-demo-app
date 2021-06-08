import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core'
import BlockIcon from '@material-ui/icons/Block'

export default function Blocking({ task: { dependents }, otherTasks }) {
  if (dependents.length === 0) return null

  return (
    <>
      <Box mb={1}>
        <Typography variant="subtitle1">Blocking</Typography>
      </Box>

      <List dense>
        {dependents.map(dependentId => (
          <ListItem key={dependentId}>
            <ListItemIcon>
              <BlockIcon />
            </ListItemIcon>

            <ListItemText primary={otherTasks[dependentId].title} />
          </ListItem>
        ))}
      </List>
    </>
  )
}
