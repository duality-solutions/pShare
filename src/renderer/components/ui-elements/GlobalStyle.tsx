import { createGlobalStyle } from 'styled-components';

 const GlobalStyle = createGlobalStyle`
  body {
    background-color: white;
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');
    font-family: 'Open Sans', sans-serif;
    background: white;
    opacity:0.9;
    margin: 0; padding:0;

  }
  
  .fadeContainerIn-appear {
    opacity: 0.01;
  }
  
  .fadeContainerIn-appear.fadeContainerIn-appear-active {
    opacity: 1;
    transition: opacity .5s ease-in;
  }

  .fadeContainerIn-leave {
    opacity: 1;
  }
  
  .fadeContainerIn-leave.fadeContainerIn-leave-active {
    opacity: 0.01;
    transition: opacity .5s ease-in;
  }
  `

export default GlobalStyle
