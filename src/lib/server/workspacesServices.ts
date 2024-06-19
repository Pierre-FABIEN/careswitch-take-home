import prisma from './db';

// Fetch all workspaces along with their users
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

// Create a new workspace
export async function createWorkspace(data: App.WorkspaceInputData) {
	try {
		const workspace = await prisma.workspace.create({
			data: {
				name: data.name,
				users: {
					create: data.users.map((userId) => ({
						user: { connect: { id: userId } }
					}))
				}
			}
		});
		return workspace;
	} catch (error) {
		console.error('Error creating workspace:', error);
		throw error;
	}
}

// Delete a workspace by ID
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

// Update an existing workspace
export async function updateWorkspace(data: App.WorkspaceInputData & { id: string }) {
	try {
		const workspace = await prisma.workspace.update({
			where: { id: data.id },
			data: {
				name: data.name,
				users: {
					deleteMany: {}, // Clear existing users
					create: data.users.map((userId) => ({
						user: { connect: { id: userId } }
					}))
				}
			}
		});

		return workspace;
	} catch (error) {
		console.error('Error updating workspace:', error);
		throw error;
	}
}
