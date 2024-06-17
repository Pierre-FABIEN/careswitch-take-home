import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
	try {
		const users = await prisma.$transaction(async (txn) => {
			await txn.user.deleteMany();
			await txn.workspace.deleteMany();

			const alice = await txn.user.create({
				data: {
					name: 'Alice',
					email: 'alice@example.com',
					integer: 25,
					isAdmin: true,
					floatval: 100.5,
					birthday: 'Sun Dec 17 1995 01:00:00 GMT+0100'
				}
			});

			const bob = await txn.user.create({
				data: {
					name: 'Bob',
					email: 'bob@example.com',
					integer: 30,
					isAdmin: false,
					floatval: 200.75,
					birthday: 'Wed May 23 1990 02:00:00 GMT+0200'
				}
			});

			const workspace = await txn.workspace.create({
				data: {
					name: 'Workspace 1',
					users: {
						create: [{ userId: alice.id }, { userId: bob.id }]
					}
				}
			});

			return { users: [alice, bob], workspace };
		});

		console.log(`Created users and workspace: ${JSON.stringify(users)}`);
	} catch (error) {
		console.error('Error seeding database:', error);
	} finally {
		await prisma.$disconnect();
	}
}

seed();
