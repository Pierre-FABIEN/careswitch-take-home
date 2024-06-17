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
