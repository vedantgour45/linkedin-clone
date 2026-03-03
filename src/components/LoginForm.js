import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoading(false);
        navigate("/home");
        toast.success("Signed in successfully");
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Invalid credentials or user doesn't exist");
        console.error(error);
      });
  };

  return (
    <Container>
      <header>
        <img
          src="/images/login-logo.svg"
          alt="LinkedIn"
          onClick={() => navigate("/")}
        />
      </header>

      <FormCard>
        <TitleSection>
          <h1>Sign in</h1>
          <p>Stay updated on your professional world</p>
        </TitleSection>

        <form onSubmit={handleLogin}>
          <InputGroup>
            <input
              type="email"
              placeholder="Email or Phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <PasswordWrapper>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <ToggleButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </ToggleButton>
            </PasswordWrapper>
          </InputGroup>

          <ForgotPassword>Forgot password?</ForgotPassword>

          <SignInBtn type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </SignInBtn>
        </form>

        <Divider>
          <span>or</span>
        </Divider>

        <JoinBtn onClick={() => navigate("/signup-page")}>
          New to LinkedIn? Join now
        </JoinBtn>
      </FormCard>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background-color: #f3f2f1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;

  header {
    margin-bottom: 24px;
    img {
      width: 100px;
      cursor: pointer;
    }
  }
`;

const FormCard = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const TitleSection = styled.div`
  margin-bottom: 24px;
  h1 {
    font-size: 32px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
  }
  p {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    margin-top: 4px;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid rgba(0, 0, 0, 0.6);
    border-radius: 4px;
    font-size: 18px;
    &:focus {
      border: 2px solid var(--linkedin-blue);
      outline: none;
    }
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    padding-right: 60px !important;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  font-size: 14px;
  color: var(--linkedin-blue);
  font-weight: 600;
  cursor: pointer;
  z-index: 10;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background: rgba(10, 102, 194, 0.1);
    text-decoration: underline;
  }
`;

const ForgotPassword = styled.a`
  display: block;
  margin-bottom: 24px;
  font-size: 16px;
  font-weight: 600;
  color: var(--linkedin-blue);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const SignInBtn = styled.button`
  width: 100%;
  padding: 16px;
  background: var(--linkedin-blue);
  color: #fff;
  border-radius: 28px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;
  &:hover {
    background: var(--linkedin-blue-hover);
  }
  &:disabled {
    background: #e0e0e0;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--linkedin-text-secondary);
  margin: 24px 0;
  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #e0e0e0;
  }
  span {
    padding: 0 10px;
    font-size: 14px;
  }
`;

const JoinBtn = styled.button`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--linkedin-blue);
  color: var(--linkedin-blue);
  border-radius: 28px;
  font-size: 16px;
  font-weight: 600;
  &:hover {
    background: rgba(10, 102, 194, 0.1);
  }
`;

export default LoginForm;
