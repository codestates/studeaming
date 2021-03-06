import { VscFoldUp } from "react-icons/vsc";
import styled from "styled-components";
import useScroll from "../hooks/useScroll";

const TopBtnStyled = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 30px;
  bottom: 30px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  background-color: var(--color-main-75);

  :hover {
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
  }
`;

function TopBtn() {
  const scrollFlag = useScroll(false);

  const moveToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  };

  return (
    <>
      {scrollFlag && (
        <TopBtnStyled onClick={moveToTop}>
          <VscFoldUp style={{ color: "white" }} />
        </TopBtnStyled>
      )}
    </>
  );
}

export default TopBtn;
