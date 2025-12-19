import dayjs from "dayjs";
import type { CheckIn, Prisma } from "prisma/generated/client";
import type { CheckInsRepository } from "../check-ins-repository";

const QUANTITY_ITEMS_PER_PAGE = 20;
export class InMemoryCheckInsRepository implements CheckInsRepository {
	public checkIns: CheckIn[] = [];

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDay = dayjs(date).startOf("date");
		const endOfTheDay = dayjs(date).endOf("date");

		const checkInOnSameDate = this.checkIns.find((checkIn) => {
			const checkInDate = dayjs(checkIn.created_at);
			const isOnSameDate =
				checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

			return checkIn.user_id === userId && isOnSameDate;
		});

		if (!checkInOnSameDate) {
			return null;
		}

		return checkInOnSameDate;
	}

	async findManyByUserId(userId: string, page: number) {
		return this.checkIns
			.filter((checkIn) => checkIn.user_id === userId)
			.slice(
				(page - 1) * QUANTITY_ITEMS_PER_PAGE,
				page * QUANTITY_ITEMS_PER_PAGE,
			);
	}

	async findById(checkInId: string) {
		const checkIn = this.checkIns.find((checkIn) => checkIn.id === checkInId);

		if (!checkIn) return null;

		return checkIn;
	}

	async countByUserId(userId: string): Promise<number> {
		return this.checkIns.filter((checkIn) => checkIn.user_id === userId).length;
	}

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkin = {
			id: crypto.randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
			created_at: new Date(),
		};

		this.checkIns.push(checkin);

		return checkin;
	}

	async save(checkIn: CheckIn) {
		const checkInIndex = this.checkIns.findIndex(
			(item) => item.id === checkIn.id,
		);

		if (checkInIndex >= 0) {
			this.checkIns[checkInIndex] = checkIn;
		}

		return checkIn;
	}
}
