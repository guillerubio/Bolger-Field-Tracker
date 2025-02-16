<script>
  // The region we display
  export let region = null;

  // Called when user closes the panel
  export let onClose = () => {};

  // Called when user wants to delete the region
  export let onDelete = () => {};
</script>

<div class="expanded-info">
  <h3>{region.name}</h3>
  <p>{region.details}</p>

  <button on:click={onClose}>Close</button>
  <button on:click={() => onDelete(region)} style="margin-left:10px;"
    >Delete</button
  >
</div>

<style>
  .expanded-info {
    position: absolute;
    top: 20px;
    left: 20px;
    background: white;
    border: 1px solid black;
    padding: 10px;
    z-index: 10;
    color: black;
  }
</style>
