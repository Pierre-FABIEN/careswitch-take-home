import type { PageServerLoad } from './$types';
import { getUsers } from '$server/db';

export const load: PageServerLoad = async () => {
	const users = await getUsers();
	return { users };
};
