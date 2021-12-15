import fireImg from "../images/fire.jpg";
import streamImg from "../images/stream.jpeg";
import nightImg from "../images/night.jpg";
import rainImg from "../images/rain.jpg";

const sound = [
  {
    keyword: "fire",
    title: "따듯한 모닥불 소리",
    img: fireImg,
    url: `${process.env.PUBLIC_URL}/assets/sound/fire.mp3`,
  },
  {
    keyword: "stream",
    title: "시원한 시냇물 소리",
    img: streamImg,
    url: `${process.env.PUBLIC_URL}/assets/sound/stream.mp3`,
  },
  {
    keyword: "night",
    title: "밤 풍경 소리",
    img: nightImg,
    url: `${process.env.PUBLIC_URL}/assets/sound/night.mp3`,
  },
  {
    keyword: "rain",
    title: "추적추적 빗소리",
    img: rainImg,
    url: `${process.env.PUBLIC_URL}/assets/sound/rain.mp3`,
  },
];

export default sound;
