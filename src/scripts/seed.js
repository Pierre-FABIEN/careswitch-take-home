import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateHexColor() {
	let color = Math.floor(Math.random() * 16777215).toString(16);
	return '#' + color.padStart(6, '0'); // S'assurer que la chaîne fait toujours 6 caractères
}

async function seed() {
	try {
		const usersData = [
			{ name: 'Alice', email: 'alice@example.com' },
			{ name: 'Bob', email: 'bob@example.com' },
			{ name: 'Charlie', email: 'charlie@example.com' }
		];

		const workspacesData = [
			{ name: '1.Workspace' },
			{ name: '2.Workspace' },
			{ name: '3.Workspace' }
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
					data: {
						...userData,
						color: generateHexColor()
					}
				});
				createdUsers.push(user);
			}

			// Create workspaces
			const createdWorkspaces = [];

			for (const workspaceData of workspacesData) {
				const workspace = await txn.workspace.create({
					data: {
						...workspaceData,
						color: generateHexColor()
					}
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
	} catch (error) {
		console.error('Error seeding database:', error);
	} finally {
		await prisma.$disconnect();
	}
}

seed();
