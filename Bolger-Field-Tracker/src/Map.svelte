<!-- src/Map.svelte -->
<script>
  import {
    regionsStore,
    addRegion,
    deleteRegion,
    updateRegion,
  } from "./regionsStore.js";
  import mapImage from "./assets/map-image.png";
  import RegionInfo from "./RegionInfo.svelte";
  import { onDestroy } from "svelte";

  let selectedRegion = null;
  let hoverRegion = null;

  // Creation mode state
  let createMode = false;
  let newPoints = [];
  let newName = "";
  let newInfo = "";
  // Note: extra fields will be added during editing, not during creation

  // Subscribe to the regions store
  let regions = [];
  const unsubscribe = regionsStore.subscribe((val) => {
    regions = val;
  });
  onDestroy(() => unsubscribe());

  function handleHover(region) {
    hoverRegion = region;
  }

  function handleClickExisting(region, e) {
    if (createMode) return;
    e.stopPropagation();
    selectedRegion = region;
  }

  function startCreateMode() {
    createMode = true;
    newPoints = [];
    newName = "";
    newInfo = "";
    selectedRegion = null;
  }

  function handleMapClick(e) {
    if (!createMode) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const scaleX = 2648 / svgRect.width;
    const scaleY = 1582 / svgRect.height;
    const offsetX = e.clientX - svgRect.left;
    const offsetY = e.clientY - svgRect.top;
    const mapX = Math.round(offsetX * scaleX);
    const mapY = Math.round(offsetY * scaleY);
    newPoints = [...newPoints, `${mapX},${mapY}`];
  }

  async function saveNewRegion() {
    if (!newName.trim() || newPoints.length < 3) {
      alert("Please provide a region name and at least 3 points.");
      return;
    }
    // In creation mode we only gather basic data:
    const newRegion = {
      name: newName.trim(),
      points: newPoints.join(" "),
      info: newInfo.trim() || "Short info on hover",
      details: "Expanded details on click",
      // Extra fields (status, comments, etc.) can be added later via editing
    };
    await addRegion(newRegion);
    createMode = false;
    newPoints = [];
    newName = "";
    newInfo = "";
  }

  function cancelCreateMode() {
    createMode = false;
    newPoints = [];
    newName = "";
    newInfo = "";
  }

  async function handleDelete(region) {
    await deleteRegion(region.id);
    selectedRegion = null;
  }

  // This function is passed to RegionInfo to update an edited region
  async function handleUpdate(updatedRegion) {
    await updateRegion(updatedRegion);
    selectedRegion = updatedRegion;
  }

  function closeRegionInfo() {
    selectedRegion = null;
  }

  function computeCentroid(pointsStr) {
    const points = pointsStr
      .trim()
      .split(" ")
      .map((pair) => pair.split(",").map(Number));
    let area = 0,
      cx = 0,
      cy = 0;
    for (let i = 0; i < points.length; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[(i + 1) % points.length];
      const cross = x1 * y2 - x2 * y1;
      area += cross;
      cx += (x1 + x2) * cross;
      cy += (y1 + y2) * cross;
    }
    area /= 2;
    cx /= 6 * area;
    cy /= 6 * area;
    return { x: cx, y: cy };
  }
</script>

<!-- Top panel for region creation controls -->
<div class="top-panel">
  {#if !createMode}
    <button on:click={startCreateMode}>Create Region</button>
  {/if}

  {#if createMode}
    <div class="create-region-panel">
      <h3>Creating a new region</h3>
      <label>
        Name:
        <input bind:value={newName} placeholder="Region name" />
      </label>
      <label>
        Info:
        <input bind:value={newInfo} placeholder="Short info" />
      </label>
      <button on:click={saveNewRegion}>Save Region</button>
      <button on:click={cancelCreateMode} style="margin-left:10px;"
        >Cancel</button
      >
    </div>
  {/if}
</div>

<!-- Map container -->
<div class="map-container {createMode ? 'create-mode' : ''}">
  <svg
    class="map-svg"
    viewBox="0 0 2648 1582"
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
    on:click={handleMapClick}
  >
    <image href={mapImage} x="0" y="0" width="2648" height="1582" />
    {#each regions as region}
      <polygon
        points={region.points}
        class="region {createMode ? 'no-pointer' : ''}"
        on:mouseover={() => handleHover(region)}
        on:mouseout={() => (hoverRegion = null)}
        on:click={(e) => handleClickExisting(region, e)}
      />
      <text
        x={computeCentroid(region.points).x}
        y={computeCentroid(region.points).y}
        class="region-label"
      >
        {region.name}
      </text>
    {/each}
    {#if createMode && newPoints.length >= 2}
      <polygon points={newPoints.join(" ")} class="new-region-preview" />
    {/if}
  </svg>

  {#if hoverRegion}
    <div class="hover-info">{hoverRegion.info}</div>
  {/if}

  {#if selectedRegion}
    <RegionInfo
      region={selectedRegion}
      onClose={closeRegionInfo}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
    />
  {/if}
</div>

<style>
  .top-panel {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  .create-region-panel {
    background: white;
    color: black;
    padding: 1rem;
    border: 1px solid #999;
    border-radius: 4px;
    min-width: 220px;
  }
  .create-region-panel label {
    display: block;
    margin: 0.5rem 0;
  }
  button {
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  .map-container {
    position: relative;
    width: 100%;
    max-width: 1200px;
    margin: 80px auto 20px;
    text-align: center;
  }
  .map-container.create-mode {
    cursor: crosshair;
  }
  .map-svg {
    display: inline-block;
    width: 100%;
    height: auto;
    background: #ddd;
  }
  .region {
    fill: rgba(255, 255, 255, 0.3);
    stroke: red;
    stroke-width: 2;
    cursor: pointer;
  }
  .region:hover {
    fill: rgba(255, 0, 0, 0.6);
  }
  .region.no-pointer {
    pointer-events: none;
  }
  .new-region-preview {
    fill: rgba(0, 255, 0, 0.3);
    stroke: green;
    stroke-width: 2;
    pointer-events: none;
  }
  .region-label {
    pointer-events: none;
    fill: #fff;
    text-anchor: middle;
    dominant-baseline: middle;
    stroke: black;
    stroke-width: 1;
  }
  .hover-info {
    position: absolute;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px;
    font-size: 12px;
    pointer-events: none;
  }
</style>
