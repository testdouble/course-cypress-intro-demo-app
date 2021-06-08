import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './pages/Home'
import Task from './pages/Task'
import NewTask from './pages/NewTask'

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/tasks/new" component={NewTask} />
        <Route exact path="/tasks/:id" component={Task} />
      </Switch>
    </Router>
  )
}
