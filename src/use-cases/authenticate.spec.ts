import { hash } from "bcryptjs";
import { describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

const email = "johndoe@email.com";
const password = "123456";

describe("Authenticate Use Case", () => {
	it("should be able to authenticate", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		await usersRepository.create({
			name: "John Doe",
			email,
			password_hash: await hash(password, 6),
		});

		const { user } = await sut.execute({
			email,
			password,
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("should not be able to authenticate with wrong email", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		await expect(() =>
			sut.execute({
				email,
				password,
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("should not be able to authenticate with wrong password", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		await usersRepository.create({
			name: "John Doe",
			email,
			password_hash: await hash(password, 6),
		});

		await expect(() =>
			sut.execute({
				email,
				password: "wrong-password",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
