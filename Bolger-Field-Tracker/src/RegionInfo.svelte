<!-- src/RegionInfo.svelte -->
<script>
  export let region;
  export let onClose = () => {};
  export let onDelete = () => {};
  export let onUpdate = () => {};

  let editMode = false;
  // Create a local copy for editing
  let editedRegion = { ...region };

  // When the component receives a new region, update the local copy
  $: if (region) {
    editedRegion = { ...region };
  }

  function startEditing() {
    editMode = true;
  }

  async function saveChanges() {
    // Call onUpdate with the edited region
    await onUpdate(editedRegion);
    editMode = false;
  }

  function cancelEdit() {
    editMode = false;
    editedRegion = { ...region };
  }
</script>

{#if !editMode}
  <div class="expanded-info">
    <h3>{region.name}</h3>
    <p>{region.details}</p>
    <p>Status: {region.status}</p>
    <p>Comments: {region.comments}</p>
    <p>Use Date: {region.use_date}</p>
    <p>Separations: {region.separations}</p>
    <p>Management: {region.management_type}</p>
    <p>Hectares: {region.hectares}</p>
    <button on:click={onClose}>Close</button>
    <button on:click={startEditing}>Edit</button>
    <button on:click={() => onDelete(region)} class="delete-btn">Delete</button>
  </div>
{:else}
  <div class="expanded-info">
    <h3>Edit Region</h3>
    <label>
      Name:
      <input bind:value={editedRegion.name} />
    </label>
    <label>
      Details:
      <textarea bind:value={editedRegion.details}></textarea>
    </label>
    <label>
      Status:
      <select bind:value={editedRegion.status}>
        <option value="1">1 - Poor</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5 - Ready to use</option>
      </select>
    </label>
    <label>
      Comments:
      <textarea bind:value={editedRegion.comments}></textarea>
    </label>
    <label>
      Use Date:
      <input type="date" bind:value={editedRegion.use_date} />
    </label>
    <label>
      Separations:
      <input
        type="number"
        min="1"
        max="20"
        bind:value={editedRegion.separations}
      />
    </label>
    <label>
      Management:
      <select bind:value={editedRegion.management_type}>
        <option value="Exclusion">Exclusion</option>
        <option value="Rotation">Rotation</option>
      </select>
    </label>
    <label>
      Hectares:
      <input type="number" step="0.01" bind:value={editedRegion.hectares} />
    </label>
    <button on:click={saveChanges}>Save</button>
    <button on:click={cancelEdit} style="margin-left:10px;">Cancel</button>
  </div>
{/if}

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
  label {
    display: block;
    margin: 0.5rem 0;
  }
  input,
  textarea,
  select {
    width: 100%;
    box-sizing: border-box;
  }
</style>
