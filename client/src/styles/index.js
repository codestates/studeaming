import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

const GlobalStyle = createGlobalStyle`
  ${normalize}
  
  @font-face {
    font-family: "NotoSans";
    src: url("../assets/fonts/NotoSansKR-Regular.woff") format("woff");
  }

  @font-face {
    font-family: "Poppins";
    src: url("../assets/fonts/Poppins-ExtraLight.woff")format("woff");
  }

  *,
  :after,
  :before {
    font-family: "NotoSans", "Poppins", sans-serif;
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

  :root {
    --lineHeight-normal: 1;
    --font-size-regular: 16px;
    --font-size-small: 14px;
    --color-main-100: #656BFF;
    --color-main-50: #DCE6FF;
    --color-main-25: #F6F8FF;
    --color-destructive: #E04343;
    --color-black: #333333;
    --color-black-50: #5C5C60;
    --color-black-25:#8D8D8D;
    --color-grey-bg: #f8f8f8;
    --color-red: #FFAEAE;
    --color-orange: #FFBE82;
    --color-green: #B4E29E;
    --color-blue: #A5C7E5;
    --color-puple: #B094FE;
  }
  `;

export default GlobalStyle;
