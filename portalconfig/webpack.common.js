const webpack = require("webpack"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    path = require("path"),
    fse = require("fs-extra"),
    {VueLoaderPlugin} = require("vue-loader"),

    rootPath = path.resolve(__dirname, "../"),
    addonBasePath = path.resolve(rootPath, "addons"),
    addonConfigPath = path.resolve(addonBasePath, "addonsConf.json"),
    entryPoints = {masterportal: path.resolve(rootPath, "src/main.js")};

let addonEntryPoints = {};

if (!fse.existsSync(addonConfigPath)) {
    console.warn("NOTICE: " + addonConfigPath + " not found. Skipping all addons.");
}
else {
    addonEntryPoints = require(addonConfigPath);
}

module.exports = function () {
    const addonsRelPaths = {},
        vueAddonsRelPaths = {};

    for (const addonName in addonEntryPoints) {
        let isVueAddon = false,
            addonPath = addonName,
            entryPointFileName = "";

        if (typeof addonEntryPoints[addonName] === "string") {
            entryPointFileName = addonEntryPoints[addonName];
        }

        // An addon is recognized as Vue-Addon, if:
        // - its configuration value is an object
        // - with at least a key named "type"
        if (typeof addonEntryPoints[addonName] === "object" && addonEntryPoints[addonName].type !== undefined) {
            isVueAddon = true;

            if (typeof addonEntryPoints[addonName].entryPoint === "string") {
                entryPointFileName = addonEntryPoints[addonName].entryPoint;
            }
            else {
                entryPointFileName = "index.js";
            }

            if (typeof addonEntryPoints[addonName].path === "string") {
                addonPath = addonEntryPoints[addonName].path;
            }
        }

        const addonCombinedRelpath = [addonPath, entryPointFileName].join("/");

        // Now check if file exists
        if (!fse.existsSync(path.resolve(addonBasePath, addonCombinedRelpath))) {
            console.error("############\n------------");
            throw new Error("ERROR: FILE DOES NOT EXIST \"" + path.resolve(addonBasePath, addonCombinedRelpath) + "\"\nABORTED...");
        }

        if (isVueAddon) {
            vueAddonsRelPaths[addonName] = Object.assign({
                "entry": addonCombinedRelpath
            }, addonEntryPoints[addonName]);
        }
        else {
            addonsRelPaths[addonName] = addonCombinedRelpath;
        }

    }

    return {
        entry: entryPoints,
        stats: {
            all: false,
            colors: true,
            warnings: true,
            errors: true,
            errorDetails: true
            // comment in for detailed logging in console
            // logging: "verbose",
            // modules: true,
            // moduleTrace: true,
            // reasons: true,
            // performance: true,
            // timings: true,
            // entrypoints: true
        },
        output: {
            path: path.resolve(__dirname, "../build/"),
            filename: "js/[name].js",
            publicPath: "../../build/"
        },
        resolve: {
            alias: {
                text: "text-loader",
                "mixins": path.resolve(__dirname, "..", "src", "assets", "css", "mixins.scss"),
                "variables": path.resolve(__dirname, "..", "src", "assets", "css", "variables.scss")
            },
          modules: ["node_modules", "src"],  
          extensions: [".tsx", ".ts", ".js", ".mjs", ".scss", ".css"]
        },
        module: {
            unknownContextCritical: false,
            rules: [
                // ignore all files ending with ".test.js".
                {
                    test: /\.(test|spec)\.js$/,
                    use: {
                        loader: "null-loader"
                    }
                },
                // take all files ending with ".js" but not with ".test.js" or ".spec.js"
                {
                    test: /\.js$/,
                    exclude: /\.(test|spec)\.js$/,
                    use: {
                        loader: "esbuild-loader",
                        options: {
                            loader: "js",
                            target: "es2015",
                            format: "cjs",
                            platform: "node"
                        }
                    }
                },
                {
                    test: /\.[t]sx?$/,
                    use: {
                        loader: "esbuild-loader"
                    }
                },
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: "javascript/auto",
                  use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                            plugins: [
                                "@babel/plugin-proposal-nullish-coalescing-operator",
                                "@babel/plugin-proposal-optional-chaining"
                            ]
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {}
                        },
                        "css-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        "css-loader"
                    ]
                },
                {
                    test: /\.vue$/,
                    loader: "vue-loader"
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: [
                        {
                            loader: "file-loader"
                        }
                    ]
                },
                {
                    test: /\.worker\.js$/,
                    use: {
                        loader: "worker-loader"
                    }
                }
            ]
        },
        plugins: [
            // provide libraries globally
            new webpack.ProvidePlugin({
                i18next: ["i18next/dist/cjs/i18next.js"]
            }),
            // create css under build/
            new MiniCssExtractPlugin({
                filename: "css/[name].css"
            }),
            new VueLoaderPlugin(),
            // create global constant at compile time
            new webpack.DefinePlugin({
                ADDONS: JSON.stringify(addonsRelPaths),
                __VUE_OPTIONS_API__: true,
                __VUE_PROD_DEVTOOLS__: false,
                VUE_ADDONS: JSON.stringify(vueAddonsRelPaths)
            })
        ]
    };
};
