import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
	try {
		const usersData = [
			{
				name: 'Alice',
				email: 'alice@example.com',
				integer: 25,
				isAdmin: true,
				floatval: 100.5,
				birthday: '1995-12-17T01:00:00+01:00'
			},
			{
				name: 'Bob',
				email: 'bob@example.com',
				integer: 30,
				isAdmin: false,
				floatval: 200.75,
				birthday: '1995-12-17T01:00:00+01:00'
			},
			// Ajoutez 13 autres utilisateurs ici
			{
				name: 'Charlie',
				email: 'charlie@example.com',
				integer: 28,
				isAdmin: false,
				floatval: 150.25,
				birthday: '1995-12-17T01:00:00+01:00'
			},
			{
				name: 'David',
				email: 'david@example.com',
				integer: 35,
				isAdmin: false,
				floatval: 300.4,
				birthday: '1995-12-17T01:00:00+01:00'
			},
			{
				name: 'Eve',
				email: 'eve@example.com',
				integer: 22,
				isAdmin: true,
				floatval: 120.75,
				birthday: '1995-12-17T01:00:00+01:00'
			},
			{
				name: 'Frank',
				email: 'frank@example.com',
				integer: 40,
				isAdmin: false,
				floatval: 350.5,
				birthday: '1995-12-17T01:00:00+01:00'
			},
			{
				name: 'Grace',
				email: 'grace@example.com',
				integer: 32,
				isAdmin: true,
				floatval: 400.65,
				birthday: '1995-12-17T01:00:00+01:00'
			},
			{
				name: 'Hank',
				email: 'hank@example.com',
				integer: 29,
				isAdmin: false,
				floatval: 250.8,
				birthday: '1995-12-17T01:00:00+01:00'
			},
			{
				name: 'Ivy',
				email: 'ivy@example.com',
				integer: 26,
				isAdmin: false,
				floatval: 130.95,
				birthday: '1995-12-17T01:00:00+01:00'
			},
			{
				name: 'Jack',
				email: 'jack@example.com',
				integer: 38,
				isAdmin: true,
				floatval: 500.1,
				birthday: '1995-12-17T01:00:00+01:00'
			},
			{
				name: 'Kim',
				email: 'kim@example.com',
				integer: 27,
				isAdmin: false,
				floatval: 220.25,
				birthday: '1995-12-17T01:00:00+01:00'
			},
			{
				name: 'Liam',
				email: 'liam@example.com',
				integer: 24,
				isAdmin: false,
				floatval: 330.4,
				birthday: '1995-12-17T01:00:00+01:00'
			},
			{
				name: 'Mia',
				email: 'mia@example.com',
				integer: 31,
				isAdmin: true,
				floatval: 140.55,
				birthday: '1995-12-17T01:00:00+01:00'
			},
			{
				name: 'Noah',
				email: 'noah@example.com',
				integer: 36,
				isAdmin: false,
				floatval: 410.7,
				birthday: '1995-12-17T01:00:00+01:00'
			},
			{
				name: 'Olivia',
				email: 'olivia@example.com',
				integer: 33,
				isAdmin: true,
				floatval: 160.85,
				birthday: '1995-12-17T01:00:00+01:00'
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
