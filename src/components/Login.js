import React, { useEffect } from "react";
import styled from "styled-components";
import { db, auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const user = localStorage.getItem("user");
  //   if (user) {
  //     const parsedUser = JSON.parse(user);
  //     navigate("/home");
  //   }
  // }, [navigate]);

  const pushDataToDB = async (user) => {
    try {
      const userRef = collection(db, "UserInfo");
      const { uid } = user;
      // console.log(uid);

      await addDoc(userRef, {
        userID: uid,
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        timeStamp: new Date(),
        description:
          "Unlocking Professional Potential | Connecting Talent with Opportunity",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log(user);
        if (user) {
          // localStorage.setItem("user", JSON.stringify(user));
          pushDataToDB(user);
          navigate("/home");
          toast.success("Signed up successfully");
        }
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <Container>
      <Nav>
        <a href="/">
          <img src="/images/login-logo.svg" alt="main-logo" />
        </a>
        <div>
          <Join onClick={() => navigate("/signup-page")}>Join now</Join>
          <SignIn onClick={() => navigate("/login-page")}>Sign in</SignIn>
        </div>
      </Nav>
      <Section>
        <Hero>
          <h1>Welcome to your professional community</h1>
          <img src="/images/login-hero.svg" alt="" />
        </Hero>
        <Form>
          <Google onClick={handleGoogleSignIn}>
            <img src="/images/google.svg" alt="" />
            <h2>Sign in with Google</h2>
          </Google>
          <div>
            <Download>
              <a href="https://play.google.com/store/apps/details?id=com.linkedin.android&hl=en&gl=US">
                <span className="material-symbols-outlined">smartphone</span>
                <p>Download for phone</p>
              </a>
            </Download>
            <Download>
              <a href="https://apps.microsoft.com/detail/linkedin/9WZDNCRFJ4Q7?hl=en-us&gl=IN">
                <span className="material-symbols-outlined">laptop_mac</span>
                <p>Download for desktop</p>
              </a>
            </Download>
          </div>
          <Connection>
            <h1>Connect with people who can help</h1>
            <img src="/images/linkedin-connect.svg" alt="connect" />
          </Connection>
        </Form>
      </Section>
      <Banner>
        <img src="/images/background-banner.png" alt="background-banner" />
      </Banner>
      <Footer>
        <div>
          <img src="/images/login-logo.svg" alt="footer-logo" />
        </div>
        <div>
          <h2>General</h2>
          <ul>
            <li>
              <a href="#">Sign Up</a>
            </li>
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Press</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Developers</a>
            </li>
          </ul>
        </div>
        <div>
          <h2>Browse LinkedIn</h2>
          <ul>
            <li>
              <a href="#">Learning</a>
            </li>
            <li>
              <a href="#">Jobs</a>
            </li>
            <li>
              <a href="#">Salary</a>
            </li>
            <li>
              <a href="#">Mobile</a>
            </li>
            <li>
              <a href="#">Services</a>
            </li>
            <li>
              <a href="#">Products</a>
            </li>
            <li>
              <a href="#">Top Companies Hub</a>
            </li>
          </ul>
        </div>
        <div>
          <h2>Business Solutions</h2>
          <ul>
            <li>
              <a href="#">Talent</a>
            </li>
            <li>
              <a href="#">Marketing</a>
            </li>
            <li>
              <a href="#">Sales</a>
            </li>
            <li>
              <a href="#">Learning</a>
            </li>
          </ul>
        </div>
        <div>
          <h2>Directories</h2>
          <ul>
            <li>
              <a href="#">Members</a>
            </li>
            <li>
              <a href="#">Jobs</a>
            </li>
            <li>
              <a href="#">Companies</a>
            </li>
            <li>
              <a href="#">Featured</a>
            </li>
            <li>
              <a href="#">Learning</a>
            </li>
            <li>
              <a href="#">Posts</a>
            </li>
            <li>
              <a href="#">Articles</a>
            </li>
            <li>
              <a href="#">Schools</a>
            </li>
            <li>
              <a href="#">News</a>
            </li>
            <li>
              <a href="#">News Letters</a>
            </li>
            <li>
              <a href="#">Services</a>
            </li>
            <li>
              <a href="#">Products</a>
            </li>
            <li>
              <a href="#">Advice</a>
            </li>
            <li>
              <a href="#">People Search</a>
            </li>
          </ul>
        </div>
      </Footer>
      <Credits>
        <img src="/images/linkedin-black.png" alt="credit-logo" />
        <div>| &nbsp; © 2023 All rights reserved &nbsp; |</div>
        <div>
          Made by <strong>VEDANT GOUR 🖤</strong> for <b>Learning</b> purpose
          only
        </div>
      </Credits>
    </Container>
  );
};

const Container = styled.div`
  padding: 0px;
`;

const Nav = styled.nav`
  max-width: 1128px;
  margin: auto;
  padding: 12px 0 16px;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
  flex-wrap: nowrap;

  & > a {
    width: 135px;
    height: 34px;
    @media (max-width: 768px) {
      padding: 0 5px;
    }
  }

  @media (max-width: 375px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const Download = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  display: inline-block;
  color: rgba(0, 0, 0, 0.6);
  /* border-top: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2); */
  padding-top: 10px;
  padding-bottom: 10px;
  width: 120px;

  a {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.6);

    &:hover {
      color: rgba(0, 0, 0, 0.9);
    }
  }

  p {
    font-size: 14px;
  }
`;

const Join = styled.a`
  font-size: 16px;
  padding: 10px 12px;
  text-decoration: none;
  border-radius: 20px;
  color: rgba(0, 0, 0, 0.6);
  margin-right: 12px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    color: rgba(0, 0, 0, 0.9);
    text-decoration: none;
  }
`;

const SignIn = styled.a`
  cursor: pointer;
  box-shadow: inset 0 0 0 1px #0a66c2;
  color: #0a66c2;
  border-radius: 24px;
  transition-duration: 167ms;
  font-size: 16px;
  font-weight: 650;
  line-height: 40px;
  padding: 10px 24px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0);

  &:hover {
    border: 1px solid;
    background-color: rgba(112, 181, 249, 0.15);
    color: #0a66c2;
    text-decoration: none;
  }
`;

const Section = styled.section`
  display: flex;
  align-content: start;
  min-height: 700px;
  padding-bottom: 138px;
  padding-top: 40px;
  padding: 60px 0;
  position: relative;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1128px;
  align-items: center;
  margin: auto;

  @media (max-width: 768px) {
    margin: auto;
    min-height: 0px;
  }
`;

const Hero = styled.div`
  width: 100%;

  h1 {
    padding-bottom: 10px;
    width: 55%;
    font-size: 56px;
    color: #8f5849;
    font-weight: 200;
    line-height: 70px;

    @media (max-width: 768px) {
      text-align: center;
      font-size: 20px;
      font-weight: 400;
      width: 100%;
      line-height: 2;
    }
  }

  img {
    /* z-index: -1; */
    width: 55%;
    height: auto;
    position: absolute;
    bottom: 100px;
    right: -50px;
    transition: all 0.5s ease;

    @media (max-width: 768px) {
      top: 230px;
      width: initial;
      position: initial;
      height: initial;
    }
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 50px;
  margin-top: 100px;
  width: 408px;

  @media (max-width: 768px) {
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
`;

const Google = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  gap: 15px;
  background-color: #fff;
  align-items: center;
  height: 56px;
  width: 100%;
  border-radius: 28px;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 60%),
    inset 0 0 0 2px rgb(0 0 0 / 0%) inset 0 0 0 1px rgb(0 0 0 / 0);
  vertical-align: middle;
  z-index: 0;
  transition-duration: 167ms;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.6);

  &:hover {
    background-color: rgba(207, 207, 207, 0.25);
    color: rgba(0, 0, 0, 0.75);
  }

  h2 {
    font-weight: 400;
  }
`;

const Connection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  h1 {
    font-size: 35px;
    color: #2977c9;
    font-weight: 200;
  }

  img {
    width: 60%;
  }

  @media (max-width: 768px) {
    gap: 15px;
    flex-direction: column;
  }
`;

const Banner = styled.div`
  img {
    width: 100%;
    padding: 0;
    margin: 0;
  }
`;

const Footer = styled.div`
  background-color: #efece4;
  margin-top: 20px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;

  div {
    width: 17%;
  }

  img {
    width: 135px;
    height: 34px;
  }

  h2 {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  ul {
    list-style: none;

    li {
      padding: 2px;
      font-size: 15px;
      font-weight: 500;
    }
  }

  a {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.5);

    &:hover {
      font-weight: 500;
      color: #0b66c2;
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    div {
      width: 100%;
    }

    text-align: center;
    align-items: center;
    justify-content: center;
    gap: 15px;
    flex-direction: column;
  }
`;

const Credits = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  text-align: center;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.7);

  img {
    width: 80px;
  }

  @media (max-width: 768px) {
    gap: 15px;
    flex-direction: column;
  }
`;

export default Login;
