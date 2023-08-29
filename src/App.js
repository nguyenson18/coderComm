import React from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import ThemeProvider from "./theme";
import { SnackbarProvider } from "notistack";
import SnackbarCloseButton from "./components/notistack";
import { OnlineContextProvider } from "./contexts/OnlineContext";
import { ChatContextProvider } from "./contexts/ChatContext";

function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      action={(snackbarKey) => (
        <SnackbarCloseButton snackbarKey={snackbarKey} />
      )}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <AuthProvider>
        <OnlineContextProvider>
          <ChatContextProvider>
            <BrowserRouter>
              <ThemeProvider>
                <Router />
              </ThemeProvider>
            </BrowserRouter>
          </ChatContextProvider>
        </OnlineContextProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
