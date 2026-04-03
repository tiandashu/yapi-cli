## yapi cli

### start

```
npm run build
```

### 配置文件

yapi.config.json

- baseUrl: 默认配置到根数据，也可以在单个 project 中覆盖设置
- projects：为了避免重复设置，支持了多项目配置
- activeProjectIds：只有在 activeProjectIds 中的 projectId 才会被 ai 查询，避免浪费资源

```json
{
	"baseUrl": "https://your-yapi.example.com",
	"projects": [
		{
			"projectId": "1437",
			"projectName": "NPC Tasks",
			"token": "replace-with-your-token"
		},
		{
			"projectId": "1269",
			"projectName": "Admin Backend",
			"token": "replace-with-your-token"
		},
		{
			"projectId": "1635",
			"projectName": "Camp Backend",
			"token": "replace-with-your-token",
			"baseUrl": "https://your-yapi.example.com"
		}
	],
	"activeProjectIds": ["1437", "1635"]
}
```

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

本地配置mcp.json

```json
{
	"mcpServers": {
		"yapi": {
			"command": "node",
			"args": ["/absolute/path/to/yapi-cli/dist/mcp/index.js"]
		}
	}
}
```

通过 npm 全局安装后，可把 `args` 里的脚本路径换成包提供的入口（视安装方式调整）：

```bash
npm install -g /absolute/path/to/yapi-cli
# mcp.json 中可使用 "command": "yapi-mcp" 且 "args": []（若 Cursor 支持无参 command）
```

### skill 配置

Skill 给 **Cursor Agent** 用：说明见 `skills/yapi-cli-skill/SKILL.md`。Agent **只调 `yapi` CLI**（与 MCP 共用 `cli/public-api`），不再使用 `yapi-skill` 或 Python 包装脚本。`npm run build` 后会把 `SKILL.md` 与 `references/` 复制到 `dist/skills/yapi-cli-skill/`，便于随包分发。

**1. 安装到 Cursor（本仓库）**

```bash
cd /absolute/path/to/yapi-cli
mkdir -p .cursor/skills
ln -sf "$(pwd)/skills/yapi-cli-skill" .cursor/skills/yapi-cli-skill
```

在 Cursor 设置中启用 **Agent / Skills**，并确保会加载 `.cursor/skills`。

**2. 构建**

```bash
npm run build
```

**3. 终端自检**（当前目录需能解析到 `yapi.config.json`）

```bash
node dist/cli/index.js search test --json
```

**4. 业务仓库使用**

在业务仓库终端中指定 yapi-cli 的 `dist/cli/index.js`（或将 `yapi` 安装到 PATH），**工作目录**设为含 `yapi.config.json` 的项目根，例如：

```bash
node /absolute/path/to/yapi-cli/dist/cli/index.js search login --json
node /absolute/path/to/yapi-cli/dist/cli/index.js get 119882 -p 1635 --json
```

**5. Agent 常用命令**

- `yapi search <keyword> --json` — 搜索结果 JSON  
- `yapi get <idOrPath> -p <id> --json` — 接口详情  
- `yapi types <idOrPath> -p <id> --json` — 类型（JSON 信封）  
- `yapi mock <idOrPath> -p <id> --json` — mock  
- `yapi list -p <ids> --json` — 分类列表

### token 对比
