import { createContext, useContext, useState } from 'react'
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

export const SnackbarContext = createContext()

export function SnackbarProvider({ children }) {
  const [alert, setAlert] = useState(null)

  const autoHideDuration = alert?.autoHideDuration || 3000

  const hideAlert = () => setAlert(null)

  return (
    <>
      {alert && (
        <Snackbar
          open
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'top',
          }}
          autoHideDuration={autoHideDuration}
          onClose={hideAlert}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity={alert.type}
            onClose={hideAlert}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      )}

      <SnackbarContext.Provider value={{ setAlert }}>
        {children}
      </SnackbarContext.Provider>
    </>
  )
}

export function useSnackbar() {
  return useContext(SnackbarContext)
}
