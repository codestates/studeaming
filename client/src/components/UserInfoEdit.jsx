import { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "./Button";
import userApi from "../api/user";
import { InputContainer, Input, Desc } from "./reusableStyle";

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
  const [editInfo, setEditInfo] = useState({
    userImg: null,
    username: "",
    comment: "",
  });

  const getProfileImg = (event) => {
    const src = event.target.files[0];
    setEditInfo({ ...editInfo, userImg: URL.createObjectURL(src) });
  };

  const removeProfileImg = () => {
    setEditInfo({ ...editInfo, userImg: null });
  };

  const handleInputValue = (key) => (e) => {
    setEditInfo({ ...editInfo, [key]: e.target.value });
  };

  const editRequest = () => {
    userApi.modifyUserInfo(editInfo);
    //.then(()=>{}) user 상태 저장.
  };

  return (
    <>
      {editInfo.userImg ? (
        <ProfileImg>
          <img src={editInfo.userImg} />
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
        />
      </InputContainer>
      <InputContainer>
        <Desc htmlFor="comment">소개글 변경</Desc>
        <Input
          type="text"
          id="comment"
          onChange={handleInputValue("comment")}
          maxLength="40"
          placeholder="최대 40자"
        />
      </InputContainer>
      <Button message="변경하기" clickEvent={editRequest} />
    </>
  );
}

export default UserInfoEdit;