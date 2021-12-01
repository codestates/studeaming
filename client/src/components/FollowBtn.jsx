import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { faHeart as solid_heart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regular_heart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import userAPI from "../api/user";
import { follow, unfollow, notify } from "../store/actions";

const FollowIcon = styled(FontAwesomeIcon)`
  color: var(--color-main-100);
  font-size: 1.2rem;
  margin: 0 0.4rem;
`;

function FollowBtn({ username }) {
  const { follows } = useSelector(({ followReducer }) => followReducer);
  const [isFollowed, setIsFollowed] = useState(true);
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
          dispatch(notify("로그인 후 이용해주세요."));
        });
    } else {
      userAPI
        .follow(username)
        .then((res) => {
          setIsFollowed(true);
          dispatch(follow(res.data.newFollow));
        })
        .catch(() => {
          dispatch(notify("로그인 후 이용해주세요."));
        });
    }
  };

  useEffect(() => {
    checkFollowing();
  }, []);

  return (
    <FollowIcon
      icon={isFollowed ? solid_heart : regular_heart}
      onClick={() => changeFollowing(username)}
    />
  );
}

export default FollowBtn;
