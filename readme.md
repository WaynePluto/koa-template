# koa 项目模板

## 1. 安装依赖

```bash
pnpm install
```

## 2. 增加开发环境变量, 修改数据库配置信息

1. 复制.env 文件 .env.dev，修改对应的的数据库连接信息, 增加 IS_DEV="true"
2. 修改 knexfile.js，修改对应的的数据库连接信息

## 3. 初始化数据库

```bash
pnpm run knex:up
```

## 4. 测试 template 表相关接口

```bash
pnpm run test
```

## 5. 运行服务

```bash
pnpm run dev
```
