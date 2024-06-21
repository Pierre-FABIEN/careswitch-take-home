import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
	try {
		const usersData = [
			{
				name: 'Alice',
				email: 'alice@example.com'
			},
			{
				name: 'Bob',
				email: 'bob@example.com'
			},
			// Ajoutez 13 autres utilisateurs ici
			{
				name: 'Charlie',
				email: 'charlie@example.com'
			},
			{
				name: 'David',
				email: 'david@example.com'
			},
			{
				name: 'Eve',
				email: 'eve@example.com'
			},
			{
				name: 'Frank',
				email: 'frank@example.com'
			},
			{
				name: 'Grace',
				email: 'grace@example.com'
			},
			{
				name: 'Hank',
				email: 'hank@example.com'
			},
			{
				name: 'Ivy',
				email: 'ivy@example.com'
			},
			{
				name: 'Jack',
				email: 'jack@example.com'
			},
			{
				name: 'Kim',
				email: 'kim@example.com'
			},
			{
				name: 'Liam',
				email: 'liam@example.com'
			},
			{
				name: 'Mia',
				email: 'mia@example.com'
			},
			{
				name: 'Noah',
				email: 'noah@example.com'
			},
			{
				name: 'Olivia',
				email: 'olivia@example.com'
			}
		];

		const workspacesData = [
			{ name: 'Workspace 1' },
			{ name: 'Workspace 2' },
			{ name: 'Workspace 3' },
			{ name: 'Workspace 4' },
			{ name: 'Workspace 5' }
		];

		const usersAndWorkspaces = await prisma.$transaction(async (txn) => {
			// Clear existing data
			await txn.userWorkspace.deleteMany();
			await txn.user.deleteMany();
			await txn.workspace.deleteMany();

			// Create users
			const createdUsers = [];

			for (const userData of usersData) {
				const user = await txn.user.create({
					data: userData
				});
				createdUsers.push(user);
			}

			// Create workspaces
			const createdWorkspaces = [];

			for (const workspaceData of workspacesData) {
				const workspace = await txn.workspace.create({
					data: workspaceData
				});
				createdWorkspaces.push(workspace);
			}

			// Associate all users with each workspace
			for (const workspace of createdWorkspaces) {
				for (const user of createdUsers) {
					await txn.userWorkspace.create({
						data: {
							userId: user.id,
							workspaceId: workspace.id
						}
					});
				}
			}

			return { users: createdUsers, workspaces: createdWorkspaces };
		});

		console.log(`Created users and workspaces: ${JSON.stringify(usersAndWorkspaces)}`);
	} catch (error) {
		console.error('Error seeding database:', error);
	} finally {
		await prisma.$disconnect();
	}
}

seed();
