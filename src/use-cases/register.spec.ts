import { compare } from "bcryptjs";
import { describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { RegisterUseCase } from "./register";

describe("Register Use Case", () => {
	it("should be able to register", async () => {
		const prismaUsersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(prismaUsersRepository);

		const { user } = await registerUseCase.execute({
			name: "John Doe",
			email: "johndoe@email.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("should hash user password upon registration", async () => {
		const prismaUsersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(prismaUsersRepository);

		const { user } = await registerUseCase.execute({
			name: "John Doe",
			email: "johndoe@email.com",
			password: "123456",
		});

		const isPasswordCorrecltyHashed = await compare(
			"123456",
			user.password_hash,
		);

		expect(isPasswordCorrecltyHashed).toBe(true);
	});

	it("should not be able to register users with same e-mail", async () => {
		const prismaUsersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(prismaUsersRepository);

		const email = "johndoe@gmail.com";

		await registerUseCase.execute({
			name: "John Doe",
			email,
			password: "123456",
		});

		await expect(() =>
			registerUseCase.execute({
				name: "John Doe",
				email,
				password: "123456",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
