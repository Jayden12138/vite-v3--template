<script setup lang="ts">
import { onMounted } from 'vue'
import { init } from './index'


onMounted(() => {
  init()
})
</script>

<template>
  <canvas width="500" hei height="500" id="oCanvas"></canvas>
</template>

<style scoped></style>
