import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse } from "shared/dist";
import { auth } from "./routes/auth";

export const app = new Hono()

.use(cors())

.route("/auth", auth)

.get("/", (c) => {
	return c.text("Hello Hono!");
})

.get("/hello", async (c) => {
	const data: ApiResponse = {
		message: "Hello BHVR!",
		success: true,
	};

	return c.json(data, { status: 200 });
});

export default app;