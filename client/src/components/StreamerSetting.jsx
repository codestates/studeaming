import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { modalOff } from "../store/actions";
import useAudio from "../hooks/useAudio";
import { Input, Desc } from "./reusableStyle";
import sound from "../assets/sound";
import defaultThumbnail from "../assets/images/empty.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 10px;
  position: relative;

  #studeaming-setting-title {
    color: var(--color-main-100);
    font-weight: 600;
    font-size: 1.2rem;
  }

  #studeaming-warning-message {
    color: var(--color-destructive);
    font-size: 0.8rem;
    margin-left: 0.8rem;
  }

  #info-setting {
    display: flex;
    gap: 2rem;
  }

  #sound-picker {
  }

  #sound-cards {
    display: flex;
    gap: 1rem;
  }
`;

const LiveVideo = styled.video`
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* safari */
  -moz-transform: rotateY(180deg); /* firefox */
`;

const ThumbnailLabel = styled.label`
  width: 360px;
  height: 240px;
  border: 1px dashed var(--color-black-50);
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

const Thumbnail = styled.div`
  width: 360px;
  height: 240px;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  #remove-thumbnail-btn {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    color: transparent;
    font-size: 24px;
    :hover {
      transition: 0.3s;
      background-color: rgba(0, 0, 0, 0.3);
      color: #f5f5f5;
    }
  }
`;

const SoundCard = styled.div`
  width: 150px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  color: white;
  font-weight: 600;
  box-shadow: ${(props) =>
    props.isSelected && "0px 0px 10px var(--color-black-25)"};
  border-radius: 10px;
  cursor: pointer;

  :after {
    content: "";
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    background-image: url(${(props) => props.img});
    background-size: cover;
    border-radius: 10px;
    opacity: 0.7;
    z-index: -1;
  }

  :hover {
    opacity: 0.8;
  }
`;

const StartBtn = styled.button`
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 120px;
  height: 50px;
  border-radius: 10px;
  background-color: #7a7ef4;
  text-align: center;
  font-size: 0.9rem;
  color: white;

  :hover {
    background-color: #656bff;
  }
`;

function StreamerSettingMockup() {
  const { username } = useSelector(({ userReducer }) => userReducer);
  const [streamingInfo, setStreamingInfo] = useState({
    title: "",
    thumbnail: null,
    sound: "",
  });
  const localVideoRef = useRef(HTMLVideoElement);
  const [players, toggle] = useAudio(sound);
  const [hover, setHover] = useState({ mounted: false, idx: null });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkCameraHandler = async () => {
    try {
      const constraints = {
        audio: false,
        video: {
          width: 500,
          height: 330,
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    } catch (err) {
      console.log("Error opening video camera", err);
    }
  };

  const getTitle = (event) => {
    setStreamingInfo({ ...streamingInfo, title: event.target.value });
  };

  const getThumbnail = (event) => {
    const src = event.target.files[0];
    setStreamingInfo({ ...streamingInfo, thumbnail: URL.createObjectURL(src) });
  };

  const removeThumbnail = () => {
    setStreamingInfo({ ...streamingInfo, thumbnail: null });
  };

  const getSound = (ASMR) => {
    setStreamingInfo({ ...streamingInfo, sound: ASMR });
  };

  const hoverHandler = (idx) => {
    setHover({ mounted: true, idx });
  };

  const startBtnHandler = () => {
    dispatch(modalOff());
    navigate("../streamer", { state: streamingInfo });
  };

  useEffect(() => {
    checkCameraHandler();
  }, []);

  useEffect(() => {
    if (hover.mounted) {
      toggle(hover.idx);
    }
  }, [hover]);

  return (
    <>
      <Container>
        <div>
          <span id="studeaming-setting-title">스트리밍 시작하기</span>
          <span id="studeaming-warning-message">
            ❗️부적절한 영상 송출시 스트리밍 또는 모든 서비스 이용이 제한될 수
            있습니다.
          </span>
        </div>
        <div id="info-setting">
          <LiveVideo autoPlay ref={localVideoRef} />
          <div id="info-input">
            <Desc>제목을 입력하세요</Desc>
            <Input onBlur={getTitle} />
            <Desc>썸네일을 선택하세요</Desc>
            {streamingInfo.thumbnail ? (
              <Thumbnail onClick={removeThumbnail}>
                <img src={streamingInfo.thumbnail} />
                <div id="remove-thumbnail-btn">&times;</div>
              </Thumbnail>
            ) : (
              <div className="upload-thumbnail">
                <ThumbnailLabel htmlFor="thumbnail-input">
                  썸네일 업로드하기
                </ThumbnailLabel>
                <input
                  id="thumbnail-input"
                  type="file"
                  accept="image/*"
                  onChange={getThumbnail}
                ></input>
              </div>
            )}
          </div>
        </div>
        <div id="sound-picker">
          <Desc>
            ASMR 사운드를 선택하세요. 마우스를 올리면 사운드가 재생됩니다.
          </Desc>
          <div id="sound-cards">
            {players.map((ASMR, idx) => {
              return (
                <SoundCard
                  key={idx}
                  img={ASMR.img}
                  isSelected={ASMR.keyword === streamingInfo.sound}
                  onClick={() => getSound(ASMR.keyword, idx)}
                  onMouseEnter={() => hoverHandler(idx)}
                  onMouseLeave={() => hoverHandler(idx)}
                >
                  <div className="ASMR-title">{ASMR.title}</div>
                </SoundCard>
              );
            })}
          </div>
        </div>
        <StartBtn onClick={startBtnHandler}>방송 시작</StartBtn>
      </Container>
    </>
  );
}

export default StreamerSettingMockup;
