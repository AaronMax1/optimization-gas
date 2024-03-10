// lib/CreateGenerator.js
const ora = require('ora');     // Ora 在控制台显示当前加载状态的(下载5.x版本)
const inquirer = require('inquirer');   // 用户与命令行交互
const chalk = require('chalk');     // ‘粉笔’ 用于设置终端字体颜色的库(下载4.x版本)
const path = require('path');
const child_process = require('child_process');
const extra = require('fs-extra');  // fs-extra 是 node fs 的扩展
const log = ctx => console.log(chalk.green(ctx));
// 使用 ora 初始化，传入提示信息 message
const spinner = ora()

/**
     * 复制模板文件
     */
 copyTempl = async(dist)=> {
    let desPath = path.join(__dirname, '../template')
     await  extra.copy(desPath,dist);
}



/**
 * @wrapLoading 交互加载动画
 * @param {*} fn 在 wrapLoading 函数中执行的方法
 * @param {*} message 执行动画时的提示信息
 * @param  {...any} args 传递给 fn 方法的参数
 * @returns 
 */
async function wrapLoading( dist,message) {
    spinner.text = message.loadingMsg
    // 开始加载动画
    spinner.start()

    try {
        // 执行传入的方法 fn
        const result = await copyTempl(dist);
        // 动画修改为成功
        spinner.succeed(message.seccessfulMsg)
        return result
    } catch (error) {
        // 动画修改为失败
        spinner.fail(message.failedMsg + ': ', error)
    }
}

class CreateGenerator {
    constructor(name, targetDir) {
        // 目录名称
        this.name = name;
        // 创建位置
        this.targetDir = targetDir;
        /** 
         * 对 download-git-repo 进行 promise 化改造
         * 使用 child_process 的 execSync 方法拉取仓库模板
        */
        this.downloadGitRepo = child_process.execSync

    }

    /**
     * @download 下载远程模板
     */
    async download() {
        // 设置模板下载地址
        // const modelUrl = `https://github.com/AaronAbelx/hardhat-cli.git`

        // child_process.spawn 参数
        /**
         * @param masterBranch master分支
         */
        const masterBranch = "./template"

        // 调用动画加载效果，加载master分支
        await wrapLoading(
            this.targetDir,
            { loadingMsg: '加载hardhat-cli中...', seccessfulMsg: 'hardhat-cli加载成功', failedMsg: 'hardhat-cli加载失败' }
            // modelUrl,
            // path.resolve(process.cwd(), this.targetDir),

        )
    }

    // 核心创建逻辑
    async create() {
        // console.log(chalk.yellow(`name: ${this.name}`))
        // console.log(chalk.yellow(`targetDir: ${this.targetDir}`))
            log(this.targetDir)
        await this.download()
        log(`
        👌安装完成
        To get start
        ======================
          cd ${this.name}
          yarn
        ======================
      `)
        // 写环境变量文件（用在模板编译启动、打包时使用）
        extra.outputFileSync(path.resolve(this.targetDir, '.env'), `PROJECT = ${this.name}`)
    }
}

module.exports = CreateGenerator;