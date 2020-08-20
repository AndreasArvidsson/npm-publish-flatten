# NPM publish flatten
Publish npm packages with flattened source directory

## Description
If you ever been annoyed by imports like the one below then this is the tool for you.
```js
import styles from "project/dist/styles"
```

It does the following:
1. Runs `npm pack --dry-run` to get a list of all files to publish
1. Copies all files to temporary directory `.npmPublishFlatten` with flattened paths
1. Updates `package.json` to correspond to the flattened structure
1. Strips fields from `package.json` (optional)
1. Publishes the content of the temporary directory to npm (optional)
1. Removes temporary directory (optional)

## Installation
`npm install publish-flatten  --save`

## Usage
`node node_modules/publish-flatten --flatten dist`    
In below examples I'm going to omitt the node_modules/ path for cleaner code.

### Default npm publish

#### Published directory structure
```
$ npm publish
.
├── package.json
├── README.md
└──  dist
    ├── index.js
    ├── index.js.map
    └── sub
        ├── util.js
        └── util.js.map
```

#### Import code
```js
import project from "project/dist"
import util from "project/dist/sub/util"
```

### publish-flatten
Multiple directories and sub directories can be flattened.

#### Published directory structure
```
$ node publish-flatten --flatten dist --flatten dist/sub
.
├── package.json
├── README.md
├── index.js
├── index.js.map
├── util.js
└── util.js.map  
```

#### Import code
```js
import project from "project"
import util from "project/util"
```

## Strip fields from package.json
Sometimes you have information in your package.json that you don't want to publish. These can be stripped using the `--strip` argument.

Removes scripts and devDependencies from package.json before publishing.    
`node publish-flatten --strip scripts --strip devDependencies`


## CLI arguments
```
  --flatten         Directory to be flattened. Can be repeated for additional directories.
  --strip           Field in package.json to strip/remove. Can be repeated for additional fields.
  --keepResult      Keep temporary directory with the published files.
```

### Additional arguments
All additional arguments are passed on to the underlying npm publish process. This means that you can still pass arguments to npm publish.    

Parameter `--dry-run` is passed on to npm publish.    
`node publish-flatten --flatten dist --dry-run`

## Create npm script
An easy way to always get your build with correct flattened dirs is to create an script in package.json.
```json 
{
    "scripts": {
        "pub": "node node_modules/publish-flatten --flatten dist --strip scripts"
    }
}
```

This can then be called by: `npm run pub`    
Or with additional arguments: `npm run pub -- --dry-run`