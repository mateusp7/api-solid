import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { GetUserProfileUserProfileUseCase } from "./get-user-profile";

const email = "johndoe@email.com";
const password = "123456";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUserProfileUseCase;

describe("Get User Profile Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileUserProfileUseCase(usersRepository);
	});

	it("should be able to get user profile", async () => {
		const createdUser = await usersRepository.create({
			name: "John Doe",
			email,
			password_hash: await hash(password, 6),
		});

		const user = await sut.execute({ userId: createdUser.id });

		expect(user.user.id).toEqual(expect.any(String));
	});

	it("should not be able to get user profile with wrong id", async () => {
		await expect(() =>
			sut.execute({
				userId: "wrong-id",
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
