import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const API_KEY = "aeead52d6e964809b1a37f8e53bf9aa6";
const API_LINK = `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=${API_KEY}`;

const RightSide = ({ data }) => {
  const [news, setNews] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showLess, setShowLess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make an API request to fetch LinkedIn news
    axios
      .get(API_LINK)
      .then((response) => {
        // console.log(response.data.articles);
        setNews(response.data.articles);
        setLoading(false);
      })
      .catch((error) => {
        setNews(error);
        setLoading(false);
      });
  }, []);

  const toggleShowMore = () => {
    setShowMore(!showMore);
    setShowLess(false);
  };

  const toggleShowLess = () => {
    setShowMore(false);
    setShowLess(!showLess);
  };

  const truncateTitle = (title) => {
    if (title.length > 45) {
      return title.slice(0, 45) + "...";
    }
    return title;
  };

  return (
    <Container>
      <NewsCard>
        <Title>
          <h2>LinkedIn News</h2>
          <img src="/images/feed-icon.svg" alt="feed-icon" />
        </Title>
        <News>
          {loading && (
            <img
              className="loading"
              src="/images/spinner-loading.svg"
              alt="loading"
            />
          )}
          {news.slice(0, showMore ? 7 : 4).map((article, index) => (
            <li key={index}>
              <p>{truncateTitle(article.title)}</p>
              <div>
                <span>
                  Check full news <a href={article.url}>here</a>
                </span>
                <span>Published on : {article.publishedAt.slice(0, 10)}</span>
              </div>
            </li>
          ))}
        </News>
        {news.length > 5 && !showMore && (
          <button onClick={toggleShowMore}>
            Show More{" "}
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        )}
        {showMore && (
          <button onClick={toggleShowLess}>
            Show Less
            <span className="material-symbols-outlined">keyboard_arrow_up</span>
          </button>
        )}
      </NewsCard>
      <Feed>
        <Title>
          <h2>Add to your feed</h2>
          <img src="/images/feed-icon.svg" alt="feed-icon" />
        </Title>
        <FeedList>
          <li>
            <a>
              <Avatar />
            </a>
            <div>
              <span>#Linkedin</span>
              <button>Follow</button>
            </div>
          </li>
          <li>
            <a>
              <Avatar />
            </a>
            <div>
              <span>#Google</span>
              <button>Follow</button>
            </div>
          </li>
        </FeedList>
        <Recommendation>
          View all recommendations
          <img src="/images/right-icon.svg" alt="right-icon" />
        </Recommendation>
      </Feed>

      <PremiumCard>
        <Adv>
          <p>Ad</p>
          <img src="/images/three-dots.gif" alt="three-dots" />
        </Adv>
        <p>
          <span>{data.name ? data.name.split(" ")[0] : "Hey"}</span>, make
          connections that matter most in your job search
        </p>
        <div>
          {data.profilePicture ? (
            <img src={data.profilePicture} alt="photo" />
          ) : (
            <img src="/images/user.svg" alt="user" />
          )}
          <img src="/images/premium.png" alt="linkedin-premium" />
        </div>
        <p>See who viewed your profile in the last 90 days</p>
        <button>Try for free!</button>
      </PremiumCard>

      <RightBottom>
        <div>
          <span>
            <a href="#">About</a>
          </span>
          <span>
            <a href="#">Accessibility</a>
          </span>
          <span>
            <a href="#">Help Center</a>
          </span>
          <span>
            <a href="#">Privacy & Terms</a>
          </span>
          <span>
            <a href="#">Advertising</a>
          </span>
          <span>
            <a href="#">More</a>
          </span>
        </div>
        <div>
          <a href="#">
            <img src="/images/login-logo.svg" alt="logo" />
          </a>

          <h3>LinkedIn Corporation © 2023</h3>
        </div>
        <div>
          <p>
            Made by <span>Vedant Gour 🖤</span>
          </p>
          <p>for learning purpose only</p>
        </div>
      </RightBottom>
    </Container>
  );
};

