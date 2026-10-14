<script setup lang="ts">
import { ref } from 'vue'

const name = ref('Ava Night')
const active = ref(true)
</script>

<template>
  <main :class="{ active }">
    <h1>Hello, {{ name }}</h1>
  </main>
</template>

<style scoped>
.active { color: #7FDBFF; }
</style>
