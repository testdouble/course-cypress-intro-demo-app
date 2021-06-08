import { QueryClient, QueryClientProvider } from 'react-query'
import { SnackbarProvider } from './components/Snackbar'
import Routes from './Routes'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <Routes />
      </SnackbarProvider>
    </QueryClientProvider>
  )
}
