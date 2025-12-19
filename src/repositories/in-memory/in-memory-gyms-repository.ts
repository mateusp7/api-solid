import { Decimal } from "@prisma/client/runtime/client";
import type { Gym, Prisma } from "prisma/generated/client";
import type { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

const QUANTITY_ITEMS_PER_PAGE = 20;
const MAX_RADIUS_DISTANCE_IN_KILOMETERS = 10
export class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = [];

	async findById(gymId: string) {
		const gym = this.items.find((user) => user.id === gymId);

		return gym ?? null;
	}

	async findManyNearby(params: FindManyNearbyParams) {
		return this.items.filter((gym) => {
			const distance = getDistanceBetweenCoordinates(
				{ latitude: gym.latitude, longitude: gym.longitude },
				{ latitude: params.latitude, longitude: gym.longitude }
			)

			return distance < MAX_RADIUS_DISTANCE_IN_KILOMETERS
		})
	}

	async searchMany(query: string, page: number) {
		return this.items
			.filter((gym) => gym.title.includes(query))
			.slice(
        (page - 1) * QUANTITY_ITEMS_PER_PAGE,
        page * QUANTITY_ITEMS_PER_PAGE
      );
	}

	async create(data: Prisma.GymCreateInput) {
		const gym = {
			id: data?.id ?? crypto.randomUUID(),
			title: data.title,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: new Decimal(data.latitude.toString()),
			longitude: new Decimal(data.longitude.toString()),
			created_at: new Date(),
		};

		this.items.push(gym);

		return gym;
	}
}
