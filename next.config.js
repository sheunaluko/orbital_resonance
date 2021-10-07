

module.exports = {
    reactStrictMode: true,
    webpack: (config, options) => {
	config.experiments = {
            "topLevelAwait": true
	}
	return config
  },    
}
