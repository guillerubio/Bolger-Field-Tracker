<script>
  export let points = "";
  export let onChange = (newPoints) => {};
  export let onDragStart = () => {};
  export let onDragEnd = () => {};

  let vertices = [];
  $: vertices = points
    .trim()
    .split(" ")
    .map((pair) => pair.split(",").map(Number));

  function handlePointerDown(e, index) {
    e.preventDefault();
    e.stopPropagation();
    onDragStart(); // notify parent dragging started
    e.target.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startY = e.clientY;
    const origVertex = [...vertices[index]];

    function onPointerMove(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      vertices[index][0] = origVertex[0] + dx;
      vertices[index][1] = origVertex[1] + dy;
      const newPointsStr = vertices
        .map((pair) => `${Math.round(pair[0])},${Math.round(pair[1])}`)
        .join(" ");
      onChange(newPointsStr);
    }

    function onPointerUp(ev) {
      e.target.releasePointerCapture(ev.pointerId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      onDragEnd(); // notify parent dragging ended
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }
</script>

<polygon {points} class="draggable-polygon" />
{#each vertices as vertex, index}
  <circle
    cx={vertex[0]}
    cy={vertex[1]}
    r="10"
    class="draggable-handle"
    on:pointerdown={(e) => handlePointerDown(e, index)}
  />
{/each}

<style>
  .draggable-polygon {
    fill: rgba(0, 0, 255, 0.1); /* more transparent */
    stroke: blue;
    stroke-width: 2;
  }
  .draggable-handle {
    fill: rgba(255, 255, 0, 0.4);
    stroke: black;
    stroke-width: 1;
    cursor: move;
  }
</style>
