import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

const GlobalStyle = createGlobalStyle`
  ${normalize}
  
  *,
  :after,
  :before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-size: 14px;
  }
  `;

export default GlobalStyle;
