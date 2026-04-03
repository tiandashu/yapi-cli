## yapi cli

- 支持 yapi 接口信息联调、mock数据、生成 ts 类型
- 支持 cli
- 支持 mcp
- 支持 skill

### start

```
npm run build
```

### 配置文件

[yapi.config.json](./examples/yapi.config.example.json)

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
{
	"mcpServers": {
		"yapi": {
			"command": "node",
			"args": ["/absolute/path/to/yapi-cli/dist/mcp/index.js"]
		}
	}
}


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
{
	"mcpServers": {
		"yapi": {
			"command": "npx",
			"args": ["-y", "-p", "@vtian/yapi-cli", "yapi-mcp"]
		}
	}
}
```

### skill 配置

Skill 给 **Cursor Agent** 用：说明见 `skills/yapi-cli-skill/SKILL.md`。Agent **只调 `yapi` CLI**（与 MCP 共用 `cli/public-api`），不再使用 `yapi-skill` 或 Python 包装脚本。

`npm run build` 后会生成两份 skill 产物：

- `dist/skills/yapi-cli-skill/`：解压后的 skill 目录
- `dist/yapi-skills.zip`：可分发的 skill 压缩包

推荐按两步安装，和 CLI 分开发放。

**1. 安装 CLI**

```bash
npm install -g /absolute/path/to/yapi-cli
```

安装后应能直接执行：

```bash
yapi --help
```

**2. 安装 skill**

安装到当前项目的 `.agents/skills/yapi-cli-skill`：

```bash
cd /absolute/path/to/yapi-cli
npm run build
npm run install:skills
```

也可以手动解压 `dist/yapi-skills.zip` 到任一 agent skills 目录，例如：

```bash
mkdir -p /path/to/project/.agents/skills/yapi-cli-skill
unzip -q /absolute/path/to/yapi-cli/dist/yapi-skills.zip -d /path/to/project/.agents/skills/yapi-cli-skill
```

在 Cursor 设置中启用 **Agent / Skills**，并确保会加载 `.agents/skills` 或对应平台的 skills 目录。

**3. 终端自检**（当前目录需能解析到 `yapi.config.json`）

```bash
yapi search test --json
```

**4. 业务仓库使用**

在业务仓库终端中使用 `yapi`，**工作目录**设为含 `yapi.config.json` 的项目根，例如：

```bash
yapi search login --json
yapi get 119882 -p 1635 --json
```

**5. Agent 常用命令**

- `yapi search <keyword> --json` — 搜索结果 JSON
- `yapi get <idOrPath> -p <id> --json` — 接口详情
- `yapi types <idOrPath> -p <id> --json` — 类型（JSON 信封）
- `yapi mock <idOrPath> -p <id> --json` — mock
- `yapi list -p <ids> --json` — 分类列表

### token 对比
