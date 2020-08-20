const path = require("path");

module.exports = (env, argv) => {
    return {
        entry: {
            "publish-flatten": path.resolve(__dirname, "src/index.js")
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: argv.mode === "production"
                ? "[name].min.js"
                : "[name].js",
            libraryTarget: "umd"
        },
        devtool: "source-map",
        externals : {
            path: "path",
            os: "os",
            fs: "fs",
            child_process: "exec, spawn"
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: ["@babel/preset-env"],
                            }
                        },
                        {
                            loader: "eslint-loader",
                            options: {
                                configFile: "./eslintrc.js"
                            }
                        }
                    ]
                }
            ]
        }
    };
};