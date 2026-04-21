// import "./index.css";

import { BrowserRouter as Router, Routes, Route } from "react-router";
import { VideoPage } from "./screens/VideoPage";
import { SignIn } from "./screens/SignIn";
import { SignUp } from "./screens/SignUp";
import { Home } from "./screens/Home";

export function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/watch" element={<VideoPage/>} />
        <Route path="/signup" element={<SignIn/>} />
        <Route path="/signin" element={<SignUp/>} />
        <Route path="/" element={<Home/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