const Container = styled.div`
  grid-area: rightside;
`;

const NewsCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  transition: box-shadow 83ms;
  position: relative;
  border: none;
  padding: 12px;
  /* min-height: 300px;
  transition: min-height 15s ease-in-out;
  overflow: hidden; */

  button {
    background-color: transparent;
    border: none;
    color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    padding: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 6px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
      border-radius: 5px;
    }
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 14px 7px;
  color: rgba(0, 0, 0, 0.7);
`;

const News = styled.ul`
  line-height: 1.7;
  text-align: left;
  margin-inline: 20px;

  p {
    font-size: 14px;
    font-weight: 500;
  }

  li {
    margin-bottom: 5px;
    a {
      color: #0a66c2;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  div {
    font-size: 13px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(0, 0, 0, 0.6);

    span {
      &:last-child {
        font-size: 10px;

        @media (max-width: 768px) {
          display: none;
        }
      }
    }
  }
`;

const Feed = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  transition: box-shadow 83ms;
  position: relative;
  border: none;
  padding: 12px;
`;

const FeedList = styled.ul`
  margin-top: 5px;

  li {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    position: relative;
    font-size: 14px;

    & > div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;

      span {
        color: rgba(0, 0, 0, 0.8);
        font-weight: 500;
      }
    }

    button {
      border: 1px solid #0a66c2;
      color: #0a66c2;
      border-radius: 30px;
      transition-duration: 167ms;
      font-size: 16px;
      font-weight: 650;
      line-height: 40px;
      padding: 0 15px;
      text-align: center;
      background-color: rgba(0, 0, 0, 0);
      cursor: pointer;

      &:hover {
        border: 1.5px solid;
        background-color: rgba(112, 181, 249, 0.15);
        color: #0a66c2;
        text-decoration: none;
      }
    }
  }
`;

const Avatar = styled.div`
  background-image: url("/images/hashtag.svg");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 48px;
  height: 48px;
  margin-right: 8px;
  margin-top: 7px;
`;

const Recommendation = styled.a`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  color: #0a66c2;

  img {
    margin-top: 3px;
  }

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const PremiumCard = styled(Feed)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  min-height: 220px;
  padding: 20px;

  p {
    font-size: 16px;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 400;
  }

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;

    img {
      width: 50px;
      height: auto;
      border-radius: 50px;
      aspect-ratio: 1 / 1;

      &:last-child {
        width: 60px;
        border-radius: 0;
      }
    }
  }

  button {
    border: 1px solid #0a66c2;
    color: #0a66c2;
    border-radius: 30px;
    transition-duration: 167ms;
    font-size: 16px;
    font-weight: 650;
    line-height: 40px;
    padding: 0 15px;
    width: fit-content;
    text-align: center;
    margin-inline: auto;
    background-color: rgba(0, 0, 0, 0);
    cursor: pointer;

    &:hover {
      border: 1.5px solid;
      background-color: rgba(112, 181, 249, 0.15);
      color: #0a66c2;
      text-decoration: none;
    }
  }
`;

const Adv = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;

  & > img {
    max-width: 15px;
  }
`;

const RightBottom = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-inline: auto;
  text-align: center;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 100px;

  div {
    &:first-child {
      font-size: 14px;

      a {
        line-height: 1.5;
        text-decoration: none;
        color: rgba(0, 0, 0, 0.6);
        margin-right: 15px;

        &:hover {
          color: #0a66c2;
          text-decoration: underline;
        }
      }
    }

    &:nth-child(2) {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;

      img {
        height: 17px;
        width: auto;
      }

      h3 {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.6);
      }

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    &:last-child {
      font-weight: 400;
      color: rgba(0, 0, 0, 0.6);

      p {
        font-size: 12px;
      }
      span {
        font-size: 14px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.8);
      }
    }
  }
`;

export default RightSide;
