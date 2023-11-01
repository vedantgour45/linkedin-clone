import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Header from "./components/Header";
import Home from "./components/Home";
import "./App.css";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route
            path="/home"
            element={
              <div>
                <Header />
                <Home />
              </div>
            }
          ></Route>
          <Route path="/login-page" element={<LoginForm />}></Route>
          <Route path="/signup-page" element={<SignUpForm />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
