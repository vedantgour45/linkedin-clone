import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PostModal from "./PostModal";
import ReactPlayer from "react-player";
import dummyPosts from "../Utility/dummyPosts";
import toast from "react-hot-toast";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

const Main = ({ data }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState({});
  const [showOptions, setShowOptions] = useState(null); // stores index of post
  const [showConfirm, setShowConfirm] = useState(null); // stores index of post to delete

  useEffect(() => {
    // Ordering by multiple fields requires a composite index in Firestore.
    // Simplifying to one field to fix initial infinite loading.
    // Ordering by server timestamp ensures the most recent posts appear first.
    // Falls back to descending chronological order.
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
        toast.error("Error loading posts. Please refresh.");
      },
    );

    // Fetch all users to enrich posts dynamically
    const usersQuery = query(collection(db, "UserInfo"));
    const usersUnsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersMap = {};
      snapshot.docs.forEach((doc) => {
        const u = doc.data();
        usersMap[u.userID] = u;
      });
      setAllUsers(usersMap);
    });

    return () => {
      unsubscribe();
      usersUnsubscribe();
    };
  }, []);

  const handlePostDelete = async () => {
    if (showConfirm !== null) {
      const postId = posts[showConfirm].id;
      try {
        await deleteDoc(doc(db, "posts", postId));
        toast.success("Post deleted");
      } catch (error) {
        toast.error("Error deleting post");
        console.error(error);
      }
      setShowConfirm(null);
    }
  };

  const addNewPost = (newPost) => {
    // Post is now added via PostModal directly to Firestore
    // and onSnapshot in Main.js will update the UI automatically.
  };

  const handleClick = (e) => {
    e.preventDefault();
    setModalOpen(!modalOpen);
  };

  return (
    <Container>
      <ShareBox>
        <div>
          {data.profilePicture ? (
            <img src={data.profilePicture} alt="User" />
          ) : (
            <img src="/images/user.svg" alt="User" />
          )}
          <button onClick={handleClick}>Start a post</button>
        </div>
        <div>
          <button>
            <img src="/images/video.svg" alt="" className="media-icon video" />
            <span>Video</span>
          </button>
          <button>
            <img src="/images/media.svg" alt="" className="media-icon photo" />
            <span>Photo</span>
          </button>
          <button>
            <img
              src="/images/article.svg"
              alt=""
              className="media-icon article"
            />
            <span>Write article</span>
          </button>
        </div>
      </ShareBox>

      <Content>
        {loading && (
          <Loading>
            <img src="/images/spinner-loading.svg" alt="Loading..." />
          </Loading>
        )}

        {posts.map((post, index) => {
          const author = allUsers[post.userId] || {};
          const displayName = author.name || post.user || "LinkedIn Member";
          const displayImage =
            author.profilePicture || post.userImage || "/images/user.svg";
          const displayDesc =
            author.description || post.userDescription || "LinkedIn Member";

          return (
            <Article key={`post-${index}`} className="fade-in">
              <SharedActor>
                <a href="/home">
                  <img src={displayImage} alt="" />
                  <div>
                    <span className="name">{displayName}</span>
                    <span className="description">{displayDesc}</span>
                    <span className="date">
                      {post.date} • {post.time} •{" "}
                      <img src="/images/global.svg" alt="" />
                    </span>
                  </div>
                </a>
                {auth.currentUser?.uid === post.userId && (
                  <OptionsContainer>
                    <DeleteButton
                      onClick={() =>
                        setShowOptions(showOptions === index ? null : index)
                      }
                    >
                      <img src="/images/ellipsis.svg" alt="" />
                    </DeleteButton>
                    {showOptions === index && (
                      <OptionsMenu>
                        <button
                          onClick={() => {
                            setShowConfirm(index);
                            setShowOptions(null);
                          }}
                        >
                          <img src="/images/item-icon.svg" alt="" />
                          Delete post
                        </button>
                      </OptionsMenu>
                    )}
                  </OptionsContainer>
                )}
              </SharedActor>

              <Description>{post.caption}</Description>
              <SharedImage>
                {post.image && <img src={post.image} alt="Shared" />}
                {post.video && (
                  <ReactPlayer
                    url={post.video}
                    controls
                    width="100%"
                    height="auto"
                  />
                )}
                {post.file && (
                  <div className="pdf-container">
                    <iframe
                      src={`https://docs.google.com/gview?url=${encodeURIComponent(post.file)}&embedded=true`}
                      width="100%"
                      height="500px"
                      title="PDF Preview"
                      frameBorder="0"
                    />
                    <a
                      href={post.file}
                      target="_blank"
                      rel="noreferrer"
                      className="download-link"
                    >
                      <img src="/images/article.svg" alt="" />
                      View or Download Document
                    </a>
                  </div>
                )}
              </SharedImage>

              <SocialCounts>
                <li>
                  <button>
                    <img src="/images/reaction-like.svg" alt="" />
                    <img src="/images/reaction-love.svg" alt="" />
                    <img src="/images/reaction-clap.svg" alt="" />
                    <span>{Math.floor(Math.random() * 100) + 12}</span>
                  </button>
                </li>
                <li className="comments">
                  <span>{Math.floor(Math.random() * 10)} comments</span>
                </li>
              </SocialCounts>

              <SocialActions>
                <ActionButton>
                  <img src="/images/like.svg" alt="" />
                  <span>Like</span>
                </ActionButton>
                <ActionButton>
                  <img src="/images/comment.svg" alt="" />
                  <span>Comment</span>
                </ActionButton>
                <ActionButton>
                  <img src="/images/repost.svg" alt="" />
                  <span>Repost</span>
                </ActionButton>
                <ActionButton>
                  <img src="/images/send.svg" alt="" />
                  <span>Send</span>
                </ActionButton>
              </SocialActions>
            </Article>
          );
        })}

        {dummyPosts.map((post, index) => (
          <Article key={`dummy-${index}`} className="fade-in">
            <SharedActor>
              <a href="/home">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.name)}&background=random`}
                  alt=""
                />
                <div>
                  <span className="name">{post.name}</span>
                  <span className="description">{post.description}</span>
                  <span className="date">
                    {post.date} • {post.time} •{" "}
                    <img src="/images/global.svg" alt="" />
                  </span>
                </div>
              </a>
            </SharedActor>

            <Description>{post.caption}</Description>
            <SharedImage>
              {post.image && <img src={post.image} alt="Shared" />}
              {post.video && (
                <ReactPlayer
                  url={post.video}
                  controls
                  width="100%"
                  height="auto"
                />
              )}
            </SharedImage>

            <SocialCounts>
              <li>
                <button>
                  <img src="/images/reaction-like.svg" alt="" />
                  <img src="/images/reaction-love.svg" alt="" />
                  <img src="/images/reaction-bulb.svg" alt="" />
                  <span>{Math.floor(Math.random() * 500) + 50}</span>
                </button>
              </li>
              <li className="comments">
                <span>{Math.floor(Math.random() * 50) + 5} comments</span>
              </li>
            </SocialCounts>

            <SocialActions>
              <ActionButton>
                <img src="/images/like.svg" alt="" />
                <span>Like</span>
              </ActionButton>
              <ActionButton>
                <img src="/images/comment.svg" alt="" />
                <span>Comment</span>
              </ActionButton>
              <ActionButton>
                <img src="/images/repost.svg" alt="" />
                <span>Repost</span>
              </ActionButton>
              <ActionButton>
                <img src="/images/send.svg" alt="" />
                <span>Send</span>
              </ActionButton>
            </SocialActions>
          </Article>
        ))}
      </Content>

      <PostModal
        data={data}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        handleClick={handleClick}
        addNewPost={addNewPost}
        setLoading={setLoading}
        loading={loading}
      />

      {showConfirm !== null && (
        <ConfirmModal>
          <div className="modal-content">
            <h3>Delete post?</h3>
            <p>
              Are you sure you want to permanently remove this post from your
              feed?
            </p>
            <div className="actions">
              <button className="cancel" onClick={() => setShowConfirm(null)}>
                No, cancel
              </button>
              <button className="delete" onClick={handlePostDelete}>
                Delete
              </button>
            </div>
          </div>
        </ConfirmModal>
      )}
    </Container>
  );
};

const Container = styled.div`
  grid-area: main;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommonCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid var(--linkedin-border);
  margin-bottom: 8px;
  overflow: hidden;
  position: relative;
`;

const ShareBox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  padding: 8px 16px;

  div:first-child {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    margin-top: 4px;

    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 12px;
    }

    button {
      flex-grow: 1;
      border-radius: 35px;
      padding: 12px 16px;
      border: 1px solid rgba(0, 0, 0, 0.35);
      text-align: left;
      color: var(--linkedin-text-secondary);
      font-weight: 600;
      font-size: 14px;
      background-color: transparent;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }

  div:nth-child(2) {
    display: flex;
    justify-content: space-around;

    button {
      display: flex;
      align-items: center;
      padding: 12px;
      border-radius: 4px;
      color: var(--linkedin-text-secondary);
      font-weight: 600;
      font-size: 14px;

      .media-icon {
        width: 24px;
        margin-right: 8px;

        &.video {
          filter: hue-rotate(180deg);
        }
        &.photo {
          filter: hue-rotate(90deg);
        }
        &.article {
          filter: hue-rotate(240deg);
        }
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.08);
      }
    }
  }
`;

const Article = styled(CommonCard)`
  padding: 0;
  margin: 0 0 8px;
`;

const SharedActor = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;

  a {
    display: flex;
    flex-grow: 1;
    text-decoration: none;

    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }

    div {
      display: flex;
      flex-direction: column;
      margin-left: 8px;

      .name {
        font-size: 14px;
        font-weight: 600;
        color: var(--linkedin-text);
        &:hover {
          text-decoration: underline;
          color: #0a66c2;
        }
      }

      .description {
        font-size: 12px;
        color: var(--linkedin-text-secondary);
      }

      .date {
        font-size: 12px;
        color: var(--linkedin-text-secondary);
        display: flex;
        align-items: center;
        gap: 4px;
        height: 25px;

        img {
          width: 14px;
        }
      }
    }
  }
`;

const OptionsContainer = styled.div`
  position: relative;
`;

const OptionsMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border-radius: 8px 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 160px;
  overflow: hidden;
  border: 1px solid var(--linkedin-border);

  button {
    width: 100%;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 600;
    color: var(--linkedin-text-secondary);
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: var(--linkedin-blue);
    }
    img {
      width: 18px;
      opacity: 0.7;
    }
  }
`;

const DeleteButton = styled.button`
  padding: 8px;
  border-radius: 50%;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const Description = styled.div`
  padding: 0 16px;
  font-size: 14px;
  color: var(--linkedin-text);
  white-space: pre-wrap;
  margin-top: 8px;
`;

const SharedImage = styled.div`
  margin-top: 12px;
  background-color: #f9fafb;
  img {
    width: 100%;
    display: block;
  }
  .pdf-container {
    padding: 0;
    iframe {
      border: none;
      display: block;
    }
    .download-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      background: #f3f2f0;
      color: #0a66c2;
      font-weight: 600;
      text-decoration: none;
      border-top: 1px solid var(--linkedin-border);
      &:hover {
        background: #e0e0e0;
        text-decoration: underline;
      }
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const SocialCounts = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 16px;
  padding: 8px 0;
  border-bottom: 1px solid var(--linkedin-border);
  list-style: none;

  li button {
    display: flex;
    align-items: center;
    gap: 2px;
    img {
      width: 16px;
    }
    span {
      font-size: 12px;
      color: var(--linkedin-text-secondary);
    }
  }

  .comments span {
    font-size: 12px;
    color: var(--linkedin-text-secondary);
    cursor: pointer;
    &:hover {
      color: var(--linkedin-blue);
      text-decoration: underline;
    }
  }
`;

const SocialActions = styled.div`
  display: flex;
  padding: 4px 12px;
  gap: 4px;
`;

const ActionButton = styled.button`
  flex-grow: 1;
  padding: 12px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--linkedin-text-secondary);
  font-weight: 600;
  font-size: 14px;
  border-radius: 4px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    span {
      display: none;
    }
    img {
      width: 24px;
    }
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 24px;
  img {
    width: 40px;
  }
`;

const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-content {
    background: white;
    padding: 24px;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;

    h3 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    p {
      color: var(--linkedin-text-secondary);
      font-size: 14px;
      margin-bottom: 24px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;

      button {
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;

        &.cancel {
          border: 1px solid var(--linkedin-blue);
          color: var(--linkedin-blue);
          &:hover {
            background: rgba(10, 102, 194, 0.1);
          }
        }
        &.delete {
          background: var(--linkedin-blue);
          color: white;
          &:hover {
            background: var(--linkedin-blue-hover);
          }
        }
      }
    }
  }
`;

export default Main;
