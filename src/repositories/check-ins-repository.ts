import type { CheckIn, Prisma } from "prisma/generated/client";

export interface CheckInsRepository {
	create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
	countByUserId(userId: string): Promise<number>;
	findById(checkInId: string): Promise<CheckIn | null>;
	findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
	findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
	save(checkIn: CheckIn): Promise<CheckIn>;
}
