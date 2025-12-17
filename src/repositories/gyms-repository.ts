import type { Gym, Prisma } from "prisma/generated/client";

export interface GymsRepository {
	findById(gymId: string): Promise<Gym | null>;
	create(data: Prisma.GymCreateInput): Promise<Gym>;
}
