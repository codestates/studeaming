import fireImg from "../images/sound_img_fire.jpeg";
import streamImg from "../images/sound_img_stream.jpg";
import nightImg from "../images/sound_img_night.jpeg";
import rainImg from "../images/sound_img_rain.jpg";
import fireAudio from "./fire.mp3";
import streamAudio from "./stream.mp3";
import nightAudio from "./night.mp3";
import rainAudio from "./rain.mp3";

const sound = [
  {
    keyword: "fire",
    title: "따듯한 모닥불 소리",
    img: fireImg,
    url: fireAudio,
  },
  {
    keyword: "stream",
    title: "시원한 시냇물 소리",
    img: streamImg,
    url: streamAudio,
  },
  {
    keyword: "night",
    title: "밤 풍경 소리",
    img: nightImg,
    url: nightAudio,
  },
  {
    keyword: "rain",
    title: "추적추적 빗소리",
    img: rainImg,
    url: rainAudio,
  },
];

export default sound;
