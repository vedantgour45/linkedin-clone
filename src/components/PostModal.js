import React, { useState } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "../utils/cloudinary";
import toast from "react-hot-toast";

const PostModal = ({
  data,
  modalOpen,
  setModalOpen,
  addNewPost,
  setLoading,
  loading,
}) => {
  const [editorText, setEditorText] = useState("");
  const [shareImage, setShareImage] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [assetArea, setAssetArea] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setShareImage(file);
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPdfFile(file);
  };

  const switchAssetArea = (area) => {
    setAssetArea(area);
  };

  const handleClose = () => {
    setEditorText("");
    setShareImage("");
    setVideoLink("");
    setPdfFile(null);
    setAssetArea("");
    setModalOpen(false);
  };

  const createPost = async (post) => {
    setLoading(true);
    try {
      if (shareImage) {
        const downloadURL = await uploadToCloudinary(
          shareImage,
          "userPostImages",
        );
        post.image = downloadURL;
      }

      if (pdfFile) {
        const downloadURL = await uploadToCloudinary(pdfFile, "userPostFile");
        post.file = downloadURL;
      }

      const userPostsCollectionRef = collection(db, "posts");
      await addDoc(userPostsCollectionRef, post);
      addNewPost(post);
      toast.success("Successfully posted!");
      setLoading(false);
      handleClose();
    } catch (error) {
      toast.error("Error adding post");
      setLoading(false);
    }
  };

  const handlePost = () => {
    if (!editorText.trim()) return;

    const post = {
      userId: data.userID,
      user: data.name,
      userImage: data.profilePicture || "",
      userDescription: data.description || "",
      caption: editorText,
      image: "",
      video: videoLink,
      file: null,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      timestamp: serverTimestamp(),
    };

    createPost(post);
  };

  return (
    <>
      {modalOpen && (
        <Container>
          <Content>
            <Header>
              <h2>Create a post</h2>
              <button onClick={handleClose}>
                <img src="/images/close-icon.svg" alt="close" />
              </button>
            </Header>
            <SharedContent>
              <UserInfo>
                {data.profilePicture ? (
                  <img src={data.profilePicture} alt="user" />
                ) : (
                  <img src="/images/user.svg" alt="user" />
                )}
                <div>
                  <p>{data.name}</p>
                  <button className="privacy-pill">
                    <img src="/images/global.svg" alt="" />
                    Anyone
                    <img src="/images/down-icon.svg" alt="" className="down" />
                  </button>
                </div>
              </UserInfo>
              <Editor>
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder="What do you want to talk about?"
                  autoFocus={true}
                />

                {assetArea === "image" && (
                  <UploadMedia>
                    <input
                      type="file"
                      name="media"
                      id="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    {!shareImage ? (
                      <label htmlFor="file" className="upload-btn">
                        Select an image to share
                      </label>
                    ) : (
                      <div className="preview">
                        <img
                          src={URL.createObjectURL(shareImage)}
                          alt="Preview"
                        />
                        <button onClick={() => setShareImage("")}>
                          Remove
                        </button>
                      </div>
                    )}
                  </UploadMedia>
                )}

                {assetArea === "media" && (
                  <VideoInputArea>
                    <input
                      type="text"
                      placeholder="Paste a video link here"
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                    />
                    {videoLink && (
                      <ReactPlayer
                        width="100%"
                        height="auto"
                        url={videoLink}
                        controls
                      />
                    )}
                  </VideoInputArea>
                )}

                {assetArea === "pdf" && (
                  <UploadMedia>
                    <input
                      type="file"
                      id="pdfFile"
                      style={{ display: "none" }}
                      accept="application/pdf"
                      onChange={handlePdfFileChange}
                    />
                    {!pdfFile ? (
                      <label htmlFor="pdfFile" className="upload-btn">
                        Select a PDF to share
                      </label>
                    ) : (
                      <div className="pdf-preview">
                        <div className="preview-header">
                          <p>📎 {pdfFile.name}</p>
                          <button onClick={() => setPdfFile(null)}>
                            Remove
                          </button>
                        </div>
                        <iframe
                          src={URL.createObjectURL(pdfFile)}
                          width="100%"
                          height="300px"
                          title="PDF Preview"
                          style={{
                            borderRadius: "4px",
                            border: "1px solid #e0e0e0",
                          }}
                        />
                      </div>
                    )}
                  </UploadMedia>
                )}
              </Editor>
            </SharedContent>
            <Footer>
              <AttachAssets>
                <AssetButton
                  onClick={() => switchAssetArea("image")}
                  title="Add a photo"
                >
                  <img src="/images/media.svg" alt="" />
                </AssetButton>
                <AssetButton
                  onClick={() => switchAssetArea("media")}
                  title="Add a video"
                >
                  <img src="/images/video.svg" alt="" />
                </AssetButton>
                <AssetButton
                  onClick={() => switchAssetArea("pdf")}
                  title="Add a document"
                >
                  <img src="/images/article.svg" alt="" />
                </AssetButton>
              </AttachAssets>
              <PostButton
                disabled={!editorText.trim() || loading}
                onClick={handlePost}
              >
                {loading ? "Posting..." : "Post"}
              </PostButton>
            </Footer>
          </Content>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 80px;
  animation: fadeIn 0.2s ease-out;
`;

const Content = styled.div`
  width: 100%;
  max-width: 552px;
  background-color: #fff;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
`;

const Header = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid var(--linkedin-border);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 20px;
    font-weight: 400;
    color: var(--linkedin-text);
  }

  button {
    padding: 8px;
    border-radius: 50%;
    &:hover {
      background: rgba(0, 0, 0, 0.08);
    }
    img {
      width: 24px;
      opacity: 0.6;
    }
  }
`;

const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 12px 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 12px;
  }

  div {
    p {
      font-size: 16px;
      font-weight: 600;
      color: var(--linkedin-text);
    }
    .privacy-pill {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      border: 1px solid var(--linkedin-text-secondary);
      border-radius: 16px;
      font-size: 14px;
      font-weight: 600;
      color: var(--linkedin-text-secondary);
      margin-top: 4px;

      img {
        width: 14px;
        height: 14px;
        margin: 0;
      }
      .down {
        width: 12px;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }
`;

const Editor = styled.div`
  padding: 12px 24px;
  textarea {
    width: 100%;
    min-height: 60px;
    resize: none;
    font-size: 18px;
    border: none;
    outline: none;
    &::placeholder {
      color: var(--linkedin-text-secondary);
    }
  }
`;

const UploadMedia = styled.div`
  margin-top: 4px;
  .upload-btn {
    display: block;
    padding: 24px;
    border: 2px dashed var(--linkedin-border);
    border-radius: 8px;
    text-align: center;
    color: var(--linkedin-blue);
    font-weight: 600;
    cursor: pointer;
    &:hover {
      background: rgba(10, 102, 194, 0.05);
    }
  }

  .preview {
    position: relative;
    img {
      width: 100%;
      border-radius: 8px;
    }
    }
  }

  .pdf-preview {
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      p {
        font-size: 14px;
        color: var(--linkedin-text-secondary);
        font-weight: 500;
      }
      button {
        background: none;
        color: #f00;
        font-weight: 600;
        font-size: 13px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

const VideoInputArea = styled.div`
  margin-top: 4px;
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--linkedin-border);
    border-radius: 4px;
    margin-bottom: 12px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 24px 12px;
`;

const AttachAssets = styled.div`
  display: flex;
  gap: 8px;
`;

const AssetButton = styled.button`
  padding: 8px;
  border-radius: 50%;
  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
  img {
    width: 24px;
    opacity: 0.6;
  }
`;

const PostButton = styled.button`
  border-radius: 20px;
  padding: 6px 16px;
  background: ${(props) =>
    props.disabled ? "#e0e0e0" : "var(--linkedin-blue)"};
  color: ${(props) => (props.disabled ? "rgba(0,0,0,0.3)" : "#fff")};
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  min-width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover:not(:disabled) {
    background: var(--linkedin-blue-hover);
  }
`;

export default PostModal;
