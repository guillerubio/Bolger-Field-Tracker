import { writable } from 'svelte/store';

const STORAGE_KEY = 'my-regions-data';

// Your default fallback data
const defaultRegions = [
  {
    id: "felix1",
    name: "Felix 1",
    points: "449,786 434,815 439,850 424,879 616,943 656,870 671,845 641,860 503,830",
    info: "Short info on hover",
    details: "Expanded details on click"
  },
  {
    id: "felix2",
    name: "Felix 2",
    points: "301,721 266,805 340,854 390,869 404,829 429,815 444,780 404,760 360,726",
    info: "Short info on hover",
    details: "Expanded details on click"
  },
  {
    id: "route1",
    name: "Route 1",
    points: "720,808 735,784 863,823 883,833 838,882",
    info: "Short info on hover",
    details: "Expanded details on click"
  },
  // Add the rest of your fallback region objects...
];

// Load from local storage or return default
function loadFromStorage() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (json) {
    try {
      return JSON.parse(json);
    } catch (err) {
      console.error('Failed to parse regions from local storage:', err);
    }
  }
  return defaultRegions;
}

// Create the writable store with initial data
export const regionsStore = writable(loadFromStorage());

// Save to local storage whenever the store changes
regionsStore.subscribe((regions) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(regions));
});

// Convenience functions for adding / deleting
export function addRegion(newRegion) {
  regionsStore.update((all) => [...all, newRegion]);
}

export function deleteRegion(regionToDelete) {
  regionsStore.update((all) =>
    all.filter((r) => r.id !== regionToDelete.id)
  );
}
