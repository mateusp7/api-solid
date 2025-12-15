import type { Prisma, User } from "prisma/generated/client";
import type { UsersRepository } from "../users-respository";

export class InMemoryUsersRepository implements UsersRepository {
	public users: User[] = [];

	async create(data: Prisma.UserCreateInput) {
		const user = {
			id: crypto.randomUUID(),
			name: data.name,
			email: data.email,
			created_at: new Date(),
			password_hash: data.password_hash,
		};

		this.users.push(user);

		return user;
	}
	async findByEmail(email: string) {
		const user = this.users.find((user) => user.email === email);

		return user ?? null;
	}

	async findById(id: string) {
		const user = this.users.find((user) => user.id === id);

		return user ?? null;
	}
}
