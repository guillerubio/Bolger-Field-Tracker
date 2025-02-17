<script>
  import {
    regionsStore,
    addRegion,
    deleteRegion,
    updateRegion,
  } from "./regionsStore.js";
  import mapImage from "./assets/map-image.png";
  import RegionInfo from "./RegionInfo.svelte";
  import DraggablePolygon from "./DraggablePolygon.svelte";
  import { onDestroy } from "svelte";

  let selectedField = null;
  let hoverField = null;

  // Creation mode state for new fields
  let createMode = false;
  let newPoints = ""; // space-separated string of "x,y" pairs
  let newName = "";
  let newInfo = "";

  // Shape editing state for the selected field
  let shapeEditMode = false;
  let editedPoints = "";

  // Bind the map container for panel positioning.
  let mapContainer;

  // Subscribe to the regions store
  let fields = [];
  const unsubscribe = regionsStore.subscribe((val) => {
    fields = val;
  });
  onDestroy(() => {
    unsubscribe();
  });

  function handleHover(field) {
    hoverField = field;
  }

  function handleClickExisting(field, e) {
    if (createMode) return;
    e.stopPropagation();
    selectedField = field;
    shapeEditMode = false;
  }

  function startCreateMode() {
    createMode = true;
    newPoints = "";
    newName = "";
    newInfo = "";
    selectedField = null;
    shapeEditMode = false;
  }

  function handleMapClick(e) {
    // Only add new points if in creation mode and only when clicking directly on the SVG or IMAGE.
    if (!createMode) return;
    const tag = e.target.tagName.toLowerCase();
    if (tag !== "svg" && tag !== "image") {
      return;
    }
    const svgRect = e.currentTarget.getBoundingClientRect();
    const scaleX = 2648 / svgRect.width;
    const scaleY = 1582 / svgRect.height;
    const offsetX = e.clientX - svgRect.left;
    const offsetY = e.clientY - svgRect.top;
    const mapX = Math.round(offsetX * scaleX);
    const mapY = Math.round(offsetY * scaleY);
    newPoints = newPoints
      ? newPoints + " " + `${mapX},${mapY}`
      : `${mapX},${mapY}`;
  }

  function undoLastPoint() {
    if (!newPoints) return;
    const parts = newPoints.trim().split(" ");
    parts.pop();
    newPoints = parts.join(" ");
  }

  async function saveNewField() {
    if (!newName.trim() || newPoints.trim().split(" ").length < 3) {
      alert("Please provide a field name and at least 3 points.");
      return;
    }
    const newField = {
      name: newName.trim(),
      points: newPoints,
      info: newInfo.trim() || "Short info on hover",
      details: "Expanded details on click",
    };
    await addRegion(newField);
    createMode = false;
    newPoints = "";
    newName = "";
    newInfo = "";
  }

  function cancelCreateMode() {
    createMode = false;
    newPoints = "";
    newName = "";
    newInfo = "";
  }

  async function handleDelete(field) {
    await deleteRegion(field.id);
    selectedField = null;
  }

  async function handleUpdate(updatedField) {
    if (shapeEditMode) {
      updatedField.points = editedPoints;
      shapeEditMode = false;
    }
    await updateRegion(updatedField);
    selectedField = updatedField;
  }

  function closeFieldInfo() {
    selectedField = null;
    shapeEditMode = false;
  }

  // Trigger shape editing from RegionInfo's Edit button
  function startShapeEdit() {
    if (selectedField) {
      shapeEditMode = true;
      editedPoints = selectedField.points;
    }
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

  // Compute fixed panel style based on the selected field's container position.
  let panelStyle = "";
  $: if (selectedField && mapContainer) {
    const rect = mapContainer.getBoundingClientRect();
    const centroid = computeCentroid(selectedField.points);
    const scale = rect.width / 2648;
    const fieldX = centroid.x * scale;
    panelStyle =
      fieldX < rect.width / 2
        ? "position: fixed; top: 20px; right: 20px;"
        : "position: fixed; top: 20px; left: 20px;";
  } else {
    panelStyle = "";
  }
</script>

<!-- Top panel for controls -->
<div class="top-panel">
  {#if !createMode}
    <button on:click={startCreateMode}>Create Field</button>
  {/if}
  {#if createMode}
    <div class="create-field-panel">
      <h3>Creating a new field</h3>
      <label>
        Name:
        <input bind:value={newName} placeholder="Field name" />
      </label>
      <label>
        Info:
        <input bind:value={newInfo} placeholder="Short info" />
      </label>
      <div class="button-row">
        <button on:click={saveNewField}>Save Field</button>
        <button on:click={cancelCreateMode}>Cancel</button>
        <button on:click={undoLastPoint}>Undo Last Point</button>
      </div>
    </div>
  {/if}
</div>

<!-- Fixed RegionInfo panel outside the map -->
{#if selectedField && !createMode}
  <div class="region-info-fixed" style={panelStyle}>
    <RegionInfo
      region={selectedField}
      onClose={closeFieldInfo}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      onShapeEdit={startShapeEdit}
    />
  </div>
{/if}

<!-- Map container -->
<div
  class="map-container {createMode ? 'create-mode' : ''}"
  bind:this={mapContainer}
>
  <svg
    class="map-svg"
    viewBox="0 0 2648 1582"
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
    on:click={handleMapClick}
  >
    <image
      href={mapImage}
      x="0"
      y="0"
      width="2648"
      height="1582"
      draggable="false"
    />
    {#each fields as field}
      {#if selectedField && shapeEditMode && field.id === selectedField.id}
        <DraggablePolygon
          points={editedPoints}
          onChange={(newPts) => (editedPoints = newPts)}
        />
      {:else}
        <polygon
          points={field.points}
          class="region {createMode ? 'no-pointer' : ''}"
          on:mouseover={() => handleHover(field)}
          on:mouseout={() => (hoverField = null)}
          on:click={(e) => handleClickExisting(field, e)}
        />
        <text
          x={computeCentroid(field.points).x}
          y={computeCentroid(field.points).y}
          class="region-label"
        >
          {field.name}
        </text>
      {/if}
    {/each}
    {#if createMode && newPoints.trim().split(" ").length >= 2}
      <DraggablePolygon
        points={newPoints}
        onChange={(newPts) => (newPoints = newPts)}
      />
    {/if}
  </svg>
  {#if hoverField}
    <div class="hover-info">{hoverField.info}</div>
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
  .create-field-panel {
    background: white;
    color: black;
    padding: 1rem;
    border: 1px solid #999;
    border-radius: 4px;
    min-width: 220px;
  }
  .create-field-panel label {
    display: block;
    margin: 0.5rem 0;
  }
  .button-row {
    margin-top: 0.5rem;
    display: flex;
    gap: 0.5rem;
  }
  button {
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  .region-info-fixed {
    position: fixed;
    width: 300px;
    z-index: 1000;
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
