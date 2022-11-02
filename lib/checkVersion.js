/*
 * @Description:
 * @Version: 1.0
 * @Autor: codercao
 * @Date: 2022-11-01 20:14:54
 * @LastEditors: codercao
 * @LastEditTime: 2022-11-02 15:39:58
 */

const semver = require("semver");
const inquirer = require("inquirer");
const chalk = require("chalk");
const childProcess = require("child_process");
const axios = require("axios");
const pkg = require("../package.json");
const ora = require('ora');

async function getVersions() {
  const res = await getLatestVersion("caohq-cli", "latest");
  const { version } = res.data;
  return {
    latestVersion: version,
    nowVersion: pkg.version,
  };
}

async function updateCli() {
  return new Promise((resolve, reject) => {
    const spinner = ora("更新中");
    spinner.start();
    childProcess.exec(`npm update -g ${pkg.name}`, (err, stdout) => {
      if (err) {
        console.log(err);
        spinner.fail();
        reject(err);
      }
      console.log("更新日志:\n", chalk.green(stdout));
      spinner.text = "caohq-cli已更新最新版本！";
      spinner.succeed();
      resolve();
    });
  });
}

async function getLatestVersion(id, range = "") {
  const registry = "https://registry.npmmirror.com";
  return axios.get(
    `${registry}/${encodeURIComponent(id).replace(/^%40/, "@")}/${range}`
  );
}

async function checkVersion() {
  const { latestVersion, nowVersion } = await getVersions();
  console.log(latestVersion, nowVersion);
  if (semver.lt(nowVersion, latestVersion)) {
    inquirer
      .prompt([
        {
          name: "update",
          type: "confirm",
          message: "检测到caohq-cli有新版本， 是否更新到最新版本?",
        },
      ])
      .then((answers) => {
        if (answers["update"]) {
          updateCli();
        }
      })
      .catch((err) => {
        console.log(chalk.red(err));
      });
  }
}

module.exports = checkVersion;
