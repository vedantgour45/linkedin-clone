import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { uploadToCloudinary } from "../utils/cloudinary";
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(file);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password || !name || !description || !confirmPassword) {
      setErrorMessage("All fields are mandatory");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      if (user) {
        let imageUrl = "";
        if (photo) {
          imageUrl = await uploadToCloudinary(photo, "userProfileImages");
        }

        await updateProfile(user, { displayName: name });

        const userRef = collection(db, "UserInfo");
        await addDoc(userRef, {
          userID: user.uid,
          name: name,
          email: email,
          description: description,
          profilePicture: imageUrl,
          timeStamp: new Date(),
        });

        toast.success("Account created successfully!");
        setLoading(false);
        navigate("/home");
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
      toast.error(error.message);
    }
  };

  return (
    <Container>
      <header>
        <img
          src="/images/login-logo.svg"
          alt="LinkedIn"
          onClick={() => navigate("/")}
        />
      </header>

      <FormCard>
        <TitleSection>
          <h1>Make the most of your professional life</h1>
        </TitleSection>

        <form onSubmit={handleSignup}>
          <Row>
            <InputGroup>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </InputGroup>

            <InputGroup>
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
          </Row>

          <InputGroup>
            <label>Professional Headline</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Software Engineer at Google"
              required
            />
          </InputGroup>

          <InputGroup>
            <label>Profile Picture</label>
            <PhotoUpload>
              {photo ? (
                <div className="preview">
                  <img src={URL.createObjectURL(photo)} alt="" />
                  <button type="button" onClick={() => setPhoto(null)}>
                    Remove
                  </button>
                </div>
              ) : (
                <label htmlFor="photo" className="upload-btn">
                  Choose a photo
                </label>
              )}
              <input
                type="file"
                id="photo"
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
            </PhotoUpload>
          </InputGroup>

          <Row>
            <InputGroup>
              <label>Password (6+ characters)</label>
              <PasswordWrapper>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <ToggleButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </ToggleButton>
              </PasswordWrapper>
            </InputGroup>

            <InputGroup>
              <label>Confirm Password</label>
              <PasswordWrapper>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <ToggleButton
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </ToggleButton>
              </PasswordWrapper>
            </InputGroup>
          </Row>

          {errorMessage && <ErrorMsg>{errorMessage}</ErrorMsg>}

          <SubmitBtn type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Agree & Join"}
          </SubmitBtn>
        </form>

        <FooterText>
          Already on LinkedIn? <a href="/login-page">Sign in</a>
        </FooterText>
      </FormCard>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background-color: #f3f2f1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;

  header {
    margin-bottom: 24px;
    img {
      width: 100px;
      cursor: pointer;
    }
  }
`;

const FormCard = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  @media (max-width: 650px) {
    max-width: 400px;
    padding: 24px;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;

  & > div {
    flex: 1;
  }

  @media (max-width: 650px) {
    flex-direction: column;
    gap: 0;
  }
`;

const TitleSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
  h1 {
    font-size: 24px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.9);
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  label {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 4px;
  }
  input {
    padding: 12px;
    border: 1px solid rgba(0, 0, 0, 0.6);
    border-radius: 4px;
    font-size: 16px;
    &:focus {
      border: 2px solid var(--linkedin-blue);
      outline: none;
    }
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    padding-right: 60px;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  font-size: 14px;
  color: var(--linkedin-blue);
  font-weight: 600;
  cursor: pointer;
  z-index: 10;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background: rgba(10, 102, 194, 0.1);
    text-decoration: underline;
  }
`;

const PhotoUpload = styled.div`
  .upload-btn {
    display: block;
    padding: 12px;
    background: #f3f2f1;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    color: var(--linkedin-text-secondary);
    &:hover {
      background: #e0e0e0;
    }
  }

  .preview {
    display: flex;
    align-items: center;
    gap: 12px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }
    button {
      color: #f00;
      font-size: 12px;
    }
  }
`;

const ErrorMsg = styled.p`
  color: #ff0000;
  font-size: 14px;
  text-align: center;
  margin-bottom: 16px;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: var(--linkedin-blue);
  color: #fff;
  border-radius: 28px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  &:hover {
    background: var(--linkedin-blue-hover);
  }
  &:disabled {
    background: #e0e0e0;
    cursor: not-allowed;
  }
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  a {
    color: var(--linkedin-blue);
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default SignUpForm;
