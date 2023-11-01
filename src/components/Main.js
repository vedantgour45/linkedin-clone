import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PostModal from "./PostModal";
import ReactPlayer from "react-player";
import dummyPosts from "../Utility/dummyPosts";

const Main = ({ data }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setTimeout(() => {
      setPosts(savedPosts);
      setLoading(false);
    }, 2000);
  }, []);

  const handlePostDelete = () => {
    console.log("delete post");
  };

  const savePostsToLocalStorage = (posts) => {
    localStorage.setItem("posts", JSON.stringify(posts));
  };

  const addNewPost = (newPost) => {
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    savePostsToLocalStorage(updatedPosts);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) {
      return;
    }
    setModalOpen(!modalOpen);
  };

  return (
    <Container>
      <ShareBox>
        <div>
          {data.profilePicture ? (
            <img src={data.profilePicture} alt="photo" />
          ) : (
            <img src="/images/user.svg" alt="user" />
          )}

          <button onClick={handleClick}>Start a post</button>
        </div>
        <div>
          <button>
            <img src="/images/media.svg" alt="photo-icon" />
            <span>Media</span>
          </button>
          <button>
            <img src="/images/jobs.svg" alt="photo-icon" />
            <span>Job</span>
          </button>
          <button>
            <img src="/images/article.svg" alt="photo-icon" />
            <span>Write article</span>
          </button>
        </div>
      </ShareBox>

      <div>
        {loading && (
          <Loading>
            <img
              className="loading"
              src="/images/spinner-loading.svg"
              alt="loading"
            />
          </Loading>
        )}
        {posts
          .filter((post) => post.userId === data.userID)
          .map((post, index) => (
            <Article key={index}>
              <SharedActor>
                <a>
                  {data.profilePicture ? (
                    <img src={data.profilePicture} alt="photo" />
                  ) : (
                    <img src="/images/user.svg" alt="user" />
                  )}
                  <div>
                    <span>{data.name}</span>
                    <span>{data.description}</span>
                    <span>
                      Posted on: {post.date} {post.time}
                      <img src="/images/global.svg" alt="global" />
                    </span>
                  </div>
                </a>
                <button>
                  <img src="/images/ellipsis.svg" alt="three-dots" />
                </button>
                <DeletePost>
                  <a onClick={handlePostDelete}>Delete Post</a>
                </DeletePost>
              </SharedActor>

              <Description>{post.caption}</Description>
              <SharedImage>
                {post.image !== "" && (
                  <a>
                    <img src={post.image} alt="shared-image" />
                  </a>
                )}
                {post.video !== "" && (
                  <a>
                    <ReactPlayer
                      url={post.video}
                      controls={true}
                      width="100%"
                      height="400px"
                    />
                  </a>
                )}
                {post.file !== null && (
                  <iframe
                    src={post.file}
                    width="100%"
                    height="500px"
                    className="pdf-iframe"
                  ></iframe>
                )}
              </SharedImage>
              <SocialCounts>
                <li>
                  <button>
                    <img src="/images/reaction-like.svg" alt="like" />
                    <img src="/images/reaction-love.svg" alt="love" />
                    <img src="/images/reaction-bulb.svg" alt="bulb" />
                    <img src="/images/reaction-clap.svg" alt="clap" />
                    <span>45</span>
                  </button>
                </li>
              </SocialCounts>
              <LikeShare>
                <button>
                  <img src="/images/like.svg" alt="like" />
                  <span>Like</span>
                </button>
                <button>
                  <img src="/images/comment.svg" alt="comment" />
                  <span>Comment</span>
                </button>
                <button>
                  <img src="/images/repost.svg" alt="repost" />
                  <span>Repost</span>
                </button>
                <button>
                  <img src="/images/send.svg" alt="send" />
                  <span>Send</span>
                </button>
              </LikeShare>
            </Article>
          ))}
        {dummyPosts.map((post, index) => (
          <Article key={index}>
            <SharedActor>
              <a>
                <img src="/images/user.svg" alt="user" />
                <div>
                  <span>{post.name}</span>
                  <span>{post.description}</span>
                  <span>
                    {post.date}
                    <img src="/images/global.svg" alt="global" />
                  </span>
                </div>
              </a>
              <button>
                <img src="/images/ellipsis.svg" alt="three-dots" />
              </button>
            </SharedActor>

            <Description>{post.caption}</Description>
            <SharedImage>
              {post.image !== "" && (
                <a>
                  <img src={post.image} alt="shared-image" />
                </a>
              )}
              {post.video !== "" && (
                <a>
                  <ReactPlayer
                    url={post.video}
                    controls={true}
                    width="100%"
                    height="400px"
                  />
                </a>
              )}
            </SharedImage>
            <SocialCounts>
              <li>
                <button>
                  <img src="/images/reaction-like.svg" alt="like" />
                  <img src="/images/reaction-love.svg" alt="love" />
                  <img src="/images/reaction-bulb.svg" alt="bulb" />
                  <img src="/images/reaction-clap.svg" alt="clap" />
                  <span>45</span>
                </button>
              </li>
            </SocialCounts>
            <LikeShare>
              <button>
                <img src="/images/like.svg" alt="like" />
                <span>Like</span>
              </button>
              <button>
                <img src="/images/comment.svg" alt="comment" />
                <span>Comment</span>
              </button>
              <button>
                <img src="/images/repost.svg" alt="repost" />
                <span>Repost</span>
              </button>
              <button>
                <img src="/images/send.svg" alt="send" />
                <span>Send</span>
              </button>
            </LikeShare>
          </Article>
        ))}
      </div>
      <PostModal
        data={data}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        handleClick={handleClick}
        addNewPost={addNewPost}
        setLoading={setLoading}
      />
    </Container>
  );
};

