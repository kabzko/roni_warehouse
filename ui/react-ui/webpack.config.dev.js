const path = require("path");

module.exports = {
    mode: "development",
    target: "web",
    devtool: "cheap-module-source-map",
    entry: path.resolve(__dirname, "./src/index.js"),
    output: {
        path: path.resolve(__dirname, "../static/js"),
        filename: "bundle.js"
    },
    devServer: {
        contentBase: path.resolve(__dirname, "./public"),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader", "eslint-loader"]
            },
            {
                test: /(\.css)$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"],
    },
    watch: true,
    watchOptions: {
        ignored: "**/node_modules",
        aggregateTimeout: 200,
        poll: 1000,
    },
};