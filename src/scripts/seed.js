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
				birthday: 'Sun Dec 17 1995 01:00:00 GMT+0100'
			},
			{
				name: 'Bob',
				email: 'bob@example.com',
				integer: 30,
				isAdmin: false,
				floatval: 200.75,
				birthday: 'Wed May 23 1990 02:00:00 GMT+0200'
			},
			// Ajoutez 13 autres utilisateurs ici
			{
				name: 'Charlie',
				email: 'charlie@example.com',
				integer: 28,
				isAdmin: false,
				floatval: 150.25,
				birthday: 'Thu Jun 15 1992 03:00:00 GMT+0300'
			},
			{
				name: 'David',
				email: 'david@example.com',
				integer: 35,
				isAdmin: false,
				floatval: 300.4,
				birthday: 'Fri Apr 21 1989 04:00:00 GMT+0400'
			},
			{
				name: 'Eve',
				email: 'eve@example.com',
				integer: 22,
				isAdmin: true,
				floatval: 120.75,
				birthday: 'Sat Jul 20 1996 05:00:00 GMT+0500'
			},
			{
				name: 'Frank',
				email: 'frank@example.com',
				integer: 40,
				isAdmin: false,
				floatval: 350.5,
				birthday: 'Sun Aug 18 1985 06:00:00 GMT+0600'
			},
			{
				name: 'Grace',
				email: 'grace@example.com',
				integer: 32,
				isAdmin: true,
				floatval: 400.65,
				birthday: 'Mon Sep 17 1988 07:00:00 GMT+0700'
			},
			{
				name: 'Hank',
				email: 'hank@example.com',
				integer: 29,
				isAdmin: false,
				floatval: 250.8,
				birthday: 'Tue Oct 16 1991 08:00:00 GMT+0800'
			},
			{
				name: 'Ivy',
				email: 'ivy@example.com',
				integer: 26,
				isAdmin: false,
				floatval: 130.95,
				birthday: 'Wed Nov 15 1993 09:00:00 GMT+0900'
			},
			{
				name: 'Jack',
				email: 'jack@example.com',
				integer: 38,
				isAdmin: true,
				floatval: 500.1,
				birthday: 'Thu Dec 14 1986 10:00:00 GMT+1000'
			},
			{
				name: 'Kim',
				email: 'kim@example.com',
				integer: 27,
				isAdmin: false,
				floatval: 220.25,
				birthday: 'Fri Jan 13 1994 11:00:00 GMT+1100'
			},
			{
				name: 'Liam',
				email: 'liam@example.com',
				integer: 24,
				isAdmin: false,
				floatval: 330.4,
				birthday: 'Sat Feb 12 1997 12:00:00 GMT+1200'
			},
			{
				name: 'Mia',
				email: 'mia@example.com',
				integer: 31,
				isAdmin: true,
				floatval: 140.55,
				birthday: 'Sun Mar 11 1993 13:00:00 GMT+1300'
			},
			{
				name: 'Noah',
				email: 'noah@example.com',
				integer: 36,
				isAdmin: false,
				floatval: 410.7,
				birthday: 'Mon Apr 10 1987 14:00:00 GMT+1400'
			},
			{
				name: 'Olivia',
				email: 'olivia@example.com',
				integer: 33,
				isAdmin: true,
				floatval: 160.85,
				birthday: 'Tue May 09 1990 15:00:00 GMT+1500'
			}
		];

		const users = await prisma.$transaction(async (txn) => {
			await txn.user.deleteMany();
			await txn.workspace.deleteMany();

			const createdUsers = [];

			for (const userData of usersData) {
				const user = await txn.user.create({
					data: userData
				});
				createdUsers.push(user);
			}

			const workspace = await txn.workspace.create({
				data: {
					name: 'Workspace 1',
					users: {
						create: createdUsers.map((user) => ({ userId: user.id }))
					}
				}
			});

			return { users: createdUsers, workspace };
		});

		console.log(`Created users and workspace: ${JSON.stringify(users)}`);
	} catch (error) {
		console.error('Error seeding database:', error);
	} finally {
		await prisma.$disconnect();
	}
}

seed();
