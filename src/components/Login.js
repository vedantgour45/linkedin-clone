import React from "react";
import styled from "styled-components";
import { db, auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      if (user) {
        // Check if user already exists in DB
        const userRef = collection(db, "UserInfo");
        const q = query(userRef, where("userID", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          await addDoc(userRef, {
            userID: user.uid,
            name: user.displayName,
            email: user.email,
            profilePicture: user.photoURL,
            timeStamp: new Date(),
            description: "Member at LinkedIn Clone",
          });
        }

        navigate("/home");
        toast.success("Welcome, " + user.displayName);
      }
    } catch (error) {
      console.error(error);
      toast.error("Sign-in failed. Please try again.");
    }
  };

  return (
    <Container>
      <Nav>
        <a href="/">
          <img src="/images/login-logo.svg" alt="LinkedIn" />
        </a>
        <NavButtons>
          <JoinButton onClick={() => navigate("/signup-page")}>
            Join now
          </JoinButton>
          <SignInButton onClick={() => navigate("/login-page")}>
            Sign in
          </SignInButton>
        </NavButtons>
      </Nav>

      <Section>
        <HeroContent>
          <Title>Welcome to your professional community</Title>
          <AuthBox>
            <GoogleBtn onClick={handleGoogleSignIn}>
              <img src="/images/google.svg" alt="" />
              Continue with Google
            </GoogleBtn>
            <Divider>
              <span>or</span>
            </Divider>
            <EmailBtn onClick={() => navigate("/login-page")}>
              Sign in with email
            </EmailBtn>
            <Terms>
              By clicking Continue, you agree to LinkedIn's{" "}
              <a href="/login-page">User Agreement</a>,{" "}
              <a href="/login-page">Privacy Policy</a>, and{" "}
              <a href="/login-page">Cookie Policy</a>.
            </Terms>
          </AuthBox>
        </HeroContent>
        <HeroImage>
          <img src="/images/login-hero.svg" alt="Professional Journey" />
        </HeroImage>
      </Section>

      <Footer>
        <FooterContent>
          <img
            src="/images/login-logo.svg"
            alt="LinkedIn"
            className="footer-logo"
          />
          <FooterLinks>
            <div className="column">
              <h4>General</h4>
              <a href="/signup-page">Sign Up</a>
              <a href="/">Help Center</a>
              <a href="/">About</a>
              <a href="/">Careers</a>
            </div>
            <div className="column">
              <h4>Browse</h4>
              <a href="/">Learning</a>
              <a href="/">Jobs</a>
              <a href="/">Salary</a>
              <a href="/">Mobile</a>
            </div>
            <div className="column">
              <h4>Business</h4>
              <a href="/">Talent</a>
              <a href="/">Marketing</a>
              <a href="/">Sales</a>
            </div>
          </FooterLinks>
        </FooterContent>
        <Copyright>
          <span>LinkedIn Clone © 2026. For Educational Purposes Only.</span>
        </Copyright>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  padding: 0;
  background-color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Nav = styled.nav`
  max-width: 1128px;
  margin: auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  img {
    width: 135px;
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
  }
`;

const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const JoinButton = styled.button`
  font-size: 16px;
  padding: 10px 24px;
  border-radius: 24px;
  color: var(--linkedin-text-secondary);
  font-weight: 600;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    color: var(--linkedin-text);
  }
`;

const SignInButton = styled.button`
  font-size: 16px;
  padding: 10px 24px;
  border-radius: 24px;
  border: 1px solid var(--linkedin-blue);
  color: var(--linkedin-blue);
  font-weight: 600;
  &:hover {
    background-color: rgba(10, 102, 194, 0.1);
    border-width: 2px;
  }
`;

const Section = styled.section`
  display: flex;
  align-items: center;
  margin: 0 auto;
  min-height: 700px;
  max-width: 1128px;
  width: 100%;
  padding: 40px 0;

  @media (max-width: 1128px) {
    padding: 40px 24px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px 24px 40px;
    min-height: 0;
  }
`;

const HeroContent = styled.div`
  width: 55%;
  z-index: 2;

  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const HeroImage = styled.div`
  width: 45%;
  display: flex;
  justify-content: center;

  img {
    width: 650px;
    height: auto;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    position: relative;
    right: initial;
    top: initial;
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;

    img {
      width: 100%;
      max-width: 400px;
    }
  }
`;

const Title = styled.h1`
  width: 100%;
  font-size: 56px;
  color: #2977c9;
  font-weight: 200;
  line-height: 70px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    text-align: center;
    font-size: 32px;
    line-height: 1.2;
    margin-bottom: 24px;
  }
`;

const AuthBox = styled.div`
  width: 408px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
  }
`;

const GoogleBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background-color: #fff;
  height: 56px;
  width: 100%;
  border-radius: 28px;
  border: 1px solid rgba(0, 0, 0, 0.6);
  font-size: 20px;
  color: var(--linkedin-text-secondary);
  transition: all 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    border: 2px solid var(--linkedin-text);
    color: var(--linkedin-text);
  }

  img {
    width: 24px;
  }
`;

const EmailBtn = styled(GoogleBtn)`
  font-size: 18px;
  background-color: var(--linkedin-blue);
  color: #fff;
  border: none;
  &:hover {
    background-color: var(--linkedin-blue-hover);
    color: #fff;
    border: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--linkedin-text-secondary);
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

const Terms = styled.p`
  font-size: 12px;
  color: var(--linkedin-text-secondary);
  text-align: center;
  line-height: 1.5;
  a {
    color: var(--linkedin-blue);
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Footer = styled.footer`
  background-color: #f3f2f1;
  padding: 40px 16px;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;

  .footer-logo {
    width: 100px;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 60px;

  .column {
    display: flex;
    flex-direction: column;
    gap: 12px;

    h4 {
      font-size: 14px;
      color: var(--linkedin-text);
      font-weight: 600;
    }
    a {
      font-size: 12px;
      color: var(--linkedin-text-secondary);
      font-weight: 600;
      &:hover {
        text-decoration: underline;
        color: var(--linkedin-blue);
      }
    }
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 32px;
  }
`;

const Copyright = styled.div`
  max-width: 1128px;
  margin: 32px auto 0;
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
  font-size: 12px;
  color: var(--linkedin-text-secondary);
`;

export default Login;
