import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";

const Header = ({ setShowSideNav }) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

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
      console.log("Error getting documents: ", error);
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Container scrolled={isScrolled}>
      <Content>
        <MobileUser onClick={() => setShowSideNav(true)}>
          {data.profilePicture ? (
            <img src={data.profilePicture} alt="" />
          ) : (
            <img src="/images/user.svg" alt="" />
          )}
        </MobileUser>
        <Logo>
          <a href="/home">
            <img src="/images/home-logo.svg" alt="LinkedIn" />
          </a>
        </Logo>
        <Search>
          <div>
            <input type="text" placeholder="Search" />
          </div>
          <SearchIcon>
            <img src="/images/search-icon.svg" alt="" />
          </SearchIcon>
        </Search>
        <Nav>
          <NavListWrap>
            <NavList className="active">
              <a href="/home">
                <img src="/images/nav-home.svg" alt="Home" />
                <span>Home</span>
              </a>
            </NavList>

            <NavList>
              <a href="/home">
                <img src="/images/nav-network.svg" alt="My Network" />
                <span>My Network</span>
              </a>
            </NavList>

            <NavList>
              <a href="/home">
                <img src="/images/nav-jobs.svg" alt="Jobs" />
                <span>Jobs</span>
              </a>
            </NavList>

            <NavList>
              <a href="/home">
                <img src="/images/nav-messaging.svg" alt="Messaging" />
                <span>Messaging</span>
              </a>
            </NavList>

            <NavList>
              <a href="/home">
                <img src="/images/nav-notifications.svg" alt="Notifications" />
                <span>Notifications</span>
              </a>
            </NavList>

            <User
              onMouseOver={() => setShowSignOut(true)}
              onMouseOut={() => setShowSignOut(false)}
            >
              <a href="/home">
                {data.profilePicture ? (
                  <img src={data.profilePicture} alt="" />
                ) : (
                  <img src="/images/user.svg" alt="" />
                )}
                <span>
                  Me
                  <img
                    src="/images/down-icon.svg"
                    alt=""
                    className="dropdown-icon"
                  />
                </span>
              </a>

              {showSignOut && (
                <SignOut>
                  <SignOutBtn onClick={handleLogout}>Sign Out</SignOutBtn>
                </SignOut>
              )}
            </User>

            <PremiumLink>
              <a href="/home">Reactivate Premium: 50% Off</a>
            </PremiumLink>
          </NavListWrap>
        </Nav>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  background-color: #fff;
  border-bottom: 1px solid var(--linkedin-border);
  position: fixed;
  left: 0;
  top: 0;
  padding: 0 24px;
  width: 100%;
  z-index: 100;
  box-shadow: ${(props) =>
    props.scrolled ? "0 4px 12px rgba(0,0,0,0.08)" : "none"};
  transition: box-shadow var(--transition-fast);
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  min-height: 52px;
  max-width: 1128px;
`;

const Logo = styled.span`
  margin-right: 8px;
  img {
    width: 34px;
    height: 34px;
  }
`;

const MobileUser = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    margin-right: 8px;
    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
  }
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
      background-color: #edf2f7;
      border-radius: 4px;
      color: var(--linkedin-text);
      width: 218px;
      padding: 0 8px 0 40px;
      line-height: 1.75;
      font-weight: 400;
      font-size: 14px;
      height: 34px;
      vertical-align: text-top;
      transition: width var(--transition-fast);

      &:focus {
        outline: 2px solid #000;
        width: 380px;
        background-color: #fff;
      }
    }
  }

  @media (max-width: 768px) {
    & > div input {
      width: 100%;
      &:focus {
        width: 100%;
      }
    }
  }
`;

const SearchIcon = styled.div`
  width: 40px;
  position: absolute;
  z-index: 1;
  top: 7px;
  left: 2px;
  border-radius: 0 2px 2px 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 18px;
  }
`;

const Nav = styled.nav`
  margin-left: auto;
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    bottom: 0;
    background: #fff;
    width: 100%;
    border-top: 1px solid var(--linkedin-border);
  }
`;

const NavListWrap = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  list-style-type: none;

  .active {
    span:after {
      content: "";
      transform: scaleX(1);
      border-bottom: 2px solid var(--linkedin-text);
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
    }
    a span {
      color: var(--linkedin-text);
    }
  }
`;

const NavList = styled.li`
  display: flex;
  align-items: center;
  a {
    align-items: center;
    background: transparent;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    font-weight: 400;
    justify-content: center;
    line-height: 1.5;
    min-height: 52px;
    min-width: 80px;
    position: relative;
    text-decoration: none;
    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
      opacity: 0.6;
    }
    span {
      color: var(--linkedin-text-secondary);
      display: flex;
      align-items: center;
    }

    &:hover {
      img {
        opacity: 1;
      }
      span {
        color: var(--linkedin-text);
      }
    }
  }
`;

const SignOut = styled.div`
  position: absolute;
  top: 52px;
  background: white;
  border-radius: 4px;
  width: 100px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  overflow: hidden;
  z-index: 101;
`;

const SignOutBtn = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  color: var(--linkedin-text-secondary);
  font-weight: 600;
  text-align: center;
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: var(--linkedin-blue);
  }
`;

const User = styled(NavList)`
  position: relative;
  a > img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    opacity: 1;
  }
  span {
    display: flex;
    align-items: center;
    margin-top: 2px;
  }
  .dropdown-icon {
    width: 12px;
    height: 12px;
    margin-left: 2px;
    opacity: 1;
  }
`;

const PremiumLink = styled.li`
  display: flex;
  align-items: center;
  padding-left: 12px;
  a {
    color: #915907;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.33;
    width: 80px;
    text-align: center;
    text-decoration: underline;
    &:hover {
      color: #0a66c2;
    }
  }
  @media (max-width: 900px) {
    display: none;
  }
`;

export default Header;
