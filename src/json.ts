import * as _ from "lodash";
import * as fs from "fs";

export namespace json {

	/**
	 * Retrieve a JSON file asynchronous. Supports `extends` with one or many existing JSON files.
	 *
	 * @template T
	 * @param {string} filePath path to a JSON file.
	 * @param {{ [id: string]: string }} [namedExtends] A key value pair of named extends paths.
	 *
	 * @example
	 * import { json } from "@speedy/json-extends";
	 *
	 * const named = {
	 * 	"@speedy/commit-msg-hook:latest": "./node_modules/config/config.json"
	 * };
	 *
	 * json.read("local-config.json", named)
	 * 	.then(content => {
	 * 		// json content
	 * 	});
	 *
	 * @returns {Promise<T>}
	 */
	export async function read<T>(filePath: string, namedExtends?: { [id: string]: string }): Promise<T> {
		return readSync<T>(filePath, namedExtends);
	}

	/**
	 * Retrieve a JSON file synchronously. Supports `extends` with one or many existing JSON files.
	 *
	 * @template T
	 * @param {string} filePath path to a JSON file.
	 * @param {{ [id: string]: string }} [namedExtends] A key value pair of named extends paths.
	 *
	 * @example
	 * import { json } from "@speedy/json-extends";
	 *
	 * const named = {
	 * 	"@speedy/commit-msg-hook:latest": "./node_modules/config/config.json"
	 * };
	 *
	 * const content = json.readSync("local-config.json", named);
	 *
	 * @returns {T}
	 */
	export function readSync<T>(filePath: string, namedExtends?: { [id: string]: string }): T {
		let content = JSON.parse(fs.readFileSync(filePath, "utf-8")) as T & { extends?: string | string[] };

		if (_.isEmpty(content.extends)) {
			return content;
		}

		for (let path of _.castArray<string>(content.extends)) {
			if (namedExtends) {
				const extendsValue = namedExtends[path];

				if (extendsValue) {
					path = extendsValue;
				}
			}

			content = _.merge({}, readSync(path, namedExtends), content);
		}

		return content;
	}
}