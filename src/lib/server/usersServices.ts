import prisma from './db';

// Fetch all users along with their workspaces
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

// Create a new user
export async function createUser(data: App.UserInputData) {
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

// Update an existing user
export async function updateUser(data: App.UserInputData & { id: string }) {
	try {
		const { id, workspaces, ...userData } = data;

		if (workspaces && workspaces.length > 0) {
			const workspacesExist = await checkWorkspacesExist(workspaces);
			if (!workspacesExist) {
				throw new Error('One or more workspaces do not exist');
			}
		}

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

// Delete a user by ID
export async function deleteUser(userId: string) {
	try {
		await prisma.userWorkspace.deleteMany({
			where: { userId }
		});

		await prisma.user.delete({
			where: { id: userId }
		});
	} catch (error) {
		console.error('Error deleting user:', error);
		throw new Error('Could not delete user');
	}
}

// Check if the provided workspace IDs exist
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
