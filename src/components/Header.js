import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";

const Header = (props) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [data, setData] = useState({});

  const fetchUser = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "UserInfo"));
      querySnapshot.forEach((doc) => {
        let temp = { ...doc.data() };
        if (temp.userID === auth.currentUser.uid) {
          // console.log(temp);
          setData(temp);
        }
      });
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then((res) => {
        toast.success("Logged out successfully");
        navigate("/");
      })
      .catch((err) => {
        toast.error("Error in logging out");
      });
  };

  useEffect(() => {
    if (!user || !db) return;
    fetchUser();
  }, [user, db]);

  return (
    <Container>
      <Content>
        <Logo>
          <a href="/home">
            <img src="/images/home-logo.svg" alt="homepage-logo" />
          </a>
        </Logo>
        <Search>
          <div>
            <input type="text" placeholder="Search" />
          </div>
          <SearchIcon>
            <img src="/images/search-icon.svg" alt="search-icon" />
          </SearchIcon>
        </Search>
        <Nav>
          <NavlistWrap>
            <Navlist className="active">
              <a>
                <img src="/images/nav-home.svg" alt="home-icon" />
                <span>Home</span>
              </a>
            </Navlist>

            <Navlist>
              <a>
                <img src="/images/nav-network.svg" alt="home-icon" />
                <span>My Network</span>
              </a>
            </Navlist>

            <Navlist>
              <a>
                <img src="/images/nav-jobs.svg" alt="home-icon" />
                <span>Jobs</span>
              </a>
            </Navlist>

            <Navlist>
              <a>
                <img src="/images/nav-messaging.svg" alt="home-icon" />
                <span>Messaging</span>
              </a>
            </Navlist>

            <Navlist>
              <a>
                <img src="/images/nav-notifications.svg" alt="home-icon" />
                <span>Notifictions</span>
              </a>
            </Navlist>

            <User>
              <a>
                {data.profilePicture ? (
                  <img src={data.profilePicture} alt="photo" />
                ) : (
                  <img src="/images/user.svg" alt="user" />
                )}
                <span>
                  <p>{data.name ? data.name.split(" ")[0] : "User"}</p>
                  <img src="/images/down-icon.svg" alt="" />
                </span>
              </a>

              {user && (
                <SignOut>
                  <a onClick={handleLogout}>Sign Out</a>
                </SignOut>
              )}
            </User>

            <Business>
              <a>
                <img src="/images/nav-work.svg" alt="business-logo" />
                <span>
                  <p>For Business</p>
                  <img
                    className="drop-down"
                    src="/images/down-icon.svg"
                    alt="down-arrow"
                  />
                </span>
              </a>
            </Business>
          </NavlistWrap>
        </Nav>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  position: fixed;
  left: 0;
  top: 0;
  padding: 2px 24px;
  width: 100vw;
  z-index: 100;

  @media (max-width: 780px) {
    padding: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  min-height: 100%;
  max-width: 1128px;
`;

const Logo = styled.span`
  margin-right: 8px;
  font-size: 0px;
`;

const Search = styled.div`
  opacity: 1;
  flex-grow: 1;
  position: relative;

  & > div {
    max-width: 280px;

    input {
      border: none;
      box-shadow: none;
      background-color: #ecf3f6;
      border-radius: 3px;
      color: rgba(0, 0, 0, 0.8);
      width: 158px;
      padding: 0 8px 0 40px;
      line-height: 1.75;
      font-weight: 400;
      font-size: 14px;
      height: 34px;
      border-color: #dce6f1;
      vertical-align: text-top;
      transition-duration: 0.5s;

      &:focus {
        outline: 2px solid #000000;
        width: 218px;
      }
    }
  }
`;

const SearchIcon = styled.div`
  width: 40px;
  position: absolute;
  z-index: 1;
  top: 10px;
  left: 2px;
  border-radius: 0 2px 2px 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Nav = styled.nav`
  margin-left: auto;
  display: block;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 7px 0;
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: #fff;
    width: 100%;
  }
`;

const NavlistWrap = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  list-style-type: none;

  .active {
    span:after {
      content: "";
      transform: scale(1);
      border-bottom: 2px solid var(--white, #fff);
      position: absolute;
      left: 0;
      bottom: -2px;
      transition: transform 0.2s ease-in-out;
      width: 100%;
      border-color: rgba(0, 0, 0, 0.9);
    }
  }

  @media (max-width: 768px) {
    overflow-x: scroll;
    .active {
      span:after {
        content: "";
        transform: scale(1);
        border-bottom: 2px solid var(--white, #fff);
        position: absolute;
        left: 0;
        bottom: -7px;
        transition: transform 0.2s ease-in-out;
        width: 100%;
        border-color: rgba(0, 0, 0, 0.9);
      }
    }
  }
`;

const Navlist = styled.li`
  display: flex;
  align-items: center;

  a {
    align-items: center;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    font-weight: 400;
    justify-content: center;
    line-height: 1.5;
    min-height: 42px;
    min-width: 80px;
    position: relative;
    text-decoration: none;
    cursor: pointer;

    span {
      color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
    }

    @media (max-width: 768px) {
      min-width: 70px;
    }
  }

  &:hover,
  &:active {
    a {
      span {
        color: rgba(0, 0, 0, 0.9);
      }
    }
  }
`;

const SignOut = styled.div`
  position: absolute;
  top: 45px;
  background: #fff;
  border-radius: 5px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  width: 100px;
  height: 40px;
  font-size: 16px;
  transition-duration: 167ms;
  text-align: center;
  display: none;
`;

const User = styled(Navlist)`
  cursor: pointer;

  a > svg {
    width: 24px;
    border-radius: 50%;
  }

  a > img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }

  span {
    display: flex;
    align-items: center;
  }

  &:hover {
    ${SignOut} {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const Business = styled(User)`
  padding-left: 10px;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
`;

export default Header;
