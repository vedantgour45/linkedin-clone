import React, { useState } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";

const PostModal = ({
  data,
  modalOpen,
  setModalOpen,
  handleClick,
  addNewPost,
  setLoading,
}) => {
  const [editorText, setEditorText] = useState("");
  const [shareImage, setShareImage] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [assetArea, setAssetArea] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file === "" || file === undefined) {
      toast.error("Invalid file type", typeof file);
      return;
    }
    setShareImage(file);
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];

    if (file === "" || file === undefined) {
      toast.error("Invalid file type", typeof file);
      return;
    }
    setPdfFile(file);
  };

  // switching between image and video
  const switchAssetArea = (area) => {
    setShareImage("");
    setVideoLink("");
    setAssetArea(area);
  };

  // Closing the post popup
  const handelClose = (e) => {
    setEditorText("");
    setShareImage("");
    setVideoLink("");
    setAssetArea("");
    handleClick(e);
  };

  const createPost = async (post) => {
    setLoading(true);
    try {
      if (shareImage) {
        const storageRef = ref(storage, `userPostImages/${shareImage.name}`);
        const snapshot = await uploadBytes(storageRef, shareImage);
        const downloadURL = await getDownloadURL(snapshot.ref);

        post.image = downloadURL;
      }

      if (pdfFile) {
        const storageRef = ref(storage, `userPostFile/${pdfFile.name}`);
        const snapshot = await uploadBytes(storageRef, pdfFile);
        const downloadURL = await getDownloadURL(snapshot.ref);

        post.file = downloadURL;
      }

      const userPostsCollectionRef = collection(db, "posts");
      const docRef = await addDoc(userPostsCollectionRef, post);
      addNewPost(post);
      toast.success("Posted");
      setLoading(false);
    } catch (error) {
      toast.error("Error adding post");
    }
  };

  // Post Details
  const handlePost = () => {
    const post = {
      userId: data.userID,
      user: data.name,
      caption: editorText,
      image: shareImage,
      video: videoLink,
      file: pdfFile,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    // console.log(db);
    // console.log(data);
    console.log("Post details", post);

    createPost(post);

    setEditorText("");
    setShareImage("");
    setVideoLink("");
    setAssetArea("");
    setModalOpen(false);
  };

  return (
    <>
      {modalOpen && (
        <Container>
          <Content>
            <Header>
              <h2>Create a post</h2>
              <button onClick={(e) => handelClose(e)}>
                <img src="/images/close-icon.svg" alt="close" />
              </button>
            </Header>
            <SharedContent>
              <UserInfo>
                {data.profilePicture ? (
                  <img src={data.profilePicture} alt="photo" />
                ) : (
                  <img src="/images/user.svg" alt="user" />
                )}
                <div>
                  <p>{data.name}</p>
                  <span>
                    Post to Anyone
                    <img src="/images/global.svg" alt="global" />
                  </span>
                </div>
              </UserInfo>
              <Editor>
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder="What's on your professional mind?"
                  autoFocus={true}
                />
                {/* For Iamges */}
                {assetArea === "image" && (
                  <UploadMedia>
                    <input
                      type="file"
                      name="media"
                      id="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <p>
                      <label htmlFor="file">
                        <span className="material-symbols-outlined">
                          add_circle
                        </span>
                        Select photo to share
                      </label>
                    </p>
                    {shareImage && (
                      <img
                        src={URL.createObjectURL(shareImage)}
                        alt="uploaded-image"
                      />
                    )}
                  </UploadMedia>
                )}

                {/* For Video */}
                {assetArea === "media" && (
                  <div style={{ textAlign: "center" }}>
                    <input
                      type="text"
                      placeholder="Please input video link"
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                    />
                    {videoLink && (
                      <ReactPlayer
                        width={"100%"}
                        height={"auto"}
                        url={videoLink}
                      />
                    )}
                  </div>
                )}

                {/* For File/PDF */}
                {assetArea === "pdf" && (
                  <UploadMedia>
                    <input
                      type="file"
                      name="pdf"
                      id="pdfFile"
                      style={{ display: "none" }}
                      accept=".pdf"
                      onChange={handlePdfFileChange}
                    />
                    <p>
                      <label htmlFor="pdfFile">
                        <span className="material-symbols-outlined">
                          attach_file
                        </span>
                        Select PDF to share
                      </label>
                    </p>
                    {pdfFile && <p>Selected PDF: {pdfFile.name}</p>}
                  </UploadMedia>
                )}
              </Editor>
            </SharedContent>
            <SharedCreation>
              <AttachAssets>
                <AssetButton onClick={() => switchAssetArea("image")}>
                  <p>Photo</p>
                  <img src="/images/media.svg" alt="media" />
                </AssetButton>
                <AssetButton onClick={() => switchAssetArea("media")}>
                  <p>Video</p>
                  <img src="/images/video.svg" alt="video" />
                </AssetButton>
                <AssetButton onClick={() => switchAssetArea("pdf")}>
                  <p>File</p>
                  <img src="/images/media.svg" alt="pdf" />
                </AssetButton>
              </AttachAssets>
              <PostButton
                disabled={!editorText ? true : false}
                onClick={handlePost}
              >
                <img src="/images/rocket.png" alt="post" />
                <p>Post</p>
              </PostButton>
            </SharedCreation>
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
  color: #000000;
  backdrop-filter: blur(3px);
  background-color: rgba(0, 0, 0, 0.8);
  animation: fadeIn 0.3s;
`;

const Content = styled.div`
  width: 90%;
  max-width: 552px;
  background-color: #fff;
  max-height: 90%;
  overflow: initial;
  border-radius: 15px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  margin-inline: auto;
  animation: fadeIn 0.3s;
`;

const Header = styled.div`
  display: block;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    height: 40px;
    width: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.15);
    border: none;
    background-color: transparent;
    cursor: pointer;

    svg,
    img {
      pointer-events: none;
    }
  }
`;

const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;

  svg,
  img {
    width: 48px;
    height: 48px;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 50%;
  }

  p {
    font-size: 16px;
    font-weight: 600;
    margin-left: 5px;
  }
  span {
    font-size: 12px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
    margin-left: 5px;

    display: flex;
    align-items: center;
    gap: 5px;
    color: rgba(0, 0, 0, 0.6);
    margin-top: -15px;

    img {
      width: 12px;
    }
  }
`;

const SharedCreation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px 12px 16px;
  font-weight: 600;
  color: rgba(0, 0, 0 0.6);

  @media (max-width: 350px) {
    gap: 20px;
    flex-direction: column;
  }
`;

const AssetButton = styled.button`
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column-reverse;
  gap: 5px;
  height: 40px;
  min-width: auto;
  color: rgba(0, 0, 0, 0.7);
  background-color: rgba(0, 0, 0, 0.07);
  border-radius: 50%;
  padding: 18%;
  margin-right: 10px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;

  &:hover {
    box-shadow: none;
  }

  p {
    margin-top: -3px;
    font-size: 12px;
  }

  img {
    filter: grayscale(100%);
  }
`;

const AttachAssets = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    box-shadow: none;
  }

  ${AssetButton} {
    width: 40px;
  }
`;

const PostButton = styled.button`
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.disabled ? "rgba(0, 0, 0, 0.6)" : "#fff")};
  background: ${(props) =>
    props.disabled ? "rgba(0, 0, 0, 0.06)" : "#0a66c2"};
  padding: 3px 9px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;

  p {
    font-size: 16px;
    font-weight: 900px;
  }

  img {
    width: 30px;
    height: 30px;
  }

  &:hover {
    box-shadow: none;
  }
`;

const UploadMedia = styled.div`
  text-align: center;

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.7);

    span {
      font-size: 17px;
      margin-top: 2px;
    }
  }
  img {
    width: 100%;
  }
`;

const Editor = styled.div`
  padding: 12px 24px;

  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
    font-size: 16px;
    line-height: 1.5;
    border: none;
    outline: none;
  }

  div {
    &:last-child {
      input {
        padding: 5px;
        color: rgba(0, 0, 0, 0.7);
      }
    }
  }

  ${UploadMedia} {
    label {
      cursor: pointer;
    }

    img {
      border-radius: 15px;
    }
  }
`;

export default PostModal;
