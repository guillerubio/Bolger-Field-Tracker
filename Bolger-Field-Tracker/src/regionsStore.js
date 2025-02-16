import { writable } from 'svelte/store';

const STORAGE_KEY = 'my-regions-data';

// Your default fallback data
const defaultRegions = [
  {
    id: "felix1",
    name: "Felix 1",
    points: "449,786 434,815 439,850 424,879 616,943 656,870 671,845 641,860 503,830",
    info: "Short info on hover",
    details: "Expanded details on click",
    tooltipX: 260,
    tooltipY: 220
  },
  {
    id: "felix2",
    name: "Felix 2",
    points: "301,721 266,805 340,854 390,869 404,829 429,815 444,780 404,760 360,726",
    info: "Short info on hover",
    details: "Expanded details on click",
    tooltipX: 260,
    tooltipY: 220
  },
  {
    id: "route1",
    name: "Route 1",
    points: "720,808 735,784 863,823 883,833 838,882",
    info: "Short info on hover",
    details: "Expanded details on click",
    tooltipX: 260,
    tooltipY: 220
  },
  {
    id: "route2",
    name: "Route 2",
    points: "695,679 819,743 897,792 878,827 730,777 651,738",
    info: "Short info on hover",
    details: "Expanded details on click",
    tooltipX: 260,
    tooltipY: 220
  },
  {
    id: "route3",
    name: "Route 3",
    points: "853,685 927,724 893,789 819,744 838,712",
    info: "Short info on hover",
    details: "Expanded details on click",
    tooltipX: 260,
    tooltipY: 220
  },
  {
    id: "route3b",
    name: "Route 3B",
    points: "976,638 907,584 853,687 927,727",
    info: "Short info on hover",
    details: "Expanded details on click",
    tooltipX: 260,
    tooltipY: 220
  },
  {
    id: "route4",
    name: "Route 4",
    points: "937,526 1016,555 976,634 907,580",
    info: "Short info on hover",
    details: "Expanded details on click",
    tooltipX: 260,
    tooltipY: 220
  },
  // New regions parsed from the provided coordinates:
  {
    id: "hangat1",
    name: "Hangat 1",
    points: "883,967 1139,1061 1139,1115 878,982",
    info: "Short info on hover",
    details: "Expanded details on click",
    tooltipX: 260,
    tooltipY: 220
  },
  {
    id: "hangat2",
    name: "Hangat 2",
    points: "1169,1014 888,955 883,965 1139,1058 1144,1034 1154,1024",
    info: "Short info on hover",
    details: "Expanded details on click",
    tooltipX: 260,
    tooltipY: 220
  },
  {
    id: "hangat3",
    name: "Hangat 3",
    points: "888,954 907,924 1095,924 1238,949 1218,984 1198,1008 1169,1013",
    info: "Short info on hover",
    details: "Expanded details on click",
    tooltipX: 260,
    tooltipY: 220
  },
  {
    id: "hangat4",
    name: "Hangat 4",
    points: "907,922 932,883 1124,853 1243,868 1248,883 1238,952 1095,922 986,922",
    info: "Short info on hover",
    details: "Expanded details on click",
    tooltipX: 260,
    tooltipY: 220
  },
  {
    id: "hangat5",
    name: "Hangat 5",
    points: "947,856 1001,831 1124,851 932,881",
    info: "Short info on hover",
    details: "Expanded details on click",
    tooltipX: 260,
    tooltipY: 220
  }
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
