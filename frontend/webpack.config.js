//npx webpack --env platform=app --env production
const { env } = require('process');
module.exports = (env) => {
    return require(`./webpack.${env.prod}.js`)
};