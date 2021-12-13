import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SlideContainer from "./SlideContainer";
import SlideMoveBtn from "./SlideMoveBtn";
import Dots from "./Dots";
import Slide from "./Slide";
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

const getWidth = () => {
  return window.innerWidth;
};
const imageSlider = [
  { title: "장작타는 소리 들으며 공부하기", img: image1 },
  { title: "시원한 파도소리 들으며 공부하기", img: image2 },
  { title: "밤 풍경소리 들으며 공부하기", img: image3 },
];

function Slider({ contents }) {
  const [slideInfo, setSlideInfo] = useState({
    activeIndex: 1,
    translate: getWidth(),
    transition: 0.45,
    slides: [...imageSlider],
  });
  const { activeIndex, translate, transition, slides } = slideInfo;
  console.log("액티브 인덱스", activeIndex);

  const autoPlayRef = useRef();
  const transitionRef = useRef();
  const resizeRef = useRef();

  useEffect(() => {
    autoPlayRef.current = nextSlide;
    transitionRef.current = smoothTransition;
    resizeRef.current = handleResize;
  });

  useEffect(() => {
    const play = () => {
      autoPlayRef.current();
    };

    const smooth = (e) => {
      if (e.target.id === "slider-content") {
        transitionRef.current();
      }
    };

    const resize = () => {
      resizeRef.current();
    };

    const transitionEnd = window.addEventListener("transitionend", smooth);
    const interval = setInterval(play, 5000);
    const onResize = window.addEventListener("resize", resize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("transitionend", transitionEnd);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (transition === 0) setSlideInfo({ ...slideInfo, transition: 0.45 });
  }, [transition]);

  const handleResize = () => {
    setSlideInfo({ ...slideInfo, translate: getWidth(), transition: 0 });
  };

  const smoothTransition = () => {
    let slideImgs = [];

    if (activeIndex === 2) {
      slideImgs = [imageSlider[1], imageSlider[2], imageSlider[0]];
    } else if (activeIndex === 0) {
      slideImgs = [imageSlider[2], imageSlider[0], imageSlider[1]];
    } else {
      slideImgs = imageSlider.slice();
    }

    setSlideInfo({
      ...slideInfo,
      slides: slideImgs,
      transition: 0,
      translate: getWidth(),
    });
  };

  const prevSlide = () => {
    setSlideInfo({
      ...slideInfo,
      activeIndex: activeIndex < 1 ? imageSlider.length - 1 : activeIndex - 1,
      translate: 0,
    });
  };

  const nextSlide = () => {
    setSlideInfo({
      ...slideInfo,
      activeIndex: activeIndex === imageSlider.length - 1 ? 0 : activeIndex + 1,
      translate: translate + getWidth(),
    });
  };

  const dotClick = (idx) => {
    setSlideInfo({
      ...slideInfo,
      activeIndex: idx,
      translate: getWidth() * idx,
      transition: 0,
    });
  };

  // const navigate = useNavigate();
  // const navigateLanding = (slide) => {
  //   navigate("/asmrsound", { state: slide });
  // };

  return (
    <StyledSlider>
      <SlideContainer
        translate={translate}
        transition={transition}
        width={getWidth() * slides.length}
        slides={slides}
      >
        {slides.map((slide, idx) => (
          <Slide
            key={slide.img + idx}
            content={slide}
            fakeRoom={contents}
            idx={activeIndex}
          />
        ))}
      </SlideContainer>
      <SlideMoveBtn moveSlide={nextSlide} direction="next" />
      <SlideMoveBtn moveSlide={prevSlide} direction="prev" />
      <Dots
        activeIndex={activeIndex}
        imageSlider={imageSlider}
        onclick={(activeIndex) => dotClick(activeIndex)}
      />
    </StyledSlider>
  );
}

export default Slider;
