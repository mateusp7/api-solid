import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeCheckInsUseCase } from "@/use-cases/factories/make-check-ins-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((latitude) => Math.abs(latitude) <= 90),
    longitude: z.number().refine((longitude) => Math.abs(longitude) <= 180),
  });

  const { gymId } = createCheckInParamsSchema.parse(request.params);
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

  const makeCheckInUseCase = makeCheckInsUseCase();
  await makeCheckInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
}
