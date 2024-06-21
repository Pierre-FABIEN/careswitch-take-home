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
			workspaces: Workspace[];
		}

		interface Workspace {
			id: string;
			name: string;
			users: User[];
		}

		interface UserInputData {
			name: string;
			email: string;
			workspaces: string[];
		}

		interface WorkspaceInputData {
			name: string;
			users: string[];
		}

		interface WorkspaceWithChecked {
			id: string;
			name: string;
			checked: boolean;
		}

		interface UserWithChecked {
			id: string;
			name: string;
			checked: boolean;
		}

		interface UserCreateSchema {
			name: string;
			email: string;
			workspaces: string[];
		}

		interface WorkspaceCreateSchema {
			name: string;
			users: string[];
		}

		interface UserUpdateSchema {
			id: string;
			name: string;
			email: string;
			workspaces: string[];
		}

		interface WorkspaceUpdateSchema {
			id: string;
			name: string;
			users: string[];
		}
	}
}

export {};
