import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledSlide = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SlideImg = styled.div`
  width: 100%;
  height: 100%;
  background-image: url("${(props) => props.content}");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.85;

  :hover {
    cursor: pointer;
  }

  > span {
    color: white;
    font-size: 1.6rem;
  }
`;

function Slide({ content }) {
  const navigate = useNavigate();
  const navigateLanding = () => {
    navigate("/asmrsound", { state: content });
  };

  return (
    <StyledSlide>
      <SlideImg content={content.img} onClick={() => navigateLanding()}>
        <span>{content.title}</span>
      </SlideImg>
    </StyledSlide>
  );
}

export default Slide;
