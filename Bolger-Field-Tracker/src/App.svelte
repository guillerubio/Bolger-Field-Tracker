<script>
  export let name;
  import Map from "./Map.svelte";
</script>

<main>
  <h1>Haras de la Gesse Field Mapping</h1>
  <Map />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    font-size: 2em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
