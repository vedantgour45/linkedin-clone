import React, { useEffect, useState } from "react";
import LeftSide from "./LeftSide";
import Main from "./Main";
import RightSide from "./RightSide";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Home = ({ showSideNav, setShowSideNav }) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [data, setData] = useState({});

  const fetchUser = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "UserInfo"));
      querySnapshot.forEach((doc) => {
        let temp = { ...doc.data() };
        if (temp.userID === auth.currentUser?.uid) {
          setData(temp);
        }
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        toast.success("Logged out successfully");
        navigate("/");
      })
      .catch(() => {
        toast.error("Error in logging out");
      });
  };

  useEffect(() => {
    if (user && db) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    const hintToast = setTimeout(() => {
      toast("🚀 Ready to share? Try creating your first post!", {
        duration: 5000,
        position: "bottom-right",
        style: {
          background: "#0a66c2",
          color: "white",
          padding: "16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        },
        icon: "💡",
      });
    }, 2000); // Small delay to appear after the page loads

    return () => clearTimeout(hintToast);
  }, []);

  return (
    <Container>
      <Content>
        <Layout>
          <LeftSide data={data} />
          <Main data={data} />
          <RightSide data={data} />
        </Layout>
      </Content>

      <SideNavOverlay
        active={showSideNav}
        onClick={() => setShowSideNav(false)}
      >
        <SideNav active={showSideNav} onClick={(e) => e.stopPropagation()}>
          <div className="sidenav-header">
            <h3>Account</h3>
            <button onClick={() => setShowSideNav(false)}>
              <img src="/images/close-icon.svg" alt="" />
            </button>
          </div>
          <div className="sidenav-content">
            <LeftSide data={data} />
            <div className="sidenav-footer">
              <button onClick={handleLogout}>Sign Out</button>
            </div>
          </div>
        </SideNav>
      </SideNavOverlay>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 52px;
  max-width: 100%;
  min-height: 100vh;
  background-color: var(--linkedin-bg);
`;

const Content = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  padding: 24px 0;

  @media (max-width: 1128px) {
    padding: 24px 12px;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-areas: "leftside main rightside";
  grid-template-columns: minmax(0, 5fr) minmax(0, 12fr) minmax(300px, 7fr);
  column-gap: 24px;
  row-gap: 24px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 0;

    & > :first-child {
      // LeftSide
      display: none;
    }

    & > :last-child {
      // RightSide
      display: none;
    }
  }
`;

const SideNavOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: flex-start;
  opacity: ${(props) => (props.active ? 1 : 0)};
  visibility: ${(props) => (props.active ? "visible" : "hidden")};
  transition: all 0.3s ease-in-out;
`;

const SideNav = styled.div`
  background-color: #fff;
  width: 280px;
  height: 100%;
  transform: ${(props) =>
    props.active ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;

  .sidenav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid var(--linkedin-border);
    h3 {
      font-size: 18px;
      font-weight: 600;
    }
    button {
      padding: 8px;
      border-radius: 50%;
      img {
        width: 20px;
        opacity: 0.6;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  .sidenav-content {
    overflow-y: auto;
    flex-grow: 1;
    padding: 12px;

    // Ensure LeftSide layout inside Sidenav behaves well
    & > div {
      padding: 0;
      box-shadow: none;
      border: none;
    }
  }

  .sidenav-footer {
    padding: 16px;
    border-top: 1px solid var(--linkedin-border);
    button {
      width: 100%;
      padding: 12px;
      color: var(--linkedin-blue);
      font-weight: 600;
      border-radius: 4px;
      &:hover {
        background: rgba(10, 102, 194, 0.05);
      }
    }
  }
`;

export default Home;
