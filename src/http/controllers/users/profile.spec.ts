import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user";

describe("Authenticate (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to authenticate", async () => {
		const { token } = await createAndAuthenticateUser(app)

		const profileResponse = await request(app.server)
			.get("/me")
			.set("Authorization", `Bearer ${token}`);

		expect(profileResponse.status).toEqual(200);
		expect(profileResponse.body.user).toEqual(
			expect.objectContaining({
				email: "johndoe@example.com",
			}),
		);
	});
});
