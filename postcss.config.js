module.exports = {
    plugins: [
        require('autoprefixer')({
            overrideBrowserslist: ['last 1 versions', '>1%']
        })
    ]
}