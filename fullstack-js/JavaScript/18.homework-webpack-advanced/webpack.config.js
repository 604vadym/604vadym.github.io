import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const __dirname = import.meta.dirname;

export default (env, argv) => {
    const isProduction = argv.mode === "production";

    return {
        context: path.resolve(__dirname, "src"),

        mode: argv.mode || "development",

        entry: {
            stat: "./statistics.js",
            main: "./index.js",
        },

        output: {
            path: path.resolve(__dirname, "dist"),
            filename: isProduction
                ? "js/[name].[contenthash].js"
                : "js/[name].js",
            clean: true,
        },

        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
                "@css": path.resolve(__dirname, "src/css"),
                "@assets": path.resolve(__dirname, "src/assets"),
            },
        },

        optimization: {
            minimize: isProduction,
            minimizer: [`...`, new CssMinimizerPlugin()],
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
            new HtmlWebpackPlugin({
                template: "./index.html",
                favicon: "./assets/favicon/favicon.png",
            }),
            ...(isProduction
                ? [
                      new MiniCssExtractPlugin({
                          filename: "css/[name].[contenthash].css",
                      }),
                  ]
                : []),
        ],

        devtool: isProduction ? "source-map" : "eval-cheap-module-source-map",
    };
};
