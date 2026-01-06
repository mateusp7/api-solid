import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";

describe("Create Gym (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to create gym", async () => {
		const { token } = await createAndAuthenticateUser(app);

		const createGymResponse = await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Gym 1",
				description: "Gym 1 description",
				phone: "123456789",
				latitude: -23.55052,
				longitude: -46.63332,
			});

		expect(createGymResponse.status).toEqual(201);
	});
});
