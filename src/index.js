const path = require("path");
const fs = require("fs");
const os = require("os");
const { exec, spawn } = require("child_process");
const del = require("del");
const sourceDir = path.resolve();
const buildDir = path.resolve(sourceDir, ".npmPublishFlatten");
const [dirs, strip, args, keepResult] = parseArgs();

getFilesList().then(files => {
    copyFiles(files);
    updatePackageJson();
    publish().then(() => {
        if (!keepResult) {
            deleteBuildDir();
        }
    })
});

function getFilesList() {
    return new Promise(resolve => {
        exec("npm pack --dry-run", { cwd: sourceDir }, (error, stdout, stderr) => {
            if (error) {
                throw error;
            }
            const response = stderr;
            const lines = response.split("\n");
            const i1 = lines.findIndex(str => str.includes("Tarball Contents")) + 1;
            const i2 = lines.findIndex(str => str.includes("Tarball Details"));
            const filesStr = lines.slice(i1, i2);
            const res = filesStr.map(str => {
                const parts = str.split(" ").filter(Boolean);
                return parts[parts.length - 1];
            });
            resolve(res);
        });
    });
}

function copyFiles(files) {
    files.forEach(file => {
        const source = path.resolve(sourceDir, file);
        const destination = path.resolve(buildDir, flatten(file));
        const destDir = destination.substring(0, destination.lastIndexOf(path.sep));
        //Create dir if it doesnt exists.
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        //Copy file
        fs.copyFileSync(source, destination);
    });
}

function updatePackageJson() {
    const packageJsonPath = path.resolve(buildDir, "package.json");
    const json = require(packageJsonPath);
    //Flatten main to get correct path again.
    if (json.main) {
        json.main = flatten(json.main);
    }
    //Strip files so that all files in the build dir is included.
    delete json.files;
    //Strip user given paths
    strip.forEach(p => {
        delete json[p];
    });
    //Write updated file to build dir.
    fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(json, null, 4),
        error => {
            if (error) {
                throw error;
            }
        }
    );
}

function publish() {
    return new Promise(resolve => {
        const cmd = os.platform() === "win32" ? "npm.cmd" : "npm";
        const argv = ["publish"].concat(args);
        const proc = spawn(cmd, argv, { cwd: buildDir, stdio: "inherit" });
        proc.on("close", resolve);
        proc.on("error", error => {
            throw new Error(error);
        });
    });
}

function deleteBuildDir() {
    return del([buildDir]);
}

function flatten(path) {
    for (let i = 0; i < dirs.length; ++i) {
        if (path.startsWith(dirs[i])) {
            return path.replace(dirs[i], "");
        }
    }
    return path;
}

function parseArgs() {
    const dirs = [];
    const strip = [];
    const args = [];
    let keepResult = false;
    for (let i = 2; i < process.argv.length; ++i) {
        const arg = process.argv[i];
        const value = getValue(i + 1);
        if (arg === "--flatten") {
            if (value) {
                //Dirs need a trailing /
                dirs.push(value + (value.endsWith("/") ? "" : "/"));
                ++i;
            }
        }
        else if (arg === "--strip") {
            if (value) {
                strip.push(value);
                ++i;
            }
        }
        else if (arg === "--keepResult") {
            keepResult = true;
        }
        else {
            args.push(arg);
        }
    }
    //Sort dirs by longest path first.
    dirs.sort((a, b) => {
        return b.length - a.length;
    })
    return [dirs, strip, args, keepResult];
}

function getValue(i) {
    return process.argv[i] && !process.argv[i].startsWith("-")
        ? process.argv[i]
        : null;
}