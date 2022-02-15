<template>
  <router-view/>
</template>

<style lang="scss">
 @import './assets/stylesheets/bulma.css';
 @import './assets/stylesheets/bulma.min.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
/*Bloque de ayuda hover para titulos */
abbr {
    position: relative;
    text-decoration: underline;
  }
  abbr:hover{
    cursor: help
  }
  abbr:hover::after {
    position: absolute;
    z-index:3;
    bottom: 42px;
    left: 100%;
    display: block;
    padding: 8px;
    background: #5C7380;
    color: white;
    border-radius: 3px;
    width: 150px;
    content: attr(title);
    text-align: center;
    font-style: normal;
    font-size: 13px;
    opacity: .85;
    box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, 0.25)
  }
.label-ayuda{
  display: inline-block;
  font-weight: bold;
}
/*Icono de ayuda hover para titulos */
#icono-ayuda{
  position: relative
}
#icono-ayuda:hover{
  cursor: help;
}
#icono-ayuda:hover:after{
  position: absolute;
  z-index:3;
  bottom: 42px;
  left: -100%;
  display: inline-block;
  padding: 8px;
  background: #5C7380;
  color: white;
  border-radius: 3px;
  width: 150px;
  content: attr(ayuda);
  text-align: center;
  font-style: normal;
  font-size: 13px;
  opacity: .85;
  box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, 0.25)
}
</style>
