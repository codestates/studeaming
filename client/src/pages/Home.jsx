import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import { verifySocialLogined, getUserInfo, getFollows } from "../store/actions";
import Slider from "../components/Slider";
import MainContents from "../components/MainContents";
import TopBtn from "../components/TopBtn";
import Loading from "../components/Loading";
import authAPI from "../api/auth";
import userAPI from "../api/user";
import empty from "../assets/images/empty.png";

const SearchSection = styled.section`
  display: flex;
  justify-content: space-between;
  padding: 50px 80px;

  > .input-box {
    position: relative;
  }

  @media screen and (max-width: 970px) {
    padding: 50px 20px;
  }
`;

const SearchInput = styled.input`
  width: 250px;
  height: 30px;
  background-color: #f8f8f8;
  border: none;
  outline: none;
  border-radius: 2rem;
  padding-left: 20px;
  font-size: 10px;

  ::placeholder {
    color: #bcbcbc;
  }

  @media screen and (max-width: 380px) {
    width: 200px;
  }
`;

const SearchIcon = styled(AiOutlineSearch)`
  position: absolute;
  top: 25%;
  right: 5%;
  cursor: pointer;
  font-size: 16px;
`;

const Filter = styled.select`
  border: none;
  outline: none;
  font-size: 10px;
`;

const NotContents = styled.section`
  padding-left: 80px;

  @media screen and (max-width: 768px) {
    padding-left: 30px;
  }
`;

function Home() {
  const [searchValue, SetSearchValue] = useState("");
  const [contents, setContents] = useState([""]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const filterOpt = ["시청자 순", "최신 순", "오래 공부한 순"];
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const tryKakaoOAuth = (authorizationCode) => {
    authAPI
      .kakaoOAuth(authorizationCode)
      .then(() => {
        dispatch(verifySocialLogined(true));
        return userAPI.getUserInfo();
      })
      .then((res) => {
        const { username, profileImg, about, studeaming } = res;
        const data = { username, profileImg, about, studeaming };
        dispatch(getUserInfo(data));
        return userAPI.getFollows();
      })
      .then((res) => {
        dispatch(getFollows(res.data.studeamerList));
      })
      .catch((err) => console.log(err));
  };

  const tryGoogleOAuth = (authorizationCode) => {
    authAPI
      .googleOAuth(authorizationCode)
      .then(() => {
        dispatch(verifySocialLogined(true));
        return userAPI.getUserInfo();
      })
      .then((res) => {
        const { username, profileImg, about, studeaming } = res;
        const data = { username, profileImg, about, studeaming };
        dispatch(getUserInfo(data));
        return userAPI.getFollows();
      })
      .then((res) => {
        dispatch(getFollows(res.data.studeamerList));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (code) {
      if (state === "kakao") tryKakaoOAuth(code);
      else if (state === "google") tryGoogleOAuth(code);
    }
  }, []);

  useEffect(() => {
    // get contents 요청 보내고 성공적으로 받아지면 setIsLoading(false)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      <section id="main">
        <Slider />
        <SearchSection>
          <div className="input-box">
            <SearchInput
              type="text"
              placeholder="주제, 스터디머 등으로 검색해보세요"
            ></SearchInput>
            <SearchIcon />
          </div>
          <Filter>
            {filterOpt.map((opt, idx) => (
              <option value={opt} key={idx}>
                {opt}
              </option>
            ))}
          </Filter>
        </SearchSection>
        {contents.length ? (
          isLoading ? (
            <Loading wsize={50} hsize={50} />
          ) : (
            <MainContents contents={contents} />
          )
        ) : isLoading ? (
          <Loading wsize={50} hsize={50} />
        ) : (
          <NotContents>
            <h2>현재 스터디밍이 없습니다...</h2>
            <img src={empty} alt="" style={{ width: "100px" }} />
          </NotContents>
        )}
      </section>
      <TopBtn />
    </>
  );
}

export default Home;