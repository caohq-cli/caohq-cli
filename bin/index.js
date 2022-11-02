#!/usr/bin/env node
const program = require("commander");
// const checkVersion = myinquirer(require("../lib/checkVersion"));

const checkVersion = require("../lib/checkVersion");
const { name, version } = require("../package.json");
//const updateChk = require('../lib/update')

( async () => {
  try {
    await checkVersion();
  } catch (e) {
    console.log(e);
  }
})();

// 查看版本号
program.name(name).version(version).option("-v,--version", "查看版本号");

// 升级
program
  .command("create")
  .description("create a project")
  .action(() => {
    updateChk();
  });

program.parse(process.argv);
