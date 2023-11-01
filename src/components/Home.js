import React, { useEffect, useState } from "react";
import LeftSide from "./LeftSide";
import Main from "./Main";
import RightSide from "./RightSide";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const Home = (props) => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState({});

  const fetchUser = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "UserInfo"));
      querySnapshot.forEach((doc) => {
        let temp = { ...doc.data() };
        if (temp.userID === auth.currentUser.uid) {
          // console.log(temp);
          setData(temp);
        }
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    if (!user || !db) return;
    fetchUser();
  }, [user, db]);

  return (
    <Container>
      <Layout>
        <LeftSide data={data} />
        <Main data={data} />
        <RightSide data={data} />
      </Layout>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 40px;
  max-width: 100%;
  background-color: #f4f2ee;
  height: 100vh;
`;

const Layout = styled.div`
  display: grid;
  grid-template-areas: "leftside main rightside";
  grid-template-columns: minmax(0, 4fr) minmax(0, 12fr) minmax(300px, 6fr);
  column-gap: 25px;
  row-gap: 25px;
  /* grid-template-rows: auto; */
  margin: 25px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 0 5px;
  }
`;

export default Home;
