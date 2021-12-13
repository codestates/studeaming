import styled, { keyframes } from "styled-components";

const Wiggle1 = keyframes`
  0% {transform: translateX(-50%)}
  50% {transform: translateX(200%) translateY(-50%) scale(1.5)}
  100% {transform: translateX(-50%) translateY(0px) scale(1.0)}
`;

const Wiggle2 = keyframes`
  0% {transform: translateX(0px)}
  33% {transform: translateX(300%) translateY(-100%)}
  66% {transform: translateX(0) translateY(-100%)}
  100% {transform: translateX(0px) translateY(0%)}
`;

const Wiggle3 = keyframes`
  0% {transform: translateX(0px)}
  33% {transform: translateX(100%) translateY(-50%) }
  66% {transform: translateX(-200%) translateY(0%) }
  100% {transform: translateX(0) translateY(0%) }
`;

const Wiggle4 = keyframes`
  0% {transform: translateX(10%) translateY(10%)}
  100% {transform: translateX(-1200%) translateY(-400%) scale(2)}
`;

const Wiggle5 = keyframes`
  0% {transform: translateX(0%) translateY(0%)}
  100% {transform: translateX(15000%) translateY(8000%) scale(30)}
`;

const Circle1 = styled.div`
  position: fixed;
  top: 25%;
  left: 5%;
  width: 40vw;
  height: 40vw;
  border-radius: 50%;
  background-color: var(--color-main-25);

  animation: ${Wiggle1} 60s infinite;
  transition: linear;
  z-index: -1;
  opacity: 0.5;
`;

const Circle2 = styled.div`
  position: fixed;
  bottom: 20%;
  left: 10%;
  width: 30vw;
  height: 30vw;
  border-radius: 50%;
  background-color: var(--color-main-25);

  animation: ${Wiggle2} 70s infinite;
  transition: linear;
  z-index: -1;
  opacity: 0.6;
`;

const Circle3 = styled.div`
  position: fixed;
  bottom: 10%;
  left: 30%;
  width: 25vw;
  height: 25vw;
  border-radius: 50%;
  background-color: var(--color-main-25);

  animation: ${Wiggle3} 80s infinite;
  transition: linear;
  z-index: -1;
  opacity: 0.7;
`;

const Circle4 = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  width: 10vw;
  height: 10vw;
  border-radius: 50%;
  background-color: var(--color-main-25);

  animation: ${Wiggle4} 40s infinite;
  transition: linear;
  z-index: -1;
  opacity: 0.8;
`;

const Circle5 = styled.div`
  position: fixed;
  top: 10%;
  left: 0;
  width: 1vw;
  height: 1vw;
  border-radius: 50%;
  background-color: var(--color-main-25);
  animation: ${Wiggle5} 50s infinite;
  transition: linear;
  z-index: -1;
  opacity: 0.8;
`;
function BackgroundCircle() {
  return (
    <>
      <Circle1 />
      <Circle2 />
      <Circle3 />
      <Circle4 />
      <Circle5 />
    </>
  );
}

export default BackgroundCircle;
