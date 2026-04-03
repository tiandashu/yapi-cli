## yapi cli

- 支持 yapi 接口信息联调、mock数据、生成 ts 类型
- 支持 cli
- 支持 mcp
- 支持 skill
- 支持多 yapi 项目和多 yapi 空间，配置更方便

### 配置文件

[yapi.config.json](https://github.com/tiandashu/yapi-cli/blob/master/examples/yapi.config.example.json)

- baseUrl: 默认配置到根数据，也可以在单个 project 中覆盖设置
- projects：为了避免重复设置，支持了多项目配置
- activeProjectIds：只有在 activeProjectIds 中的 projectId 才会被 ai 查询，避免浪费资源

### cli

> 开发阶段调试：node dist/cli/index.js get -p 1635 119882 --json

- yapi config list 打印当前解析到的配置路径和内容
- yapi config init 在当前目录生成 yapi.config.json 模板
- yapi list（别名 yapi ls） 按分类列出接口；-p 指定项目；-c 按分类名过滤；--json 输出 JSON
- yapi search <keyword>（别名 yapi s） 按标题/路径搜索；-p 多项目；--json
- yapi get <idOrPath> 接口详情（联调用）；idOrPath 可为数字 id 或 path；-p 单项目；--full 带原始 schema；--json
- yapi mock <idOrPath> 按响应 schema 生成 mock；-p；--json 带外层信封
- yapi types <idOrPath> 生成 TS 类型；-p；--name 改类型基名

### mcp 配置

开发阶段：本地配置mcp.json

```json
//方式一
{
	"mcpServers": {
		"yapi": {
			"command": "node",
			"args": ["/absolute/path/to/yapi-cli/dist/mcp/index.js"]
		}
	}
}

//方式二
{
    "mcpServers": {
        "yapi2": {
            "command": "npm",
            "args": [
                "exec",
                "--prefix",
                "/absolute/path/to/yapi-cli",
                "--",
                "yapi-mcp"
            ]
        }
    }
}

```

生成阶段：使用 npm 配置

```json
// 方式一
{
	"mcpServers": {
		"yapi": {
			"command": "npx",
			"args": ["-y", "-p", "@vtian/yapi-cli", "yapi-mcp"]
		}
	}
}

// 方式二 使用了 fnm、nvm 等 node 管理器，子进程中可能没有初始化 node 环境导致报错，使用下面的配置
{
    "mcpServers": {
        "yapi-cli": {
            "command": "/bin/zsh",
            "args": [
                "-lic",
                "exec npx -y -p @vtian/yapi-cli yapi-mcp"
            ],
            "cwd": "${workspaceFolder}"
        }
    }
}
```

### skill 配置

`npm run build` 后只会生成一份 skill 产物：

- `dist/yapi-skills.zip`：可分发的 skill 压缩包

推荐按两步安装，和 CLI 分开发放。

**1. 安装 CLI**

```bash
npm install -g @vtian/yapi-cli
```

安装后应能直接执行：

```bash
yapi --help
```

**2. 安装 skill**

在任意目录执行：脚本会 **始终从 GitHub 下载** `dist/yapi-skills.zip` 并解压到当前目录下的 `.agents/skills/yapi-cli-skill`（需已安装 `curl`、`unzip`）。

```sh
curl -fsSL https://raw.githubusercontent.com/tiandashu/yapi-cli/refs/heads/master/scripts/install-skills.sh | sh
```

可选环境变量：`YAPI_AGENT_DIR`（默认 `.agents/skills`）、`YAPI_SKILLS_ZIP_URL`（覆盖 zip 的下载 URL，便于 fork 或镜像）。

### token 对比(待办)

- [ ] 对比 mcp 和 skill 两种调用方式对上下文的影响和 token 消耗

### 在 agent 中使用

- 和之前实现的`@vtian/yapi-mcp-server`在 agent 中用法一致
- https://juejin.cn/post/7526706420093075497
