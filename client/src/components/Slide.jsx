import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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

function Slide({ content, fakeRoom, idx }) {
  console.log("페이크룸", fakeRoom);
  console.log("컨텐츠", idx);
  const navigate = useNavigate();
  const navigateLanding = (fakeRoom) => {
    navigate("/asmrsound", { state: fakeRoom });
  };

  return (
    <StyledSlide>
      {/* {fakeRoom.length ? (
        fakeRoom.map((data, idx) => (
          <SlideImg
            content={data.thumbnail}
            onClick={() => navigateLanding(fakeRoom[idx])}
          >
            <h3>{data.title}</h3>
          </SlideImg>
        ))
      ) : (
        <div>hello world</div>
      )} */}
      <SlideImg content={content.img} onClick={() => navigateLanding(fakeRoom)}>
        <h3>{content.title}</h3>
      </SlideImg>
    </StyledSlide>
  );
}

export default Slide;
