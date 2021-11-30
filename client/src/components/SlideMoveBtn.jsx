import styled from "styled-components";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ArrowBtn = styled.div`
  cursor: pointer;
  z-index: 100;

  &.next {
    position: absolute;
    top: 50%;
    right: 30px;

    :hover {
      color: white;
    }
  }

  &.prev {
    position: absolute;
    top: 50%;
    left: 30px;

    :hover {
      color: white;
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
