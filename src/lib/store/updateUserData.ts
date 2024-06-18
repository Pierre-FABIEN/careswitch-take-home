import { writable } from 'svelte/store';

// Déclarer un store réactif pour les données utilisateur
export const updateUserData = writable(data.userUpdateSchema);
