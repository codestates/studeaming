import styled from "styled-components";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ArrowBtn = styled.div`
  cursor: pointer;
  z-index: 100;

  &.next {
    position: absolute;
    top: calc(50% - 12px);
    right: 30px;
    color: white;

    :hover {
      transform: scale(1.2);
    }
  }

  &.prev {
    position: absolute;
    top: calc(50% - 12px);
    left: 30px;
    color: white;

    :hover {
      transform: scale(1.2);
    }
  }
`;

function SlideMoveBtn({ direction, moveSlide }) {
  return (
    <>
      {direction === "next" ? (
        <ArrowBtn className="next">
          <IoIosArrowForward onClick={moveSlide} size="24" />
        </ArrowBtn>
      ) : (
        <ArrowBtn className="prev">
          <IoIosArrowBack onClick={moveSlide} size="24" />
        </ArrowBtn>
      )}
    </>
  );
}

export default SlideMoveBtn;
