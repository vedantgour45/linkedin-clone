import React from "react";
import styled from "styled-components";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const LeftSide = ({ data }) => {
  return (
    <Container>
      <ArtCard>
        <UserInfo>
          <CardBackground />

          {data ? (
            <a>
              {data.profilePicture ? (
                <Photo>
                  <img src={data.profilePicture} alt="profile" />
                </Photo>
              ) : (
                <Photo>
                  <img src="/images/photo.svg" alt="profile" />
                </Photo>
              )}
              <Link>{data.name}</Link>
            </a>
          ) : (
            <a>
              <Photo />
              <Link>"Hello User"</Link>
            </a>
          )}
          {data ? (
            <a>
              <AddPhotoText>{data.description}</AddPhotoText>
            </a>
          ) : (
            <a>
              <AddPhotoText>
                Unlocking Professional Potential | Connecting Talent with
                Opportunity
              </AddPhotoText>
            </a>
          )}
        </UserInfo>
        <Widget>
          <a>
            <div>
              <span>Connections</span>
              <span>Grow your network</span>
            </div>
            <img src="/images/widget-icon.svg" alt="widget" />
          </a>
        </Widget>
        <Widget>
          <a className="paid">
            <div>
              <span>Access exclusive tools & insights</span>
            </div>
            <div>
              <span>
                <img src="/images/yellowbox.svg" alt="yellow-box" />
              </span>
              <span>Try premium for free</span>
            </div>
          </a>
        </Widget>
        <Item>
          <span>
            <img src="/images/item-icon.svg" alt="saved-items" />
            My Items
          </span>
        </Item>
      </ArtCard>
      <CommunityCard>
        <a>
          <span>Groups</span>
        </a>
        <a>
          <span>
            Events
            <img src="/images/plus-icon.svg" alt="plus-icon" />
          </span>
        </a>
        <a>
          <span>Followed Hashtags</span>
        </a>
        <a>
          <span>Discover more</span>
        </a>
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
  border-radius: 5px;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  transition: box-shadow 83ms;
  position: relative;
  border: none;
`;

const UserInfo = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding: 12px 12px 16px;
  word-wrap: break-word;
  word-break: break-word;
`;

const CardBackground = styled.div`
  background: url("/images/card-bg.svg");
  background-position: center;
  background-size: 462px;
  height: 54px;
  margin: -12px -12px 0;
`;

const Photo = styled.div`
  cursor: pointer;
  box-shadow: none;
  width: 72px;
  height: 72px;
  background-clip: content-box;
  background-color: #fff;
  background-position: center;
  background-size: 60%;
  border: 2px solid #fff;
  margin: -38px auto 12px;
  border-radius: 50%;
  aspect-ratio: 1 / 1;

  img {
    width: inherit;
    height: inherit;
    border-radius: 50%;
  }
`;

const Link = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.9);
  font-weight: 600;
  cursor: pointer;
`;

const AddPhotoText = styled.div`
  color: rgba(0, 0, 0, 0.7);
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
`;

const Widget = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 12px;
  padding-bottom: 12px;
  transition-duration: 167ms;
  font-weight: 500;
  cursor: pointer;

  & > a {
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }

  div {
    display: flex;
    flex-direction: column;
    text-align: left;

    span {
      font-size: 12px;
      line-height: 1.333;

      &:first-child {
        color: rgba(0, 0, 0, 0.6);
      }

      &:nth-child(2) {
        color: rgba(0, 0, 0, 1);
      }
    }
  }

  svg {
    color: rgba(0, 0, 0, 1);
  }

  .paid {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    div {
      &:last-child {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        gap: 5px;

        img {
          width: 17px;
        }

        span {
          &:last-child {
            text-decoration: underline;

            &:hover {
              color: #0a66c2;
            }
          }
        }
      }
    }
  }
`;

const Item = styled.a`
  border-color: rgba(0, 0, 0, 0.8);
  text-align: left;
  padding: 12px;
  font-size: 12px;
  display: block;
  transition-duration: 167ms;
  font-weight: 500;
  cursor: pointer;

  span {
    display: flex;
    align-items: center;
    gap: 5px;
    color: rgba(0, 0, 0, 1);

    svg {
      color: rgba(0, 0, 0, 0.6);
    }
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const CommunityCard = styled(ArtCard)`
  padding: 8px 0 0;
  text-align: left;
  display: flex;
  flex-direction: column;

  a {
    color: #000000;
    padding: 7px;
    font-size: 12px;
    font-weight: 500;
    color: #0a66c2;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }

    span {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &:last-child {
      border-top: 1px solid rgba(0, 0, 0, 0.15);
      padding: 12px;
      color: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      font-size: 12px;
      font-weight: 500;
      transition-duration: 167ms;
      font-weight: 500;
      cursor: pointer;

      &:hover {
        text-decoration: none;
        background-color: rgba(0, 0, 0, 0.08);
      }
    }
  }
`;

export default LeftSide;
