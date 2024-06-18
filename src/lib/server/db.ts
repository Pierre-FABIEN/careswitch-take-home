import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

// Function to get all users
export async function getUsers() {
	const users = await prisma.user.findMany();

	return users.map((user) => ({
		...user
	}));
}

export async function createUser(data: {
	name: string;
	email: string;
	integer: number;
	isAdmin: boolean;
	floatval: number;
	birthday: string;
}) {
	try {
		const user = await prisma.user.create({
			data
		});
		return user;
	} catch (error) {
		console.error('Error creating user:', error);
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

export async function updateUser(data: {
	id: string;
	name: string;
	email: string;
	integer: number;
	isAdmin: boolean;
	floatval: number;
	birthday: string;
}) {
	try {
		console.log('data from', data);
		const user = await prisma.user.update({
			where: { id: data.id },
			data: {
				name: data.name,
				email: data.email,
				integer: data.integer,
				isAdmin: data.isAdmin,
				floatval: data.floatval,
				birthday: data.birthday
			}
		});

		return user;
	} catch (error) {
		console.error('Error updating user:', error);
		throw error;
	}
}

// Function to get all workspaces
export async function getWorkspaces() {
	const workspaces = await prisma.workspace.findMany({
		include: { users: true }
	});

	return workspaces.map((workspace) => ({
		...workspace
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
