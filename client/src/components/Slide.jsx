import styled from "styled-components";

const StyledSlide = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SlideImg = styled.div`
  width: 100%;
  max-width: 600px;
  height: 100%;
  background-image: url("${(props) => props.content}");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;

  :hover {
    cursor: pointer;
  }

  > h3 {
    color: white;
  }
`;

function Slide({ content }) {
  return (
    <StyledSlide>
      <SlideImg content={content.img}>
        <h3>{content.title}</h3>
      </SlideImg>
    </StyledSlide>
  );
}

export default Slide;
