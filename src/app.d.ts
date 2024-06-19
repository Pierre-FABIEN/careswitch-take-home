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
			users: User[];
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

		interface USerWithChecked {
			id: string;
			name: string;
			checked: boolean;
		}

		interface UserWorkspace {
			userId: string;
			workspaceId: string;
		}

		interface UserCreateSchema {
			name: string;
			email: string;
			integer: number;
			isAdmin: boolean;
			floatval: number;
			birthday: string;
			workspaces: string[];
		}

		interface UserDeleteSchema {
			id: string;
		}

		interface UserUpdateSchema {
			id: string;
			name: string;
			email: string;
			integer: number;
			isAdmin: boolean;
			floatval: number;
			birthday: string;
			workspaces: string[];
		}

		interface WorkspaceCreateSchema {
			name: string;
			users: string[];
		}

		interface WorkspaceDeleteSchema {
			id: string;
		}

		interface WorkspaceUpdateSchema {
			id: string;
			name: string;
			users: string[];
		}
	}
}

export {};
