import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";
import NotoSans from "../assets/fonts/NotoSansKR-Regular.woff";
import Poppins_EL from "../assets/fonts/Poppins-ExtraLight.woff";
import Poppins_M from "../assets/fonts/Poppins-Medium.woff";
import Poppins_R from "../assets/fonts/Poppins-Regular.woff";

const GlobalStyle = createGlobalStyle`
  ${normalize}
  
  @font-face {
    font-family: "NotoSans";
    src: local("NotoSans"), url(${NotoSans}) format("woff");
    unicode-range: U+AC00-D7A3, U+0030-0039
  }

  @font-face {
    font-family: "Poppins-Extra_Light";
    src: local("Poppins_EL"), url(${Poppins_EL}) format("woff");
    unicode-range: U+0041-005A, U+0061-007A
  }

  @font-face {
    font-family: "Poppins-Medium";
    src: local("Poppins_Medium"), url(${Poppins_M}) format("woff");
    unicode-range: U+0041-005A, U+0061-007A
  }

  @font-face {
    font-family: "Poppins-Regular";
    src: local("Poppins_R"), url(${Poppins_R}) format("woff");
    unicode-range: U+0041-005A, U+0061-007A
  }

  *,
  :after,
  :before {
    font-family: "NotoSans", "Poppins-Medium", "Poppins-Extra_Light", "Poppins-Regular", sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-size: var(--font-size-regular);

    @media screen and (max-width: 768px) {
      font-size: var(--font-size-small);
    }    
  }
  a {
    text-decoration: none; 
    outline: none;
  
    :hover, :active {
      text-decoration: none; 
    }
  }
  button {
    all: unset;
    cursor: pointer;
  }
  textarea {
    all: unset;
  }

  :root {
    --lineHeight-normal: 1;
    --font-size-regular: 16px;
    --font-size-small: 14px;
    --color-main-100: #777CFF;
    --color-main-75: #9296FF;
    --color-main-50: #CFD1FF;
    --color-main-25: #E3E4FF;
    --color-main-0: #F6F8FF;
    --color-destructive: #E04343;
    --color-black: #333333;
    --color-black-50: #5C5C60;
    --color-black-25:#8D8D8D;
    --color-gray-bg: #F8F8F8;
    --color-gray-bg-50: #FDFDFD;
    --color-gray-bg-100: #D3D3D3;
    --color-red: #FCD3D3;
    --color-pink: #FBB4EB;
    --color-orange: #FFD7D0;
    --color-yellow: #FDF4A1;
    --color-green: #D8F4D8;
    --color-aqua: #A4EDE9;
    --color-blue: #E2ECFC;
    --color-indigo: #5D639D;
    --color-purple: #E5DCFF;
  }
  `;

export default GlobalStyle;
