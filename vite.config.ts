import { fileURLToPath } from "node:url";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
	plugins: [tsconfigPaths()],
	resolve: {
		alias: {
			"@": srcPath,
		},
	},
});
