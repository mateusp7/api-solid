import type { CheckIn, Prisma } from "prisma/generated/client";

export interface CheckInsRepository {
	create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
	findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
}
