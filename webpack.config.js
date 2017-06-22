module.exports = {
    entry: {
        index: "./js/index.js"
    },
    output: {
        filename: "./dist/[name].bundle.js",
        chunkFilename: "./dist/[id].bundle.js"
    },
    // devtool: "#inline-source-map"
}
