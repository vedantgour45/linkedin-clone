import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const user = localStorage.getItem("user");

  //   if (user) {
  //     const parsedUser = JSON.parse(user);
  //     // navigate("/home");
  //   }
  // }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("All fields are mandatory");
    }

    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
    }

    if (password.length < 6) {
      setErrorMessage("The password must be at least six characters long.");
    }

    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        // localStorage.setItem("user", JSON.stringify(userCredential.user));
        navigate("/home");
        toast.success("Logged in successfully");
      })
      .catch((error) => {
        toast.error("User does not exist");
        console.log(
          "user does not exist, please sign up to create an account",
          error.message
        );
      });

    setEmail("");
    setPassword("");
  };

  return (
    <Container>
      <Head>
        <button onClick={() => navigate("/")}>
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
          <img src="/images/login-logo.svg" alt="logo" />
        </button>
      </Head>
      <form onSubmit={handleLogin}>
        <Form>
          <Card>
            <div>
              <h1>Sign in</h1>
              <p>Stay updated on your professional world</p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMessage && <Error>{errorMessage}</Error>}
            <button type="submit" disabled={loading}>
              {loading ? (
                <img src="/images/dots-loading.svg" alt="loading" />
              ) : (
                <p>Sign in</p>
              )}
            </button>
          </Card>
        </Form>
      </form>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 52px;
  max-width: 100%;
  background-color: #f4f2ee;
  height: 100vh;
`;

const Head = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10%;

  img {
    width: 60px;
  }

  button {
    cursor: pointer;
    display: inline-flex;
    gap: 10px;
    border: none;
    outline: none;
    color: #0a67c2;
    border-radius: 10px;
    padding: 10px 24px;

    span {
      font-size: 17px;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }
`;

const Form = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  gap: 10px;
  /* align-items: center; */
  padding: 24px;
  background-color: #fff;
  border-radius: 10px;
  min-height: 300px;

  div {
    display: flex;
    flex-direction: column;
    gap: 8px;

    h1 {
      font-size: 30px;
      font-weight: 500;
    }

    &:nth-child(2) {
      input {
        font-size: 18px;
        padding: 15px;
        border-radius: 5px;
      }
    }
  }

  button {
    font-size: 17px;
    background-color: #0a67c2;
    border: none;
    outline: none;
    color: #fff;
    border-radius: 25px;
    display: flex;
    justify-content: center;

    &:hover {
      background-color: #054586;
      cursor: pointer;
    }

    p {
      padding: 14px;
    }

    img {
      width: 40px;
    }
  }
`;

const Error = styled.p`
  font-size: 14px;
  color: red;
  text-align: center;
`;

export default LoginForm;
