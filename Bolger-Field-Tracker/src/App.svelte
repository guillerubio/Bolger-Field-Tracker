<script>
  export let name;
  import Map from "./Map.svelte";
</script>

<main>
  <h1>Haras de la Gesse Field Mapping</h1>
  <Map />
</main>



<style global>
  /* Fluid main container that centers content */
  main {
    width: 100%;
    max-width: 1000px; /* Optional: set a generous max-width */
    margin: 0 auto;
    padding: 1em;
    box-sizing: border-box;
    text-align: center;
  }
  
  h1 {
    color: #ff3e00;
    font-size: 2em;        /* Base size for small screens */
    font-weight: 100;
    margin-bottom: 1em;
  }
  
  @media (min-width: 640px) {
    h1 {
      font-size: 2.5em;
    }
  }
</style>


