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
