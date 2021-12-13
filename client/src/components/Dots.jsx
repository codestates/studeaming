import styled from "styled-components";

const AllDots = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 200;

  > .dot {
    cursor: pointer;
    height: 8px;
    width: 8px;
    margin: 10px 3px 0px 3px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    display: inline-block;
  }

  > .active-dot {
    background-color: rgba(0, 0, 0, 0.8);
    transform: scale(1.2);
  }
`;

function Dots({ activeIndex, onclick, imageSlider }) {
  return (
    <AllDots>
      {imageSlider.map((slide, idx) => (
        <span
          key={idx}
          className={`${activeIndex === idx ? "dot active-dot" : "dot"}`}
          onClick={() => onclick(idx)}
        ></span>
      ))}
    </AllDots>
  );
}

export default Dots;
