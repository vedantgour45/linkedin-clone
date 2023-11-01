import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";


const SignUpForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [photo, setPhoto] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const pushPhotoToDB = async () => {
    if (photo) {
      const storageRef = ref(storage, `userProfileImages/${photo.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, photo);
        const url = await getDownloadURL(snapshot.ref);

        setImageURL(url);
        console.log("photo-url", url);
        return url;
        // console.log("db-url", imageURL);
      } catch {
        setErrorMessage("Failed to Upload Image");
      }
    }
  };

  const pushDataToDB = async () => {
    try {
      const userRef = collection(db, "UserInfo");
      const { uid } = auth.currentUser;
      const imageUrl = await pushPhotoToDB();

      await addDoc(userRef, {
        userID: uid,
        name: name,
        email: email,
        description: description,
        profilePicture: imageUrl,
        timeStamp: new Date(),
      });
      toast.success("Registered successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !description || !confirmPassword) {
      setErrorMessage("All fields are mandatory");
      return;
    }

    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("The password must be at least six characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password mismatch");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, {
          displayName: name,
        });

        await pushPhotoToDB();

        await pushDataToDB();

        setLoading(false);
        navigate("/home");
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        // Handle the specific error case where the email is already in use
        setErrorMessage(
          "Email is already in use. Please choose a different email."
        );
      } else {
        // Handle other errors
        setErrorMessage(
          "Error creating an account. Please try again - " + error.message
        );
      }
    }

    setName("");
    setEmail("");
    setDescription("");
    setPassword("");
    setConfirmPassword("");
    setImageURL("");
  };

  return (
    <Container>
      <Head>
        <button onClick={() => navigate("/")}>
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
          <img src="/images/login-logo.svg" alt="logo" />
        </button>
      </Head>
      <form onSubmit={handleSignup}>
        <Form>
          <Card>
            <div>
              <h1>Sign up</h1>
              <p>Join LinkedIn to find the right job</p>
            </div>
            <div>
              <NameAndPhoto>
                <label htmlFor="image">
                  {photo ? (
                    <span>Selected photo: {photo.name}</span>
                  ) : (
                    <span>Upload Your Profile Picture</span>
                  )}

                  {photo ? (
                    <img src={URL.createObjectURL(photo)} alt="upload-icon" />
                  ) : (
                    <img src="/images/upload-image.png" alt="upload-icon" />
                  )}
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={(e) => handlePhotoChange(e)}
                  />
                </label>
              </NameAndPhoto>
              <input
                type="text"
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Write a short Headline to display your skills              "
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password (6+ Characters)"
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm your Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <p>
              By clicking Agree & Join, you agree to the LinkedIn{" "}
              <a href="#">User Agreement, Privacy Policy</a>, and{" "}
              <a href="#">Cookie Policy</a>.
            </p>
            {errorMessage && <Error>{errorMessage}</Error>}

            <button type="submit">
              {loading ? (
                <img src="/images/dots-loading.svg" alt="loading" />
              ) : (
                <p>Agree & Join</p>
              )}
            </button>
          </Card>
        </Form>
      </form>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 52px;
  max-width: 100%;
  background-color: #f4f2ee;
  height: 100vh;
`;

const Head = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10%;

  img {
    width: 60px;
  }

  button {
    cursor: pointer;
    display: inline-flex;
    gap: 10px;
    border: none;
    outline: none;
    color: #0a67c2;
    border-radius: 10px;
    padding: 10px 24px;

    span {
      font-size: 17px;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }
`;

const Form = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  gap: 10px;
  /* align-items: center; */
  padding: 24px;
  background-color: #fff;
  border-radius: 10px;
  min-height: 300px;
  max-width: 400px;

  p {
    text-align: center;
    padding: 10px;
    font-size: 14px;

    a {
      text-decoration: none;
      color: #0a67c2;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 8px;

    h1 {
      font-size: 30px;
      font-weight: 500;
    }

    p {
      text-align: left;
    }

    &:nth-child(2) {
      input {
        font-size: 18px;
        padding: 9px 15px;
        border-radius: 5px;
      }

      ::placeholder {
        font-size: 14px;
      }
    }
  }

  button {
    font-size: 17px;
    background-color: #0a67c2;
    border: none;
    outline: none;
    color: #fff;
    border-radius: 25px;

    p {
      padding: 14px;
    }

    img {
      width: 40px;
    }

    &:hover {
      background-color: #054586;
      cursor: pointer;
    }
  }
`;

const NameAndPhoto = styled.div`
  label {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    border-radius: 25px;
    padding: 10px;
    cursor: pointer;

    img {
      width: 50px;
    }

    input {
      display: none;
    }
  }
`;

const Error = styled.p`
  font-size: 14px;
  color: red;
  text-align: center;
`;

export default SignUpForm;
