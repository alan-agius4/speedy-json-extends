# @speedy/json-extends
[![CircleCI](https://circleci.com/gh/alan-agius4/speedy-json-extends.svg?style=shield)](https://circleci.com/gh/alan-agius4/speedy-json-extends)
[![npm version](https://img.shields.io/npm/v/@speedy/json-extends.svg)](https://www.npmjs.com/package/@speedy/json-extends)
[![Dependency Status](https://img.shields.io/david/alan-agius4/speedy-json-extends.svg?style=flat-square)](https://david-dm.org/alan-agius4/speedy-json-extends)
[![devDependency Status](https://img.shields.io/david/dev/alan-agius4/speedy-json-extends.svg?style=flat-square)](https://david-dm.org/alan-agius4/speedy-json-extends?type=dev)

Extend a JSON file with one or many existing files.

### Installation

```core
npm install @speedy/json-extends --save
```


### Usage
#### json.read(filePath, [namedExtends]) ⇒ `Promise<T>`
Retrieve a JSON file. Supports `extends` with one or many existing JSON files.

Extends supports also Named Extends paths, as shown in the example.

| Param        | Type                      | Required | Description                              |
|--------------|---------------------------|----------|------------------------------------------|
| filePath     | `string`                  | true     | path to a JSON file.                     |
| namedExtends | `{[id: string]: string }` | false    | A key value pair of named extends paths  |

TypeScript
```ts
import { json } from "@speedy/json-extends";

const maps = {
  "@speedy/commit-msg-hook:latest": "./node_modules/config/config.json"
};

json.read("local-config.json", maps)
  .then(content => {
    // json content
  });
```

JSON file
```json
{
  "extends": [
    "@speedy/commit-msg-hook:latest",
    "./local/config.json"
  ],
  "rules": {
    "no-dash": true
  }
}
```

#### json.readSync(filePath, [namedExtends]) ⇒ `T`
Synchronous version of `json.read()`.

TypeScript
```ts
import { json } from "@speedy/json-extends";

const maps = {
  "@speedy/commit-msg-hook:latest": "./node_modules/config/config.json"
};

const content = json.readSync("local-config.json", maps);
```
