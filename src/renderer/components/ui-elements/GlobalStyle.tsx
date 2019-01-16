import { createGlobalStyle } from 'styled-components'

 const GlobalStyle = createGlobalStyle`
  body {
    background-color: white;
    /* @font-face {
      font-family: 'Open Sans', sans-serif;
      src: url('https://fonts.googleapis.com/css?family=Open+Sans');
    } */
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');
    font-family: 'Open Sans', sans-serif;
    }
  `

export default GlobalStyle
