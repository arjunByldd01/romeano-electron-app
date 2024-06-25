import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Setup from "./pages/setup/Setup";
import { QueryProvider } from "./providers/queryClientProvider";
import Home from "./pages/home/Home";
import FetchMeetingsContextProvider from "./context/fetchMeetingsContext";
import RecordingContextProvider from "./context/recordingContext";
function App() {
  return (
    <QueryProvider>
      <FetchMeetingsContextProvider>
        <RecordingContextProvider>
          <Router>
            <Routes>
              <Route path="/setup" Component={Setup} />
              <Route path="/" Component={Home} />
            </Routes>
          </Router>
        </RecordingContextProvider>
      </FetchMeetingsContextProvider>
    </QueryProvider>
  );
}

export default App;
