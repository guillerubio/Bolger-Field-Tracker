import { writable } from 'svelte/store';
import { supabase } from './supabaseClient';

// Create a writable store for regions
export const regionsStore = writable([]);

// Fetch regions from Supabase and update the store
async function fetchRegions() {
  const { data, error } = await supabase.from('regions').select('*');
  if (error) console.error('Error fetching regions:', error);
  else regionsStore.set(data);
}

// Fetch regions on load
fetchRegions();

// Add a new region to Supabase
export async function addRegion(newRegion) {
  const { data, error } = await supabase.from('regions').insert([newRegion]);
  if (error) console.error('Error adding region:', error);
  else await fetchRegions(); // Refresh the store
}

// Delete a region from Supabase by its id
export async function deleteRegion(regionId) {
  const { error } = await supabase.from('regions').delete().match({ id: regionId });
  if (error) console.error('Error deleting region:', error);
  else await fetchRegions(); // Refresh the store
}

// Update an existing region in Supabase
export async function updateRegion(updatedRegion) {
  const { error } = await supabase.from('regions').update(updatedRegion).match({ id: updatedRegion.id });
  if (error) console.error('Error updating region:', error);
  else await fetchRegions(); // Refresh the store
}
