import type { Gym, Prisma } from "prisma/generated/client";

export interface GymsRepository {
	findById(gymId: string): Promise<Gym | null>;
	searchMany(query: string, page: number): Promise<Gym[]>
	create(data: Prisma.GymCreateInput): Promise<Gym>;
}
