<script lang="ts">
  let name: string = 'Ava Night'
  let active: boolean = true
</script>
<svelte:head><title>{name}</title></svelte:head>
<main class:active><h1>Hello, {name}</h1></main>
<style>.active { color: #7FDBFF; }</style>
