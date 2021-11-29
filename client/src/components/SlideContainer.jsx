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
