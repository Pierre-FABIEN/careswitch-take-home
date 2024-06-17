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
