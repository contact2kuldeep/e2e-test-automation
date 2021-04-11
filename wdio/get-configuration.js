require('ts-node/register');

const args = process.argv;
const argIndex = args.findIndex(_ => _.includes('--conf'));
const configArg = argIndex === -1 ? 'base' : args[argIndex + 1];

module.exports = require(`./${configArg}.conf.ts`);
