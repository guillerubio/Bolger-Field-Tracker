<script>
  import { regions } from "./regions.js";
  import mapImage from './assets/map-image.png';

  let selectedRegion = null;
  let hoverRegion = null;

  function handleHover(region) {
    hoverRegion = region;
  }

  function handleClick(region) {
    selectedRegion = region;
  }

  // Calculate the polygon's centroid using the area-weighted formula.
  function computeCentroid(pointsStr) {
    const points = pointsStr
      .trim()
      .split(" ")
      .map((pair) => pair.split(",").map(Number));
    let area = 0,
      cx = 0,
      cy = 0;
    const n = points.length;
    for (let i = 0; i < n; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[(i + 1) % n];
      const cross = x1 * y2 - x2 * y1;
      area += cross;
      cx += (x1 + x2) * cross;
      cy += (y1 + y2) * cross;
    }
    area = area / 2;
    cx = cx / (6 * area);
    cy = cy / (6 * area);
    return { x: cx, y: cy };
  }
</script>

<div class="map-container">
  <svg
  class="map-svg"
  viewBox="0 0 2648 1582"
  preserveAspectRatio="xMidYMid meet"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
>
    <!-- Map image -->
    <image href={mapImage} x="0" y="0" width="2648" height="1582" />



    <!-- Render each region as a polygon with an overlaid text label -->
    {#each regions as region}
      <polygon
        points={region.points}
        class="region"
        on:mouseover={() => handleHover(region)}
        on:mouseout={() => (hoverRegion = null)}
        on:click={() => handleClick(region)}
      />
      <text
        x={computeCentroid(region.points).x}
        y={computeCentroid(region.points).y}
        class="region-label"
      >
        {region.name}
      </text>
    {/each}
  </svg>

  {#if hoverRegion}
    <div
      class="hover-info"
      style="top: {hoverRegion.tooltipY}px; left: {hoverRegion.tooltipX}px"
    >
      {hoverRegion.info}
    </div>
  {/if}

  {#if selectedRegion}
    <div class="expanded-info">
      <h3>{selectedRegion.name}</h3>
      <p>{selectedRegion.details}</p>
      <button on:click={() => (selectedRegion = null)}>Close</button>
    </div>
  {/if}
</div>

<style>
  .map-container {
    position: relative;
    width: 90vw;
    max-width: 1200px;
    margin: 20px auto;
  }

  .map-svg {
    width: 100%;
    height: auto;
    display: block;
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

  .region-label {
    pointer-events: none;
    fill: #ffffff;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 24px;
    text-anchor: middle;
    dominant-baseline: middle;
    /* Add a subtle black stroke for contrast */
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

  .expanded-info {
    position: absolute;
    top: 20px;
    left: 20px;
    background: white;
    border: 1px solid black;
    padding: 10px;
    z-index: 10;
  }
</style>
