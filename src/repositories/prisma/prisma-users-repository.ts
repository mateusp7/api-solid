import type { Prisma } from "prisma/generated/client";
import { prisma } from "@/infra/database/client";
import type { UsersRepository } from "../users-respository";

export class PrismaUsersRepository implements UsersRepository {
	async create(data: Prisma.UserCreateInput) {
		const user = await prisma.user.create({
			data,
		});

		return user;
	}
	async findByEmail(email: string) {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		return user;
	}
	async findById(id: string) {
		const user = await prisma.user.findUnique({
			where: {
				id,
			},
		});

		return user;
	}
}
