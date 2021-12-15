import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { getUserInfo, userInfoEditModalOpen } from "../store/actions/index";
import Button from "./Button";
import userAPI from "../api/user";
import { InputContainer, Input, Desc } from "../styles/reusableStyle";
import defaultImg from "../assets/images/img_profile_default.svg";

const ProfileImg = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 16px;
  :hover {
    color: #f5f5f5;
  }
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 16px;
    object-fit: cover;
  }
  #remove_profile_img {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    /* top: 50%; */
    top: 0;
    left: 0;
    color: transparent;
    border-radius: 50%;
    font-size: 24px;
    :hover {
      transition: 0.3s;
      background-color: rgba(0, 0, 0, 0.3);
      color: #f5f5f5;
    }
  }
`;

const ImgLabel = styled.label`
  width: 100px;
  height: 100px;
  border: 1px dashed grey;
  border-radius: 50%;
  font-size: 12px;
  color: #8d8d8d;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 16px;
  + input {
    display: none;
  }
`;

function UserInfoEdit() {
  const { profileImg, username, about } = useSelector(
    ({ userReducer }) => userReducer
  );
  const [editInfo, setEditInfo] = useState({ profileImg, username, about });
  const [imageUrl, setImageUrl] = useState(profileImg);
  const formData = useRef(null);
  const dispatch = useDispatch();

  const getProfileImg = (event) => {
    const src = event.target.files[0];
    setImageUrl(URL.createObjectURL(src));

    setEditInfo({ ...editInfo, profileImg: src });
  };

  const removeProfileImg = () => {
    setImageUrl(null);
  };

  const handleInputValue = (key) => (e) => {
    setEditInfo({ ...editInfo, [key]: e.target.value });
  };

  const editRequest = async () => {
    formData.current = new FormData();
    formData.current.append("profile_img", editInfo.profileImg);
    formData.current.append("username", editInfo.username);
    formData.current.append("about", editInfo.about);

    userAPI.modifyUserInfo(formData.current).then((res) => {
      const data = res.data.user;
      dispatch(getUserInfo(data));
      dispatch(userInfoEditModalOpen(false));
    });
  };

  return (
    <>
      {imageUrl ? (
        <ProfileImg>
          <img src={imageUrl} />
          <div id="remove_profile_img">
            <span
              onClick={removeProfileImg}
              style={{ cursor: "pointer", fontSize: "24px" }}
            >
              &times;
            </span>
          </div>
        </ProfileImg>
      ) : (
        <div>
          <ImgLabel htmlFor="profile_img">프로필 업로드</ImgLabel>
          <input
            type="file"
            id="profile_img"
            accept="image/*"
            onChange={getProfileImg}
          ></input>
        </div>
      )}

      <InputContainer>
        <Desc htmlFor="username">닉네임</Desc>
        <Input
          type="text"
          id="username"
          onChange={handleInputValue("username")}
          spellCheck="false"
        />
      </InputContainer>
      <InputContainer>
        <Desc htmlFor="about">소개글 변경</Desc>
        <Input
          type="text"
          id="about"
          onChange={handleInputValue("about")}
          maxLength="40"
          placeholder="최대 40자"
          spellCheck="false"
        />
      </InputContainer>
      <Button message="변경하기" clickEvent={editRequest} />
    </>
  );
}

export default UserInfoEdit;
