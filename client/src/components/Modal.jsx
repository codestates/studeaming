import { useDispatch } from "react-redux";
import { modalOff } from "../store/actions/index";
import styled from "styled-components";

const ModalBackground = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(3px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5000;
`;

const CloseBtn = styled.div`
  position: absolute;
  top: 20px;
  right: 30px;
  cursor: pointer;
  font-size: 26px;
  z-index: 100;
`;

const ModalWrapper = styled.div`
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 35px 25px;
  border-radius: 1rem;
  position: relative;
  box-shadow: 0px 0px 20px #8d8d8d;
`;

function Modal({ children }) {
  const dispatch = useDispatch();

  const modalClose = () => {
    dispatch(modalOff());
  };

  return (
    <ModalBackground onClick={modalClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <CloseBtn onClick={modalClose}>&times;</CloseBtn>
        {children}
      </ModalWrapper>
    </ModalBackground>
  );
}

export default Modal;
