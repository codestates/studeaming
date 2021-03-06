import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { gsap } from "gsap";

const draw = keyframes`
  to {
    stroke-dashoffset:0;
  }
`;

const Svg = styled.svg`
  width: 60%;
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: ${draw} 2s linear forwards;
`;

const Container = styled.div`
  z-index: 1020;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
`;

function Welcome() {
  useEffect(() => {
    gsap.to("#svg_intro", {
      display: "none",
      opacity: 0,
      delay: 2.5,
      duration: 1,
    });
  }, []);

  return (
    <Container id="svg_intro">
      <Svg
        id="레이어_1"
        data-name="레이어 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 300"
      >
        <path
          d="M49.54,182.54a24.52,24.52,0,0,1-9.77-7.68A19.15,19.15,0,0,1,35.92,164H50.08a9.67,9.67,0,0,0,4,7,14.56,14.56,0,0,0,9.18,2.82c3.84,0,6.81-.74,8.94-2.22a6.72,6.72,0,0,0,3.18-5.7,5.87,5.87,0,0,0-3.54-5.52,67,67,0,0,0-11.22-4,107.61,107.61,0,0,1-12.12-4,21.36,21.36,0,0,1-8.11-5.88C38.15,144,37,140.48,37,136.16a16.22,16.22,0,0,1,3.13-9.66,20.66,20.66,0,0,1,8.94-6.9,33.37,33.37,0,0,1,13.38-2.52q11.26,0,18.18,5.7T88,138.32H74.33a9.81,9.81,0,0,0-3.6-7.08c-2.16-1.76-5.09-2.64-8.77-2.64s-6.35.68-8.27,2A6.33,6.33,0,0,0,50.8,136a5.82,5.82,0,0,0,1.93,4.44,13.49,13.49,0,0,0,4.68,2.82q2.75,1,8.16,2.58a88.57,88.57,0,0,1,11.81,3.9,22,22,0,0,1,8,5.82q3.34,3.84,3.47,10.2a17.17,17.17,0,0,1-3.11,10.08,20.81,20.81,0,0,1-8.82,7,32.93,32.93,0,0,1-13.38,2.52A33.33,33.33,0,0,1,49.54,182.54Z"
          style={{
            fill: "white",
            stroke: "#616cf7",
            strokeMiterlimit: "10",
            strokeWidth: "2px",
          }}
        />
        <path
          d="M119.56,129.32v36.6q0,3.72,1.74,5.34t6,1.62h8.39v11.4h-10.8q-9.24,0-14.16-4.32t-4.92-14v-36.6H98V118.16h7.8V101.72h13.8v16.44h16.08v11.16Z"
          style={{
            fill: "white",
            stroke: "#616cf7",
            strokeMiterlimit: "10",
            strokeWidth: "2px",
          }}
        />
        <path
          d="M208.12,118.16v66.12H194.44v-7.8A22.14,22.14,0,0,1,186,182.9a26.83,26.83,0,0,1-11.1,2.34,29.65,29.65,0,0,1-14-3.24,23.41,23.41,0,0,1-9.72-9.6A31.14,31.14,0,0,1,147.64,157V118.16H161.2V155q0,8.88,4.44,13.62t12.12,4.74q7.68,0,12.18-4.74t4.5-13.62V118.16Z"
          style={{
            fill: "white",
            stroke: "#616cf7",
            strokeMiterlimit: "10",
            strokeWidth: "2px",
          }}
        />
        <path
          d="M225.7,133.28a30.17,30.17,0,0,1,27.18-16.2,31,31,0,0,1,12.78,2.82,26.15,26.15,0,0,1,10,7.5V95.48h13.8v88.8h-13.8v-10a25.61,25.61,0,0,1-9.3,7.92,28.86,28.86,0,0,1-13.62,3.12A29.59,29.59,0,0,1,237,181a30.91,30.91,0,0,1-11.28-12.24,37.65,37.65,0,0,1-4.14-17.82A36.59,36.59,0,0,1,225.7,133.28Zm47.16,6a19.8,19.8,0,0,0-7.38-7.68,19.31,19.31,0,0,0-9.84-2.64,19.65,19.65,0,0,0-9.84,2.58,19.46,19.46,0,0,0-7.38,7.56,23.6,23.6,0,0,0-2.82,11.82,24.63,24.63,0,0,0,2.82,12,19.9,19.9,0,0,0,7.44,7.86,19.08,19.08,0,0,0,9.78,2.7,19.31,19.31,0,0,0,9.84-2.64,19.7,19.7,0,0,0,7.38-7.74,24.28,24.28,0,0,0,2.82-11.94A23.94,23.94,0,0,0,272.86,139.28Z"
          style={{
            fill: "white",
            stroke: "#616cf7",
            strokeMiterlimit: "10",
            strokeWidth: "2px",
          }}
        />
        <path
          d="M367.6,156.32H317.08A18.35,18.35,0,0,0,323,169a18.56,18.56,0,0,0,13,4.8q11,0,15.6-9.24h14.76a29.78,29.78,0,0,1-10.86,14.94q-7.86,5.82-19.5,5.82a33.77,33.77,0,0,1-17-4.26,30.31,30.31,0,0,1-11.76-12,36.61,36.61,0,0,1-4.26-17.94,37.47,37.47,0,0,1,4.14-17.94,29.12,29.12,0,0,1,11.64-11.94,34.64,34.64,0,0,1,17.22-4.2,33.68,33.68,0,0,1,16.68,4.08A28.83,28.83,0,0,1,364,132.62a34.51,34.51,0,0,1,4.08,17A42.77,42.77,0,0,1,367.6,156.32Zm-13.8-11a15.57,15.57,0,0,0-5.4-12.12,19.31,19.31,0,0,0-13.08-4.56,17.57,17.57,0,0,0-12.12,4.5,18.81,18.81,0,0,0-6,12.18Z"
          style={{
            fill: "white",
            stroke: "#616cf7",
            strokeMiterlimit: "10",
            strokeWidth: "2px",
          }}
        />
        <path
          d="M381.1,133.28a30.16,30.16,0,0,1,27.06-16.2,28.86,28.86,0,0,1,13.62,3.06,27.64,27.64,0,0,1,9.3,7.62v-9.6h13.8v66.12h-13.8v-9.84a27.17,27.17,0,0,1-9.48,7.8A30.68,30.68,0,0,1,392.32,181a31.06,31.06,0,0,1-11.22-12.24A37.65,37.65,0,0,1,377,150.92,36.59,36.59,0,0,1,381.1,133.28Zm47.16,6a19.8,19.8,0,0,0-7.38-7.68A19.31,19.31,0,0,0,411,129a19.65,19.65,0,0,0-9.84,2.58,19.46,19.46,0,0,0-7.38,7.56A23.6,23.6,0,0,0,391,150.92a24.63,24.63,0,0,0,2.82,12,19.9,19.9,0,0,0,7.44,7.86,19.08,19.08,0,0,0,9.78,2.7,19.31,19.31,0,0,0,9.84-2.64,19.7,19.7,0,0,0,7.38-7.74,24.28,24.28,0,0,0,2.82-11.94A23.94,23.94,0,0,0,428.26,139.28Z"
          style={{
            fill: "white",
            stroke: "#616cf7",
            strokeMiterlimit: "10",
            strokeWidth: "2px",
          }}
        />
        <path
          d="M556.9,120.32a23.41,23.41,0,0,1,9.72,9.6,31.14,31.14,0,0,1,3.54,15.36v39H556.6v-37q0-8.88-4.44-13.62T540,129q-7.68,0-12.18,4.74t-4.5,13.62v37H509.8v-37q0-8.88-4.44-13.62T493.24,129q-7.68,0-12.18,4.74t-4.5,13.62v37H462.88V118.16h13.68v7.56a22.74,22.74,0,0,1,8.52-6.36,27,27,0,0,1,11-2.28,29.39,29.39,0,0,1,14.16,3.36,23,23,0,0,1,9.6,9.72,22.18,22.18,0,0,1,9.36-9.54,27.68,27.68,0,0,1,13.68-3.54A29.65,29.65,0,0,1,556.9,120.32Z"
          style={{
            fill: "white",
            stroke: "#616cf7",
            strokeMiterlimit: "10",
            strokeWidth: "2px",
          }}
        />
        <path
          d="M588.28,106.88a8.76,8.76,0,0,1,6.24-15,8.33,8.33,0,0,1,6.12,2.52,9,9,0,0,1,0,12.48,8.33,8.33,0,0,1-6.12,2.52A8.47,8.47,0,0,1,588.28,106.88Zm13,11.28v66.12H587.56V118.16Z"
          style={{
            fill: "white",
            stroke: "#616cf7",
            strokeMiterlimit: "10",
            strokeWidth: "2px",
          }}
        />
        <path
          d="M666.58,120.32a23,23,0,0,1,9.66,9.6,31.58,31.58,0,0,1,3.48,15.36v39H666.16v-37q0-8.88-4.44-13.62T649.6,129q-7.68,0-12.18,4.74t-4.5,13.62v37H619.24V118.16h13.68v7.56a22.64,22.64,0,0,1,8.58-6.36,27.43,27.43,0,0,1,11.1-2.28A29.65,29.65,0,0,1,666.58,120.32Z"
          style={{
            fill: "white",
            stroke: "#616cf7",
            strokeMiterlimit: "10",
            strokeWidth: "2px",
          }}
        />
        <path
          d="M737.38,120.14a26.16,26.16,0,0,1,9.3,7.62v-9.6h13.8v67.2a33.78,33.78,0,0,1-3.84,16.26,27.75,27.75,0,0,1-11.1,11.22,34.85,34.85,0,0,1-17.34,4.08q-13.44,0-22.32-6.3a23.21,23.21,0,0,1-10.08-17.1h13.56a14.68,14.68,0,0,0,6.66,8.34A22.53,22.53,0,0,0,728.2,205q8.28,0,13.38-5t5.1-14.64v-11a28.42,28.42,0,0,1-22.92,11A29.59,29.59,0,0,1,708,181a30.91,30.91,0,0,1-11.28-12.24,37.65,37.65,0,0,1-4.14-17.82,36.59,36.59,0,0,1,4.14-17.64,30.16,30.16,0,0,1,27.06-16.2A29.32,29.32,0,0,1,737.38,120.14Zm6.48,19.14a19.8,19.8,0,0,0-7.38-7.68,19.33,19.33,0,0,0-9.84-2.64,19.65,19.65,0,0,0-9.84,2.58,19.32,19.32,0,0,0-7.38,7.56,23.6,23.6,0,0,0-2.82,11.82,24.63,24.63,0,0,0,2.82,12,19.83,19.83,0,0,0,7.44,7.86,19.06,19.06,0,0,0,9.78,2.7,19.33,19.33,0,0,0,9.84-2.64,19.7,19.7,0,0,0,7.38-7.74,24.28,24.28,0,0,0,2.82-11.94A23.94,23.94,0,0,0,743.86,139.28Z"
          style={{
            fill: "white",
            stroke: "#616cf7",
            strokeMiterlimit: "10",
            strokeWidth: "2px",
          }}
        />
      </Svg>
    </Container>
  );
}

export default Welcome;