const Container = styled.div`
  grid-area: main;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;

  img {
    width: 32px;
  }
`;

const CommonCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  border: none;
  position: relative;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  transition: box-shadow 83ms;
`;

const ShareBox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  color: #958b7b;
  margin: 0 0 8px;
  background-color: #fff;
  div {
    button {
      outline: none;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      line-height: 1.5;
      min-height: 48px;
      background-color: transparent;
      border: none;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-weight: 600;
      transition: 160ms;

      &:hover {
        background-color: rgba(0, 0, 0, 0.08);
      }
    }

    &:first-child {
      display: flex;
      align-items: center;
      padding: 8px 16px 0px 16px;

      img {
        aspect-ratio: 1 / 1;
        width: 48px;
        border-radius: 50%;
        margin-right: 8px;
      }

      button {
        margin: 4px 0;
        flex-grow: 1;
        border-radius: 35px;
        padding-left: 16px;
        border: 1px solid rgba(0, 0, 0, 0.25);
        text-align: left;
      }
    }

    &:nth-child(2) {
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-wrap: wrap;
      padding-bottom: 4px;

      button {
        img {
          margin: 0 4px 0 -2px;
        }
        border-radius: 10px;
        padding-left: 16px;
      }

      @media (max-width: 374px) {
        flex-direction: column;
      }
    }
  }
`;

const Article = styled(CommonCard)`
  padding: 0;
  margin: 0 0 8px;
  overflow: visible;
  transition: all 0.2s ease-out;
`;

const DeletePost = styled.button`
  position: absolute;
  top: 20px;
  right: 16px;
  background: #fff;
  border: none;
  border-radius: 5px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  width: 100px;
  height: 40px;
  font-size: 14px;
  transition-duration: 167ms;
  text-align: center;
  display: none;
  z-index: 1000;
`;

const SharedActor = styled.div`
  padding-right: 40px;
  padding: 12px 16px 0;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  a {
    margin-right: 12px;
    overflow: hidden;
    display: flex;
    flex-grow: 1;
    text-decoration: none;

    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      aspect-ratio: 1 / 1;
    }

    & > div {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;
      margin-left: 8px;
      overflow: hidden;

      span {
        text-align: left;
        font-size: 12px;

        &:first-child {
          font-size: 14px;
          font-weight: 600;
          color: rgba(0, 0, 0, 1);
        }

        &:nth-child(2) {
          color: rgba(0, 0, 0, 0.6);
        }

        &:nth-child(3) {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(0, 0, 0, 0.6);
          margin-top: -15px;

          img {
            width: 15px;
          }
        }
      }
    }
  }

  button {
    position: absolute;
    right: 10px;
    top: 2px;
    background: transparent;
    border: none;
    outline: none;

    &:hover {
      cursor: pointer;
      ${DeletePost} {
        display: block;
      }
    }
  }
`;

const Description = styled.div`
  padding: 0 16px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  text-align: left;
`;

const SharedImage = styled.div`
  margin-top: 8px;
  width: 100%;
  display: block;
  position: relative;
  background-color: #f9fafb;

  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }

  .pdf-iframe {
    @media (max-width: 786px) {
      height: 344px;
    }
  }
`;

const SocialCounts = styled.ul`
  line-height: 1.3;
  display: flex;
  align-items: flex-start;
  overflow: auto;
  margin: 0 16px;
  padding: 8px 0;
  border-bottom: 1px solid #e9e5df;
  list-style: none;

  li {
    margin-right: 5px;

    button {
      display: flex;
      align-items: center;
      border: none;
      background-color: transparent;

      img {
        border: 2px solid white;
        border-radius: 50%;
        margin-left: -7px;
        transition: transform 0.2s ease-in-out;

        &:first-child {
          margin: 0;
        }

        &:hover {
          transform: translateY(-10px);
        }
      }

      span {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        font-weight: 500;
        margin-left: 5px;
      }
    }
  }
`;

const LikeShare = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 12px;
  padding: 4px 8px;
  margin: 0;
  min-height: 40px;

  button {
    padding: 8px;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: transparent;
    outline: none;
    cursor: pointer;
    border: none;

    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
      border-radius: 10px;
    }

    @media (max-width: 876px) {
      flex-direction: column;
    }
  }
`;

export default Main;
