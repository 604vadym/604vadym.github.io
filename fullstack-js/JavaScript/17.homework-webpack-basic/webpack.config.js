import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
    const isProduction = argv.mode === "production";

    return {
        context: path.resolve(import.meta.dirname, "src"),

        mode: argv.mode || "development",

        entry: {
            stat: "./statistics.js",
            main: "./index.js",
        },

        output: {
            path: path.resolve(import.meta.dirname, "dist"),
            filename: isProduction ? "[name].[contenthash].js" : "[name].js",
            clean: true,
        },

        resolve: {
            alias: {
                "@": path.resolve(import.meta.dirname, "src"),
                "@css": path.resolve(import.meta.dirname, "src/css"),
                "@assets": path.resolve(import.meta.dirname, "src/assets"),
            },
        },

        optimization: {
            splitChunks: {
                chunks: "all",
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        enforce: true,
                    },
                },
            },
        },

        module: {
            rules: [
                {
                    test: /\.html$/i,
                    loader: "html-loader",
                },
                {
                    test: /\.css$/i,
                    use: [
                        isProduction
                            ? MiniCssExtractPlugin.loader
                            : "style-loader",
                        "css-loader",
                    ],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
                    type: "asset/resource",
                    generator: {
                        filename: isProduction
                            ? "images/[name].[contenthash][ext]"
                            : "images/[name][ext]",
                    },
                },
                {
                    test: /\.(ttf|woff|woff2|eot)$/i,
                    type: "asset/resource",
                    generator: {
                        filename: isProduction
                            ? "fonts/[name].[contenthash][ext]"
                            : "fonts/[name][ext]",
                    },
                },
            ],
        },

        devServer: {
            watchFiles: ["./**/*.html"],
            hot: true,
        },

        plugins: [
            new HtmlWebpackPlugin({ template: "./index.html" }),
            ...(isProduction
                ? [
                      new MiniCssExtractPlugin({
                          filename: "[name].[contenthash].css",
                      }),
                  ]
                : []),
        ],

        devtool: isProduction ? "source-map" : "eval-cheap-module-source-map",
    };
};
