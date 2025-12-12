import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUseCase } from "@/use-cases/register";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.email(),
		password: z.coerce.string().min(6),
	});

	const bodyResult = registerBodySchema.safeParse(request.body);

	if (!bodyResult.success) {
		return reply.status(400).send({
			message: "Invalid request body",
			errors: bodyResult.error.issues,
		});
	}

	const { name, email, password } = bodyResult.data;

	try {
		const prismaUsersRepository = new PrismaUsersRepository();
		const registerUseCase = new RegisterUseCase(prismaUsersRepository);
		await registerUseCase.execute({ name, email, password });
	} catch (error) {
		if (error instanceof UserAlreadyExistsError) {
			return reply.status(409).send({ message: error.message });
		}

		return reply.status(500).send();
	}

	return reply.status(201).send();
}
