import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";

describe("Nearby Gyms (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to list nearby gyms", async () => {
		const { token } = await createAndAuthenticateUser(app);

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Near Gym",
				description: null,
				phone: null,
				latitude: -20.15232,
				longitude: -40.2358272,
			});

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Far Gym",
				description: null,
				phone: null,
				latitude: -20.3365641,
				longitude: -40.3826864,
			});

		const searchGymsResponse = await request(app.server)
			.get("/gyms/nearby")
			.query({
				latitude: -20.15232,
				longitude: -40.2358272,
			})
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(searchGymsResponse.status).toEqual(200);
		expect(searchGymsResponse.body.gyms).toHaveLength(1);
		expect(searchGymsResponse.body.gyms).toEqual([
			expect.objectContaining({
				title: "Near Gym",
			}),
		]);
	});
});
