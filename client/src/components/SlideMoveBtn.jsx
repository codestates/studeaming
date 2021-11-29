import styled from "styled-components";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ArrowBtn = styled(FontAwesomeIcon)`
  cursor: pointer;
  z-index: 100;
  font-size: 24px;

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
    <ArrowBtn
      icon={direction === "next" ? faChevronRight : faChevronLeft}
      onClick={moveSlide}
      className={direction === "next" ? "btn-slide next" : "btn-slide prev"}
    />
  );
}

export default SlideMoveBtn;
