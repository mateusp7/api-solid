import type { Gym } from "prisma/generated/client";
import type { GymsRepository } from "../gyms-repository";

export class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = [];

	async findById(gymId: string) {
		const gym = this.items.find((user) => user.id === gymId);

		return gym ?? null;
	}
}
