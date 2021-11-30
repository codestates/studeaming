import { useEffect } from "react";
import { gsap } from "gsap";
import styled from "styled-components";

const StyledSlideContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;

  > .active {
    height: 100%;
    display: flex;
    justify-content: center;

    > .slide-image {
      width: 100%;
      max-width: 768px;
      height: 90%;
      object-fit: cover;
      cursor: pointer;
      :hover {
        box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.5);
      }
    }

    > .slide-title {
      color: white;
      font-size: 20px;
      position: absolute;
      text-align: center;
      top: 50%;
      z-index: 10;
    }
  }
`;

const SlideContainer = ({ activeIndex, imageSlider }) => {
  useEffect(() => {
    gsap.from(".active", {
      opacity: 0,
      duration: 1,
    });
  }, [imageSlider]);
  return (
    <StyledSlideContainer>
      {imageSlider.map((slide, idx) =>
        activeIndex === idx ? (
          <div key={idx} className="active">
            <img className="slide-image" src={slide.img} alt="" />
            <h2 className="slide-title">{slide.title}</h2>
          </div>
        ) : null
      )}
    </StyledSlideContainer>
  );
};

export default SlideContainer;
