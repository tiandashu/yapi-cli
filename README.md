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

yapi config list 打印当前解析到的配置路径和内容
yapi config init 在当前目录生成 yapi.config.json 模板
yapi list（别名 yapi ls） 按分类列出接口；-p 指定项目；-c 按分类名过滤；--json 输出 JSON
yapi search <keyword>（别名 yapi s） 按标题/路径搜索；-p 多项目；--json
yapi get <idOrPath> 接口详情（联调用）；idOrPath 可为数字 id 或 path；-p 单项目；--full 带原始 schema；--json
yapi mock <idOrPath> 按响应 schema 生成 mock；-p；--json 带外层信封
yapi types <idOrPath> 生成 TS 类型；-p；--name 改类型基名
