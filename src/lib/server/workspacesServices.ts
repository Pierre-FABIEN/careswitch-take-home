import prisma from './db';

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
