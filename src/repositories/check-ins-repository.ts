import type { CheckIn, Prisma } from "prisma/generated/client";

export interface CheckInsRepository {
	create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
	fyndManyByUserId(userId: string, page: number): Promise<CheckIn[]>
	findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
}
