import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import Fuse from "fuse.js";
import {
  loginStateChange,
  verifySocialLogined,
  getUserInfo,
  getFollows,
} from "../store/actions";
import Slider from "../components/Slide/Slider";
import MainContents from "../components/MainContents";
import TopBtn from "../components/TopBtn";
import Loading from "../components/Loading";
import authAPI from "../api/auth";
import userAPI from "../api/user";
import studyroomAPI from "../api/studyroom";

const ContentsSection = styled.section`
  display: flex;
  flex-direction: column;
  padding: 50px 30px;

  @media screen and (max-width: 970px) {
    padding: 30px 20px;
  }
`;

const SearchSection = styled.section`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 50px;

  > .input-box {
    position: relative;
  }

  @media screen and (max-width: 970px) {
    margin-bottom: 30px;
  }
  @media screen and (min-width: 2000px) {
    width: 2000px;
  }
`;

const SearchInput = styled.input`
  width: 300px;
  height: 2.4rem;
  background-color: #f8f8f8;
  border: none;
  outline: none;
  border-radius: 2rem;
  padding-left: 20px;
  font-size: 0.9rem;

  ::placeholder {
    color: #bcbcbc;
  }

  @media screen and (max-width: 380px) {
    width: 200px;

    ::placeholder {
      font-size: 10px;
    }
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
  font-size: 0.9rem;
`;

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
  const [axiosItems, setAxiosItems] = useState([]);
  const [selectedFilterOpt, setSelectedFilterOpt] = useState("시청자 순");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filterOpt = ["시청자 순", "최신 순", "오래 공부한 순"];
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const tryKakaoOAuth = (authorizationCode) => {
    authAPI
      .kakaoOAuth(authorizationCode)
      .then(() => {
        dispatch(loginStateChange(true));
        dispatch(verifySocialLogined(true));
        return userAPI.getUserInfo();
      })
      .then((res) => {
        const { id, username, profileImg, about, studeaming } = res.data.user;
        const data = { id, username, profileImg, about, studeaming };
        dispatch(getUserInfo(data));
        return userAPI.getFollows();
      })
      .then((res) => {
        dispatch(getFollows(res.data.studeamerList));
        navigate("/home");
      })
      .catch((err) => console.log(err));
  };

  const tryGoogleOAuth = (authorizationCode) => {
    authAPI
      .googleOAuth(authorizationCode)
      .then(() => {
        dispatch(loginStateChange(true));
        dispatch(verifySocialLogined(true));
        return userAPI.getUserInfo();
      })
      .then((res) => {
        const { id, username, profileImg, about, studeaming } = res.data.user;
        const data = { id, username, profileImg, about, studeaming };
        dispatch(getUserInfo(data));
        return userAPI.getFollows();
      })
      .then((res) => {
        dispatch(getFollows(res.data.studeamerList));
        navigate("/home");
      })
      .catch((err) => console.log(err));
  };

  const searchItem = (query) => {
    const fuse = new Fuse(axiosItems, {
      keys: ["title", "username"],
    });

    const result = fuse.search(query);
    const finalResult = [];
    if (result.length) {
      result.forEach((item) => {
        finalResult.push(item.item);
      });
      filterHandler(finalResult);
    } else {
      filterHandler(axiosItems);
    }
  };

  const filterHandler = (items) => {
    if (selectedFilterOpt === "시청자 순") {
      const sort = [...items].sort((a, b) => b.headCount - a.headCount);
      setSearchItems(sort);
    } else if (selectedFilterOpt === "최신 순") {
      const sort = [...items].sort((a, b) => b.createdAt - a.createdAt);
      setSearchItems(sort);
    } else if (selectedFilterOpt === "오래 공부한 순") {
      const sort = [...items].sort((a, b) => a.createdAt - b.createdAt);
      setSearchItems(sort);
    }
  };

  useEffect(() => {
    if (code) {
      if (state === "kakao") tryKakaoOAuth(code);
      else if (state === "google") tryGoogleOAuth(code);
    }
  }, []);

  useEffect(() => {
    // get contents 요청 보내기
    setIsLoading(true);
    studyroomAPI.getStudyRoom().then((res) => {
      console.log("알이에스", res);
      setIsLoading(false);
      setAxiosItems(res.data.roomList);
      setSearchItems(res.data.roomList);
      filterHandler(res.data.roomList);
    });
  }, []);

  useEffect(() => {
    filterHandler(searchItems);
  }, [selectedFilterOpt]);

  return (
    <>
      <Slider contents={searchItems.filter((item) => item.user_id === 0)} />
      <ContentsSection>
        <SearchSection>
          <div className="input-box">
            <SearchInput
              type="text"
              placeholder="제목 또는 스터디머로 검색해보세요"
              onChange={(e) => searchItem(e.target.value)}
            ></SearchInput>
            <SearchIcon />
          </div>
          <Filter
            onChange={(e) => {
              setSelectedFilterOpt(e.target.value);
            }}
          >
            {filterOpt.map((opt, idx) => (
              <option value={opt} key={idx}>
                {opt}
              </option>
            ))}
          </Filter>
        </SearchSection>
        {isLoading ? <Loading /> : <MainContents contents={searchItems} />}
      </ContentsSection>
      <TopBtn />
    </>
  );
}

export default Home;
