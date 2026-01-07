import type { FastifyReply, FastifyRequest } from "fastify";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
	await request.jwtVerify();

	const { role } = request.user;

	const token = await reply.jwtSign(
		{ role },
		{
			sign: {
				sub: request.user.sub,
			},
		},
	);

	const refreshToken = await reply.jwtSign(
		{ role },
		{
			sign: {
				sub: request.user.sub,
				expiresIn: "7d",
			},
		},
	);

	return reply
		.setCookie("refreshToken", refreshToken, {
			path: "/", // Quais rotas da nossa aplicação terão acesso ao cookie
			secure: true, // Se estamos utilizando HTTPs ou não
			sameSite: true, // Impede que o cookie seja enviado em requisições cross-site
			httpOnly: true, // Impede que o cookie seja acessado via JavaScript
		})
		.status(200)
		.send({ token });
}
