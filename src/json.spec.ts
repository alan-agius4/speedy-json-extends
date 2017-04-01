import * as mockFs from "mock-fs";

import { json } from "./json";

describe("jsonSpec", () => {
	describe(json.read.name, () => {
		const MAIN_FILE = {
			extends: [
				"./config/primary-extend.json"
			],
			rules: {
				message: {
					maxLength: 100,
					minLength: 2
				}
			}
		};

		const MAIN_FILE_WITH_ALIAS = {
			extends: [
				"primary-extend"
			],
			rules: {
				message: {
					maxLength: 100,
					minLength: 2
				}
			}
		};

		const PRIMARY_EXTEND_FILE = {
			extends: "./config/secondary-extend.json",
			rules: {
				message: {
					minLength: 1,
					noDashes: true
				}
			}
		};

		const SECONDARY_EXTEND_FILE = {
			rules: {
				message: {
					minLength: 4,
					noWhiteSpace: true
				}
			}
		};

		const THIRD_EXTEND_FILE = {
			rules: {
				message: {
					minLength: 40
				}
			}
		};

		const MULTIPLE_EXTEND_FILE = {
			extends: [
				"./config/secondary-extend.json",
				"./config/third-extend.json"
			],
			rules: {
				message: {
					noWhiteSpace: true
				}
			}
		};

		beforeEach(() => {
			mockFs({
				"speedy-commit-msg-hook.json": JSON.stringify(MAIN_FILE),
				"speedy-commit-msg-hook-alias.json": JSON.stringify(MAIN_FILE_WITH_ALIAS),
				"multiple-extends.json": JSON.stringify(MULTIPLE_EXTEND_FILE),
				config: {
					"third-extend.json": JSON.stringify(THIRD_EXTEND_FILE),
					"primary-extend.json": JSON.stringify(PRIMARY_EXTEND_FILE),
					"secondary-extend.json": JSON.stringify(SECONDARY_EXTEND_FILE)
				}
			});
		});

		afterEach(() => {
			mockFs.restore();
		});

		it("should merge values of extended files ordered by per position in array", async done => {
			const result = await json.read<any>("multiple-extends.json");
			expect(result.rules.message.minLength).toBe(40);
			expect(result.rules.message.noWhiteSpace).toBe(true);
			done();
		});

		it("should merge object with named extends", async done => {
			const result = await json.read<any>("speedy-commit-msg-hook-alias.json", {
				"primary-extend": "./config/primary-extend.json"
			});
			expect(result.rules.message.maxLength).toBe(100);
			expect(result.rules.message.noDashes).toBe(true);
			done();
		});

		it("should merge object of extended file", async done => {
			const result = await json.read<any>("speedy-commit-msg-hook.json");
			expect(result.rules.message.maxLength).toBe(100);
			expect(result.rules.message.noDashes).toBe(true);
			done();
		});

		it("should override same properties", async done => {
			const result = await json.read<any>("speedy-commit-msg-hook.json");
			expect(result.rules.message.minLength).toBe(2);
			done();
		});

		it("should merge properties of nested extended file", async done => {
			const result = await json.read<any>("speedy-commit-msg-hook.json");
			expect(result.rules.message.noDashes).toBe(true);
			expect(result.rules.message.minLength).toBe(2);
			expect(result.rules.message.noWhiteSpace).toBe(true);
			done();
		});
	});
});