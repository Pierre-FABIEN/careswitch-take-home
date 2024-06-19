// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		interface User {
			id: string;
			name: string;
			email: string;
			integer: number;
			isAdmin: boolean;
			floatval: number;
			birthday: string;
			workspaces: Workspace[];
		}

		interface UserInputData {
			name: string;
			email: string;
			integer: number;
			isAdmin: boolean;
			floatval: number;
			birthday: string;
			workspaces?: string[];
		}

		interface Workspace {
			id: string;
			name: string;
		}

		interface UserWorkspace {
			userId: string;
			workspaceId: string;
		}
	}
}

export {};
