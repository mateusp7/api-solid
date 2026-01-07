import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";

describe("Search Gyms (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to search gyms", async () => {
		const { token } = await createAndAuthenticateUser(app, true);

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Javascript Gym",
				description: "Some description",
				phone: "123456789",
				latitude: -23.55052,
				longitude: -46.63332,
			});

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Typescript Gym",
				description: "Some description",
				phone: "123456777",
				latitude: -23.55052,
				longitude: -46.63332,
			});

		const searchGymsResponse = await request(app.server)
			.get("/gyms/search")
			.query({
				query: "Javascript",
			})
			.set("Authorization", `Bearer ${token}`);

		expect(searchGymsResponse.status).toEqual(200);
		expect(searchGymsResponse.body.gyms).toHaveLength(1);
		expect(searchGymsResponse.body.gyms).toEqual([
			expect.objectContaining({
				title: "Javascript Gym",
			}),
		]);
	});
});
