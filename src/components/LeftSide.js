import React from "react";
import styled from "styled-components";

const LeftSide = ({ data }) => {
  return (
    <Container>
      <ArtCard>
        <UserInfo>
          <CardBackground />
          <a>
            <Photo>
              {data?.profilePicture ? (
                <img src={data.profilePicture} alt="Profile" />
              ) : (
                <img src="/images/user.svg" alt="Profile" />
              )}
            </Photo>
            <Link>{data?.name || "Welcome!"}</Link>
          </a>
          <a>
            <Headline>
              {data?.description || "Build your professional profile"}
            </Headline>
          </a>
        </UserInfo>

        <Widget>
          <a>
            <div>
              <span>Profile viewers</span>
              <span className="count">27</span>
            </div>
            <div>
              <span>Post impressions</span>
              <span className="count">775</span>
            </div>
          </a>
        </Widget>

        <PremiumWidget>
          <a href="#">
            <span className="label">Achieve 4x more profile visits</span>
            <div className="premium-link">
              <img src="/images/yellowbox.svg" alt="" />
              <span>Reactivate Premium: 50% Off</span>
            </div>
          </a>
        </PremiumWidget>

        <Item>
          <span>
            <img src="/images/item-icon.svg" alt="" />
            Saved items
          </span>
        </Item>
      </ArtCard>

      <CommunityCard>
        <CommunityItem>
          <span>Groups</span>
        </CommunityItem>
        <CommunityItem>
          <span>Newsletters</span>
        </CommunityItem>
        <CommunityItem>
          <span>
            Events
            <img src="/images/plus-icon.svg" alt="" />
          </span>
        </CommunityItem>
        <DiscoverMore>
          <span>Discover more</span>
        </DiscoverMore>
      </CommunityCard>
    </Container>
  );
};

const Container = styled.div`
  grid-area: leftside;
`;

const ArtCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 8px;
  transition: box-shadow 83ms;
  position: relative;
  border: 1px solid var(--linkedin-border);
`;

const UserInfo = styled.div`
  border-bottom: 1px solid var(--linkedin-border);
  padding: 12px 12px 16px;
  word-wrap: break-word;
`;

const CardBackground = styled.div`
  background: url("https://static.licdn.com/aero-v1/networks/lbc/white/assets/images/placeholder-image-f0b4a4.png");
  background-position: center;
  background-size: cover;
  height: 54px;
  margin: -12px -12px 0;
`;

const Photo = styled.div`
  width: 72px;
  height: 72px;
  box-sizing: border-box;
  background-clip: content-box;
  background-color: white;
  background-position: center;
  background-size: 60%;
  background-repeat: no-repeat;
  border: 2px solid white;
  margin: -38px auto 12px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Link = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: var(--linkedin-text);
  font-weight: 600;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const Headline = styled.div`
  color: var(--linkedin-text-secondary);
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
`;

const Widget = styled.div`
  border-bottom: 1px solid var(--linkedin-border);
  padding: 12px 0;

  & > a {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: 8px;

    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 12px;

      span {
        font-size: 12px;
        line-height: 1.333;
        color: var(--linkedin-text-secondary);
        font-weight: 600;

        &.count {
          color: #0a66c2;
        }
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.08);
      }
    }
  }
`;

const PremiumWidget = styled(Widget)`
  .label {
    font-size: 12px;
    color: var(--linkedin-text-secondary);
    display: block;
    text-align: left;
    padding: 0 12px;
  }

  .premium-link {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    padding: 4px 12px;

    img {
      width: 16px;
    }
    span {
      font-size: 12px;
      font-weight: 600;
      color: var(--linkedin-text);
      &:hover {
        color: #0a66c2;
      }
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }
`;

const Item = styled.a`
  text-align: left;
  padding: 12px;
  font-size: 12px;
  display: block;
  font-weight: 600;

  span {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--linkedin-text);
    img {
      width: 16px;
      opacity: 0.6;
    }
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    cursor: pointer;
  }
`;

const CommunityCard = styled(ArtCard)`
  padding: 8px 0 0;
  text-align: left;
  display: flex;
  flex-direction: column;
`;

const CommunityItem = styled.a`
  color: #0a66c2;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  span {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    text-decoration: underline;
  }
`;

const DiscoverMore = styled.div`
  border-top: 1px solid var(--linkedin-border);
  padding: 12px;
  color: var(--linkedin-text-secondary);
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    color: var(--linkedin-text);
  }
`;

export default LeftSide;
