import prisma from './db';

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
	workspaces?: string[];
}) {
	try {
		const { id, workspaces, ...userData } = data;

		// Vérifier si les workspaces existent
		if (workspaces && workspaces.length > 0) {
			const workspacesExist = await checkWorkspacesExist(workspaces);
			if (!workspacesExist) {
				throw new Error('One or more workspaces do not exist');
			}
		}

		// Mettre à jour les données de l'utilisateur et gérer les relations avec les workspaces
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
