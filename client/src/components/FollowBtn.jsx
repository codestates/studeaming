import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { faHeart as solid_heart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regular_heart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import userAPI from "../api/user";
import {
  follow,
  unfollow,
  signinModalOpen,
  profileModalOpen,
} from "../store/actions";

const Container = styled.div`
  display: inline-flexbox;
  align-items: center;
`;

const FollowIcon = styled(FontAwesomeIcon)`
  color: var(--color-main-100);
  font-size: 1.2rem;
  margin: 0 0.4rem;
  cursor: pointer;
`;

const SigninNoti = styled.div`
  color: var(--color-black-50);
  font-size: 0.9rem;

  span {
    font-size: 0.9rem;
    color: var(--color-main-100);
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
  }
`;

function FollowBtn({ username }) {
  const { follows } = useSelector(({ followReducer }) => followReducer);
  const [isFollowed, setIsFollowed] = useState(true);
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const dispatch = useDispatch();

  const checkFollowing = (username) => {
    const check = follows.map((follow) => follow.username).includes(username);
    setIsFollowed(check);
  };

  const changeFollowing = (username) => {
    if (isFollowed) {
      userAPI
        .unfollow(username)
        .then(() => {
          setIsFollowed(false);
          dispatch(unfollow(username));
        })
        .catch(() => {
          setIsBtnClicked(true);
        });
    } else {
      userAPI
        .follow(username)
        .then((res) => {
          setIsFollowed(true);
          dispatch(follow(res.data.newFollow));
        })
        .catch(() => {
          setIsBtnClicked(true);
        });
    }
  };

  const gotoSignin = () => {
    dispatch(profileModalOpen(false));
    dispatch(signinModalOpen(true));
  };

  useEffect(() => {
    checkFollowing(username);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsBtnClicked(false);
    }, 3000);
  }, [isBtnClicked]);

  return (
    <Container>
      <FollowIcon
        icon={isFollowed ? solid_heart : regular_heart}
        onClick={() => changeFollowing(username)}
      ></FollowIcon>
      {isBtnClicked && (
        <SigninNoti>
          팔로우하려면 <span onClick={gotoSignin}>로그인</span>하세요.
        </SigninNoti>
      )}
    </Container>
  );
}

export default FollowBtn;
