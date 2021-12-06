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
import Slider from "../components/Slider";
import MainContents from "../components/MainContents";
import TopBtn from "../components/TopBtn";
import Loading from "../components/Loading";
import authAPI from "../api/auth";
import userAPI from "../api/user";
import empty from "../assets/images/empty.png";
import thumbnail1 from "../assets/images/thumbnail1.png";
import thumbnail2 from "../assets/images/thumbnail2.png";
import thumbnail3 from "../assets/images/thumbnail3.png";
import thumbnail4 from "../assets/images/thumbnail4.png";

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
  const [searchItems, setSearchItems] = useState([
    {
      title: "공무원 시험준비 D-182",
      thumbnail: thumbnail1,
      profileImg: "",
      username: "고시생",
      viewer: 1,
      openedAt: 12345671,
    },
    {
      title: "전기기사 시험 D-22 / 화이팅",
      thumbnail: thumbnail2,
      profileImg: "",
      username: "전기전자",
      viewer: 2,
      openedAt: 12345678,
    },
    {
      title: "기말고사 준비 / 집중이 안돼요",
      thumbnail: thumbnail3,
      profileImg: "",
      username: "21학번 김코딩",
      viewer: 0,
      openedAt: 12345673,
    },
    {
      title: "딸래미 시험 D-2 / 같이 공부해요",
      thumbnail: thumbnail4,
      profileImg: "",
      username: "공부왕 찐천재 홍진경",
      viewer: 3,
      openedAt: 12345672,
    },
    {
      title:
        "딸래미 시험 D-2 title이 길면 어떻게 되는지 보고싶어서 일부러 길게 쓴거임 / 같이 공부해요",
      thumbnail: thumbnail4,
      profileImg: "",
      username: "공부왕 찐천재 홍진경",
      viewer: 3,
      openedAt: 12345672,
    },
    {
      title: "토익 900점을 위해 / 스터디 윗미 3일차",
      thumbnail: thumbnail1,
      profileImg: "",
      username: "박해커",
      viewer: 2,
      openedAt: 12645672,
    },
  ]);
  const [contents, setContents] = useState([
    {
      title: "공무원 시험준비 D-182",
      thumbnail: thumbnail1,
      profileImg: "",
      username: "고시생",
      viewer: 1,
      openedAt: 12345671,
    },
    {
      title: "전기기사 시험 D-22 / 화이팅",
      thumbnail: thumbnail2,
      profileImg: "",
      username: "전기전자",
      viewer: 2,
      openedAt: 12345678,
    },
    {
      title: "기말고사 준비 / 집중이 안돼요",
      thumbnail: thumbnail3,
      profileImg: "",
      username: "21학번 김코딩",
      viewer: 0,
      openedAt: 12345673,
    },
    {
      title: "딸래미 시험 D-2 / 같이 공부해요",
      thumbnail: thumbnail4,
      profileImg: "",
      username: "공부왕 찐천재 홍진경",
      viewer: 3,
      openedAt: 12345672,
    },
    {
      title:
        "딸래미 시험 D-2 딸래미 시험 D-2 title이 길면 어떻게 되는지 보고싶어서 일부러 길게 쓴거임 / 같이 공부해요",
      thumbnail: thumbnail4,
      profileImg: "",
      username: "공부왕 찐천재 홍진경",
      viewer: 3,
      openedAt: 12345672,
    },
    {
      title: "토익 900점을 위해 / 스터디 윗미 3일차",
      thumbnail: thumbnail1,
      profileImg: "",
      username: "박해커",
      viewer: 2,
      openedAt: 12645672,
    },
  ]);
  const [selectedFilterOpt, setSelectedFilterOpt] = useState("시청자 순");
  const [isLoading, setIsLoading] = useState(true);
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
    const fuse = new Fuse(contents, {
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
      filterHandler(contents);
    }
  };

  const filterHandler = (items) => {
    if (selectedFilterOpt === "시청자 순") {
      const sort = [...items].sort((a, b) => b.viewer - a.viewer);
      setSearchItems(sort);
    } else if (selectedFilterOpt === "최신 순") {
      const sort = [...items].sort((a, b) => b.openedAt - a.openedAt);
      setSearchItems(sort);
    } else if (selectedFilterOpt === "오래 공부한 순") {
      const sort = [...items].sort((a, b) => a.openedAt - b.openedAt);
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
    // get contents 요청 보내고 성공적으로 받아지면 setIsLoading(false)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterHandler(searchItems);
  }, [selectedFilterOpt]);

  return (
    <>
      <Slider />
      <SearchSection>
        <div className="input-box">
          <SearchInput
            type="text"
            placeholder="주제, 스터디머 등으로 검색해보세요"
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
      {contents.length ? (
        isLoading ? (
          <Loading wsize={50} hsize={50} />
        ) : (
          <MainContents contents={searchItems} />
        )
      ) : isLoading ? (
        <Loading wsize={50} hsize={50} />
      ) : (
        <NotContents>
          <h2>현재 스터디밍이 없습니다...</h2>
          <img src={empty} alt="" style={{ width: "100px" }} />
        </NotContents>
      )}
      <TopBtn />
    </>
  );
}

export default Home;
