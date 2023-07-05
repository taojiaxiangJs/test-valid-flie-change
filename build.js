const { execSync } = require('child_process')
const platform = process.argv[2]
const platformMap = {
  "UNI_PLATFORM=app-plus": "cross-env NODE_ENV=production UNI_PLATFORM=app-plus vue-cli-service uni-build",
  "UNI_PLATFORM=custom": "cross-env NODE_ENV=production uniapp-cli custom",
  "UNI_PLATFORM=h5": "cross-env NODE_ENV=production UNI_PLATFORM=h5 vue-cli-service uni-build",
  "UNI_PLATFORM=mp-360": "cross-env NODE_ENV=production UNI_PLATFORM=mp-360 vue-cli-service uni-build",
  "UNI_PLATFORM=mp-alipay": "cross-env NODE_ENV=production UNI_PLATFORM=mp-alipay vue-cli-service uni-build",
  "UNI_PLATFORM=mp-baidu": "cross-env NODE_ENV=production UNI_PLATFORM=mp-baidu vue-cli-service uni-build",
  "UNI_PLATFORM=mp-kuaishou": "cross-env NODE_ENV=production UNI_PLATFORM=mp-kuaishou vue-cli-service uni-build",
  "UNI_PLATFORM=mp-qq": "cross-env NODE_ENV=production UNI_PLATFORM=mp-qq vue-cli-service uni-build",
  "UNI_PLATFORM=mp-toutiao": "cross-env NODE_ENV=production UNI_PLATFORM=mp-toutiao vue-cli-service uni-build",
  "UNI_PLATFORM=mp-weixin": "cross-env NODE_ENV=production UNI_PLATFORM=mp-weixin vue-cli-service uni-build",
  "UNI_PLATFORM=quickapp-native": "cross-env NODE_ENV=production UNI_PLATFORM=quickapp-native vue-cli-service uni-build",
  "UNI_PLATFORM=quickapp-webview": "cross-env NODE_ENV=production UNI_PLATFORM=quickapp-webview vue-cli-service uni-build",
  "UNI_PLATFORM=quickapp-webview-huawei": "cross-env NODE_ENV=production UNI_PLATFORM=quickapp-webview-huawei vue-cli-service uni-build",
  "UNI_PLATFORM=quickapp-webview-union": "cross-env NODE_ENV=production UNI_PLATFORM=quickapp-webview-union vue-cli-service uni-build",
}
console.log()
console.warn('\x1B[33m%s\x1B[0m','提示：构建生产包前需要将本地已修改|新增|删除的文件更新至远程仓库！谢谢配合!!!')
console.log()
if(!Object.keys(platformMap).includes(platform)) {
  console.error('\x1B[45m%s\x1B[0m',`当前构建平台不存: ${platform}`)
  console.log()
  return
}
function getUnstagedFiles() {
  try {
    const output = execSync('git status --porcelain').toString()
    const lines = output.split('\n').map((line) => line.trim())
    return lines.map((e) => e && e.replace(' ', ': ')).filter(e=> e)
  } catch (error) {
    console.error('Error executing git command:', error.message)
    return []
  }
}

function getUnpushedBranches() {
  try {
    const output = execSync('git log --branches --not --remotes').toString()
    const lines = output.split('\n').map((line) => line.trim())
    const unpushedBranches = lines.filter((line) => line.startsWith('commit'))
    return unpushedBranches.map((branch) => branch.substring(7))
  } catch (error) {
    console.error('Error executing git command:', error.message)
    return []
  }
}

const unstagedFiles = getUnstagedFiles()

if (unstagedFiles.length > 0) {
  console.log('\x1B[41m%s\x1B[0m', '请将以下变更文件更新至远程仓库：')
  unstagedFiles.forEach((file) => console.log('\x1B[36m%s\x1B[0m', file))
}

const unpushedBranches = getUnpushedBranches()

if (unpushedBranches.length > 0) {
  console.log()
  console.log('\x1B[41m%s\x1B[0m', '请将以下 commit 更新至远程仓库：')
  unpushedBranches.forEach((branch, i) => console.log('\x1B[36m%s\x1B[0m', `${i} => ${branch}`))
  console.log()
}

if(!unpushedBranches.length && !unstagedFiles.length) {
  try {
    execSync(platformMap[platform], { stdio: 'inherit' })
  } catch (error) {
    console.error('打包失败：', error.message);
  }
}
