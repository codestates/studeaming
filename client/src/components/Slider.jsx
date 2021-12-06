import { useState, useEffect } from "react";
import styled from "styled-components";
import SlideContainer from "./SlideContainer";
import SlideMoveBtn from "./SlideMoveBtn";
import Dots from "./Dots";
import image1 from "../assets/images/fire.gif";
import image2 from "../assets/images/wave.gif";
import image3 from "../assets/images/night.gif";

const StyledSlider = styled.section`
  width: 100%;
  height: 400px;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
  background-color: #f8f8f8;
`;

function Slider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageSlider = [
    { title: "장작타는 소리 들으며 공부하기", img: image1 },
    { title: "시원한 파도소리 들으며 공부하기", img: image2 },
    { title: "밤 풍경소리 들으며 공부하기", img: image3 },
  ];

  const prevSlide = () => {
    setActiveIndex(activeIndex < 1 ? imageSlider.length - 1 : activeIndex - 1);
  };

  const nextSlide = () => {
    setActiveIndex(
      activeIndex === imageSlider.length - 1 ? 0 : activeIndex + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(
        activeIndex === imageSlider.length - 1 ? 0 : activeIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <StyledSlider>
      <SlideContainer
        activeIndex={activeIndex}
        imageSlider={imageSlider}
      ></SlideContainer>
      <SlideMoveBtn moveSlide={nextSlide} direction="next" />
      <SlideMoveBtn moveSlide={prevSlide} direction="prev" />
      <Dots
        activeIndex={activeIndex}
        imageSlider={imageSlider}
        onclick={(activeIndex) => setActiveIndex(activeIndex)}
      />
    </StyledSlider>
  );
}

export default Slider;
