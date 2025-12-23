import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetUserProfileUserProfileUseCase } from "../get-user-profile";

export function makeGetUserProfileUseCase() {
	const prismaUsersRepository = new PrismaUsersRepository();
	const useCase = new GetUserProfileUserProfileUseCase(prismaUsersRepository);

	return useCase;
}
