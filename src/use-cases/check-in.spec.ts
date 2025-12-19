import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CheckInUseCase } from "./check-in";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		await gymsRepository.create({
			id: "gym-01",
			title: "JavaScript Gym",
			description: "",
			phone: "",
			latitude: -20.15232,
			longitude: -40.2358272,
		});

		// Mockar tempo
		vi.useFakeTimers();
	});

	afterEach(() => {
		// Após todo teste, voltar os tempos reais
		vi.useRealTimers();
	});

	it("should be able to check in", async () => {
		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -20.15232,
			userLongitude: -40.2358272,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in twice in the same day", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -20.15232,
			userLongitude: -40.2358272,
		});

		await expect(() =>
			sut.execute({
				gymId: "gym-01",
				userId: "user-01",
				userLatitude: -20.15232,
				userLongitude: -40.2358272,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it("should be able to check in twice but in different days", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -20.15232,
			userLongitude: -40.2358272,
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -20.15232,
			userLongitude: -40.2358272,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check-in on distant gym", async () => {
		gymsRepository.items.push({
			id: "gym-02",
			description: "",
			phone: "",
			latitude: -20.2165583,
			longitude: -40.2808964,
			title: "JavaScript Gym",
		});

		await expect(() =>
			sut.execute({
				gymId: "gym-02",
				userId: "user-01",
				userLatitude: -20.15232,
				userLongitude: -40.2358272,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
