import { writable } from 'svelte/store';

// Define the type for the form data
interface FormData {
	name: string;
	email: string;
	integer: string;
	floatval: string;
	birthday: string;
	workspaces: string[];
	isAdmin: boolean;
}

// Create the store with initial values
export const formData = writable<FormData>({
	name: '',
	email: '',
	integer: '',
	floatval: '',
	birthday: '',
	workspaces: [],
	isAdmin: false
});

// Subscribe to changes in the store and log the new values
formData.subscribe((value) => {
	console.log('Store formData updated:', value);
});
