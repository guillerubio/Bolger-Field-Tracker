<!-- src/RegionInfo.svelte -->
<script>
  export let region;
  export let onClose = () => {};
  export let onDelete = () => {};
</script>

<div class="expanded-info">
  <h3>{region.name}</h3>
  <p>{region.details}</p>
  <button on:click={onClose}>Close</button>
  <button on:click={() => onDelete(region)} class="delete-btn">Delete</button>
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
  .delete-btn {
    background: red;
    color: white;
    margin-left: 10px;
  }
</style>
