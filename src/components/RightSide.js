import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;
const NEWS_URL = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${NEWS_API_KEY}`;

const RightSide = ({ data }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(NEWS_URL)
      .then((response) => {
        setNews(response.data.articles.slice(0, 5));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      <NewsCard>
        <Title>
          <h2>LinkedIn News</h2>
          <img src="/images/feed-icon.svg" alt="" className="info-icon" />
        </Title>
        <NewsList>
          {loading ? (
            <Loading>
              <img src="/images/spinner-loading.svg" alt="Loading..." />
            </Loading>
          ) : error ? (
            <ErrorText>
              Top stories: Conflict spills into a second day...
            </ErrorText>
          ) : (
            news.map((n, i) => (
              <li key={i}>
                <a href={n.url} target="_blank" rel="noreferrer">
                  <h4>{n.title}</h4>
                  <p>
                    {Math.floor(Math.random() * 5) + 1}d ago •{" "}
                    {Math.floor(Math.random() * 50000) + 1000} readers
                  </p>
                </a>
              </li>
            ))
          )}
        </NewsList>
        <ShowMore>
          Show more <img src="/images/down-icon.svg" alt="" />
        </ShowMore>
      </NewsCard>

      <PuzzleCard>
        <Title>
          <h2>Today's puzzle games</h2>
        </Title>
        <PuzzleList>
          <li>
            <div className="puzzle-info">
              <img
                src="https://static.licdn.com/aero-v1/networks/lbc/white/assets/images/puzzle-logo-queens-8c8f0f.png"
                alt=""
              />
              <div>
                <h4>Queens #671</h4>
                <p>Crown each region</p>
              </div>
            </div>
            <img src="/images/right-icon.svg" alt="" className="arrow" />
          </li>
          <li>
            <div className="puzzle-info">
              <img
                src="https://static.licdn.com/aero-v1/networks/lbc/white/assets/images/puzzle-logo-pinball-4a5f4a.png"
                alt=""
              />
              <div>
                <h4>Pinball #350</h4>
                <p>Make connections played</p>
              </div>
            </div>
            <img src="/images/right-icon.svg" alt="" className="arrow" />
          </li>
        </PuzzleList>
        <ShowMore>
          Show more <img src="/images/down-icon.svg" alt="" />
        </ShowMore>
      </PuzzleCard>

      <PremiumCard>
        <AdHeader>
          <span>Ad</span>
          <img src="/images/ellipsis.svg" alt="" />
        </AdHeader>
        <AdText>
          {data?.name?.split(" ")[0] || "User"}, stay ahead in your career with
          LinkedIn Premium
        </AdText>
        <AdIcons>
          {data?.profilePicture ? (
            <img src={data.profilePicture} alt="" className="user-img" />
          ) : (
            <img src="/images/user.svg" alt="" className="user-img" />
          )}
          <img
            src="/images/premium.png"
            alt="Premium"
            className="premium-img"
          />
        </AdIcons>
        <AdSubtext>Boost your profile visibility by 2x</AdSubtext>
        <a href="#" className="premium-btn">
          Try for free
        </a>
      </PremiumCard>

      <Footer>
        <Links>
          <a href="#">About</a>
          <a href="#">Accessibility</a>
          <a href="#">Help Center</a>
          <a href="#">Privacy & Terms</a>
          <a href="#">Ad Choices</a>
          <a href="#">Advertising</a>
          <a href="#">Business Services</a>
          <a href="#">Get the LinkedIn app</a>
          <a href="#">More</a>
        </Links>
        <Copyright>
          <img src="/images/login-logo.svg" alt="" />
          <span>LinkedIn Corporation © 2026</span>
        </Copyright>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  grid-area: rightside;
`;

const CommonCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid var(--linkedin-border);
  margin-bottom: 8px;
  overflow: hidden;
  padding: 12px 0 0;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 0 12px;

  h2 {
    font-size: 16px;
    font-weight: 600;
    color: var(--linkedin-text);
  }
  .info-icon {
    width: 14px;
    background: #000;
    border-radius: 2px;
    filter: invert(1);
    padding: 1px;
  }
`;

const NewsCard = styled(CommonCard)``;

const NewsList = styled.ul`
  list-style: none;
  li {
    padding: 4px 12px;
    a {
      h4 {
        font-size: 14px;
        font-weight: 600;
        color: var(--linkedin-text);
        line-height: 1.4;
      }
      p {
        font-size: 12px;
        color: var(--linkedin-text-secondary);
        margin-top: 2px;
      }
      &:hover h4 {
        text-decoration: underline;
      }
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
`;

const ShowMore = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--linkedin-text-secondary);
  width: 100%;
  margin-top: 4px;

  img {
    width: 12px;
    opacity: 0.6;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--linkedin-text);
  }
`;

const PuzzleCard = styled(CommonCard)``;

const PuzzleList = styled.ul`
  list-style: none;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .puzzle-info {
      display: flex;
      align-items: center;
      gap: 12px;
      img {
        width: 40px;
        border-radius: 4px;
      }
      h4 {
        font-size: 14px;
        font-weight: 600;
      }
      p {
        font-size: 12px;
        color: var(--linkedin-text-secondary);
      }
    }

    .arrow {
      width: 16px;
      opacity: 0.6;
    }
  }
`;

const PremiumCard = styled(CommonCard)`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;

  .premium-btn {
    border: 1px solid var(--linkedin-blue);
    color: var(--linkedin-blue);
    border-radius: 20px;
    padding: 10px 24px;
    font-weight: 600;
    font-size: 16px;
    text-decoration: none;
    transition: all 0.2s;
    margin-bottom: 8px;

    &:hover {
      background-color: rgba(10, 102, 194, 0.1);
      border-width: 2px;
    }
  }
`;

const AdHeader = styled.div`
  align-self: flex-end;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--linkedin-text-secondary);
  img {
    width: 14px;
  }
`;

const AdText = styled.p`
  font-size: 14px;
  color: var(--linkedin-text-secondary);
  margin: 12px 0;
`;

const AdIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 12px 0;

  .user-img {
    width: 72px;
    height: 72px;
    border-radius: 50%;
  }
  .premium-img {
    width: 72px;
  }
`;

const AdSubtext = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: var(--linkedin-text);
  margin-bottom: 12px;
`;

const Footer = styled.footer`
  padding: 12px;
  text-align: center;
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;

  a {
    font-size: 12px;
    color: var(--linkedin-text-secondary);
    &:hover {
      color: var(--linkedin-blue);
      text-decoration: underline;
    }
  }
`;

const Copyright = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  img {
    height: 14px;
  }
  span {
    font-size: 12px;
    color: var(--linkedin-text-secondary);
  }
`;

const Loading = styled.div`
  text-align: center;
  img {
    width: 32px;
  }
`;

const ErrorText = styled.p`
  font-size: 12px;
  color: #ff0000;
  text-align: center;
`;

export default RightSide;
