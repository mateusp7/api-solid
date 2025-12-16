import type { Gym } from "prisma/generated/client";

export interface GymsRepository {
	findById(gymId: string): Promise<Gym | null>;
}
