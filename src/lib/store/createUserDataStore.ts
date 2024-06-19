// createUserDataStore.ts
import { writable } from 'svelte/store';

export const createUserData = writable({
	name: '',
	email: '',
	integer: '',
	floatval: '',
	birthday: '',
	workspaces: [],
	isAdmin: false
});
