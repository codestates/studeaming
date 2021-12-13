import { useEffect } from "react";
import { gsap } from "gsap";
import styled from "styled-components";

const StyledSlideContainer = styled.div`
  transform: translateX(-${(props) => props.translate}px);
  transition: transform ease-out ${(props) => props.transition}s;
  width: ${(props) => props.width}px;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
`;

const SlideContainer = ({ translate, transition, width, children }) => {
  return (
    <StyledSlideContainer
      id="slider-content"
      translate={translate}
      transition={transition}
      width={width}
    >
      {children}
    </StyledSlideContainer>
  );
};

export default SlideContainer;
