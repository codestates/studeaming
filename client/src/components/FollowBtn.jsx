import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { faHeart as solid_heart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regular_heart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import userAPI from "../api/user";
import { notify } from "../store/actions";

const FollowIcon = styled(FontAwesomeIcon)`
  color: var(--color-main-100);
  font-size: 1.2rem;
  margin: 0 0.4rem;
`;

function FollowBtn({ username }) {
  const [isFollowed, setIsFollowed] = useState(true);
  const dispatch = useDispatch();

  const setFollowing = () => {
    // 사용자가 팔로우한 회원 중 현재 조회 중인 사람이 포함되어있는지 확인하고 isFollowed를 세팅한다.
  };

  const changeFollowing = () => {
    if (isFollowed) {
      try {
        userAPI.unfollow(username);
        setIsFollowed(false);
        // TODO: 전역 상태에서 제거
      } catch {
        dispatch(notify("로그인 후 이용해주세요."));
      }
    } else {
      try {
        userAPI.follow(username);
        setIsFollowed(true);
        // TODO: 전역 상태에 추가
      } catch {
        dispatch(notify("로그인 후 이용해주세요."));
      }
    }
  };

  useEffect(() => {
    setFollowing();
  }, []);

  return <FollowIcon icon={isFollowed ? solid_heart : regular_heart} />;
}

export default FollowBtn;
