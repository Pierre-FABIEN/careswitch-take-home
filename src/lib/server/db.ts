import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

// Function to get all users
export async function getUsers() {
	const users = await prisma.user.findMany({
		include: {
			workspaces: {
				include: {
					workspace: true
				}
			}
		}
	});

	return users.map((user) => ({
		...user,
		workspaces: user.workspaces.map((uw) => uw.workspace)
	}));
}

export async function createUser(data: {
	name: string;
	email: string;
	integer: number;
	isAdmin: boolean;
	floatval: number;
	birthday: string;
	workspaces?: string[]; // Array of workspace IDs
}) {
	try {
		const { workspaces, ...userData } = data;

		if (workspaces && workspaces.length > 0) {
			const workspacesExist = await checkWorkspacesExist(workspaces);
			if (!workspacesExist) {
				throw new Error('One or more workspaces do not exist');
			}
		}

		const user = await prisma.user.create({
			data: {
				...userData,
				workspaces: {
					create:
						workspaces?.map((workspaceId) => ({
							workspace: { connect: { id: workspaceId } }
						})) || []
				}
			}
		});

		return user;
	} catch (error) {
		console.error('Error creating user:', error);
		throw error;
	}
}

export async function updateUser(data: {
	id: string;
	name: string;
	email: string;
	integer: number;
	isAdmin: boolean;
	floatval: number;
	birthday: string;
	workspaces?: string[]; // Array of workspace IDs
}) {
	try {
		const { id, workspaces, ...userData } = data;

		// Update user data and manage workspace relations
		const user = await prisma.user.update({
			where: { id },
			data: {
				...userData,
				workspaces: {
					deleteMany: {},
					create:
						workspaces?.map((workspaceId) => ({
							workspace: { connect: { id: workspaceId } }
						})) || []
				}
			}
		});

		return user;
	} catch (error) {
		console.error('Error updating user:', error);
		throw error;
	}
}

export async function deleteUser(userId: string) {
	try {
		// Supprimer les enregistrements dans UserWorkspace associés à l'utilisateur
		await prisma.userWorkspace.deleteMany({
			where: { userId }
		});

		// Supprimer l'utilisateur
		await prisma.user.delete({
			where: { id: userId }
		});
	} catch (error) {
		console.error('Error deleting user:', error);
		throw new Error('Could not delete user');
	}
}

// Function to get all workspaces
export async function getWorkspaces() {
	const workspaces = await prisma.workspace.findMany({
		include: {
			users: {
				include: {
					user: true // Include the user details
				}
			}
		}
	});

	return workspaces.map((workspace) => ({
		...workspace,
		users: workspace.users.map((userWorkspace) => ({
			id: userWorkspace.user.id,
			name: userWorkspace.user.name
		}))
	}));
}

// Function to create a new workspace
export async function createWorkspace(data: { name: string }) {
	try {
		const workspace = await prisma.workspace.create({
			data
		});
		return workspace;
	} catch (error) {
		console.error('Error creating workspace:', error);
		throw error;
	}
}

// Function to delete a workspace by ID
export async function deleteWorkspace(id: string) {
	try {
		// Supprimer les enregistrements dans UserWorkspace associés au Workspace
		await prisma.userWorkspace.deleteMany({
			where: { workspaceId: id }
		});

		// Supprimer le Workspace
		await prisma.workspace.delete({
			where: { id }
		});
	} catch (error) {
		console.error('Error deleting workspace:', error);
		throw new Error('Could not delete workspace');
	}
}

// Function to update a workspace
export async function updateWorkspace(data: { id: string; name: string }) {
	try {
		const workspace = await prisma.workspace.update({
			where: { id: data.id },
			data: {
				name: data.name
			}
		});

		return workspace;
	} catch (error) {
		console.error('Error updating workspace:', error);
		throw error;
	}
}

async function checkWorkspacesExist(workspaceIds: string[]): Promise<boolean> {
	const existingWorkspaces = await prisma.workspace.findMany({
		where: {
			id: {
				in: workspaceIds
			}
		}
	});
	return existingWorkspaces.length === workspaceIds.length;
}
