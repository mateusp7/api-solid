import type { User } from "prisma/generated/client";
import type { UsersRepository } from "@/repositories/users-respository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserProfileUseCaseRequest {
	userId: string;
}

interface GetUserProfileUseCaseResponse {
	user: User;
}

export class GetUserProfileUserProfileUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId,
	}: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			throw new ResourceNotFoundError();
		}

		return {
			user,
		};
	}
}
