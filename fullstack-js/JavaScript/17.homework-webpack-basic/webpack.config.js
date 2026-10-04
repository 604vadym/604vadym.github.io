import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
    const isProduction = argv.mode === "production";

    return {
        mode: argv.mode || "development",

        entry: {
            stat: "./src/statistics.js",
            main: "./src/index.js",
        },

        output: {
            path: path.resolve(import.meta.dirname, "dist"),
            filename: isProduction ? "[name].[contenthash].js" : "[name].js",
        },

        plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],

        devtool: isProduction ? "source-map" : "eval-cheap-module-source-map",
    };
};
