# NPM publish flatten
Publish npm packages with flattened directory source

## Installation
`npm install publish-flatten  --save`

## Usage
`node node_modules/publish-flatten --flatten dist`    
In below examples I'm going to omitt the node_modules/ path for cleaner code.

If the original npm publish resulted in this:
```sh
$ npm publish

npm notice === Tarball Contents ===
npm notice 403B  package.json
npm notice 1.1kB LICENSE
npm notice 11B   README.md
npm notice 0     dist/index.js
npm notice 0     dist/sub/util.js
npm notice === Tarball Details ===
```

Then this is the result using `publish-flatten` and the dist directory is now flattened.
```sh
$ node publish-flatten --flatten dist

npm notice === Tarball Contents ===
npm notice 403B  package.json
npm notice 1.1kB LICENSE
npm notice 11B   README.md
npm notice 0     index.js
npm notice 0     sub/util.js
npm notice === Tarball Details ===
```

Multiple directories and sub directories can be flattened.
```sh
$ node publish-flatten --flatten dist --flatten dist/sub

npm notice === Tarball Contents ===
npm notice 403B  package.json
npm notice 1.1kB LICENSE
npm notice 11B   README.md
npm notice 0     index.js
npm notice 0     util.js
npm notice === Tarball Details ===
```
### Strip fields from package.json
Sometimes you have information in your package.json that you don't want to publish. These can be stripped using the `--strip` argument.

Removes scripts and devDependencies from package.json before publishing.    
`node publish-flatten --strip scripts --strip devDependencies`

### Keep result files
By default the modified files are stores in a temporary directory `.npmPublishFlatten` that is removed after process is done. By passing the `--keepResult` argument this directory is kept.
`node publish-flatten --flatten dist --keepResult`

### Additional arguments
All arguments that are not `--flatten`, `--strip`, or `--keepResult` is passed on to the underlying npm publish process. This means that you can still pass arguments to npm publish.    

Parameter `--dry-run` is passed on to npm publish    
`node publish-flatten --flatten dist --dry-run`


### Create npm script
An easy way to always get your build with correct flattened dirs is to create an script in package.json.
```json 
{
    "scripts": {
        "publishFlatten": "node node_modules/publish-flatten --flatten dist --strip scripts"
    }
}
```

This can then be called by: `npm run publishFlatten`    
Or with additional arguments: `npm run publishFlatten --dry-run`