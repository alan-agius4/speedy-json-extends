import * as _ from "lodash";
import * as fs from "fs";

export namespace json {

	/**
	 * Retrieve a JSON file. Supports `extends` with one or many existing JSON files.
	 *
	 * @template T
	 * @param {string} filePath path to a JSON file.
	 * @param {{ [id: string]: string }} [namedExtends] A key value pair of maps for JSON files.
	 *
	 * @example
	 * import { json } from "@speedy/json-extends";
	 *
	 * const maps = {
	 * 	"@speedy/commit-msg-hook:latest": "./node_modules/config/config.json"
	 * };
	 *
	 * json.read("local-config.json", maps)
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
	 * Retrieve a JSON file Synchronously. Supports `extends` with one or many existing JSON files.
	 *
	 * @template T
	 * @param {string} filePath path to a JSON file.
	 * @param {{ [id: string]: string }} [namedExtends] A key value pair of maps for JSON files.
	 *
	 * @example
	 * import { json } from "@speedy/json-extends";
	 *
	 * const maps = {
	 * 	"@speedy/commit-msg-hook:latest": "./node_modules/config/config.json"
	 * };
	 *
	 * const content = json.readSync("local-config.json", maps);
	 *
	 * @returns {T}
	 */
	export function readSync<T>(filePath: string, namedExtends?: { [id: string]: string }): T {
		let content = JSON.parse(fs.readFileSync(filePath, "utf-8")) as T & { extends?: string | string[] };

		if (_.isEmpty(content.extends)) {
			return content;
		}

		const configExtends = _.castArray<string>(content.extends);

		for (let path of configExtends) {
			if (namedExtends) {
				const extendsKey = namedExtends[path];

				if (extendsKey) {
					path = extendsKey;
				}
			}

			content = _.merge({}, read(path, namedExtends), content);
		}

		return content;
	}
}