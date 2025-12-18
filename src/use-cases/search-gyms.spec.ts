import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
			title: "JavaScript Gym",
			description: null,
			phone: null,
			latitude: -20.15232,
			longitude: -40.2358272,
		});

    await gymsRepository.create({
			title: "Typescript Gym",
			description: null,
			phone: null,
			latitude: -20.15232,
			longitude: -40.2358272,
		});

    const { gyms } = await sut.execute({
      query: "JavaScript Gym",
      page: 1
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym" }),
    ]);
  });

  it("should be able to fetch paginated gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Typescript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -20.15232,
        longitude: -40.2358272,
      });
    }

    const { gyms } = await sut.execute({
      query: 'Typescript',
      page: 2
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Typescript Gym 21' }),
      expect.objectContaining({ title: "Typescript Gym 22" }),
    ]);
  });
});
