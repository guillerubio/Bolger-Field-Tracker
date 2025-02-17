import { writable } from 'svelte/store';
import { supabase } from './supabaseClient';

export const regionsStore = writable([]);

// Fetch fields (regions) from Supabase
async function fetchRegions() {
  const { data, error } = await supabase.from('regions').select('*');
  if (error) console.error('Error fetching regions:', error);
  else regionsStore.set(data);
}
fetchRegions();

// Add a new field
export async function addRegion(newRegion) {
  const { error } = await supabase.from('regions').insert([newRegion]);
  if (error) console.error('Error adding region:', error);
  else await fetchRegions();
}

// Delete a field by its id
export async function deleteRegion(regionId) {
  const { error } = await supabase.from('regions').delete().match({ id: regionId });
  if (error) console.error('Error deleting region:', error);
  else await fetchRegions();
}

// Update an existing field
export async function updateRegion(updatedRegion) {
  const { error } = await supabase.from('regions').update(updatedRegion).match({ id: updatedRegion.id });
  if (error) console.error('Error updating region:', error);
  else await fetchRegions();
}
