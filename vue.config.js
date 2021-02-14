const path = require('path')

module.exports = {
	productionSourceMap: false,
	publicPath: process.env.NODE_ENV === 'production'
		? `/${path.basename(process.cwd())}/`
		: '/',
}
