<script lang="ts" setup>

</script>

<template>
  <router-view />
</template>

<style>
html,
body {
  width: 100%;
  height: 100%;
  font-family:
    "Yuanti SC",
    "Noto Sans TC",
    "Hiragino Kaku Gothic Pro",
    "MS PGothic",
    Verdana,
    Helvetica,
    sans-serif;
}

@font-face {
  font-family: "Noto Sans TC";
  src: url("@/assets/font/NotoSansTC-VariableFont_wght.ttf") format("opentype");
}

#app {
  position: relative;
  width: 100%;
  height: 100vh;
}
</style>
