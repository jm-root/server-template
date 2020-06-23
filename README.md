# 微服务器应用模板 server-template

基于jm-server建立业务服务, 通过例子帮助开发者快速了解jm模块的使用


## 项目目录

```
|--- config                          配置目录
|--- model                           数据模型定义
|--- packages                        包目录
    |--- consts                      常量定义目录
    |--- locale                      国际语言定义目录
    |--- decorate                    typeScript装饰器定义路由例子
    |--- hello                       简单例子
    |--- main                        引入orm快速定义CURD路由例子
    |--- utils                       通用工具库

```

## 环境变量

### jm-server

请参考 [jm-server](https://github.com/jm-root/server/tree/master/packages/jm-server)

### jm-server-jaeger

| 配置项               | 默认值         | 描述 |
| :---                 | :---:         | :--- |
|service_name          |"acl"          | 链路追踪登记的服务名称 |
|jaeger                |               |选填, 链路跟踪, 默认不开启, 如配置了链路地址将开启 |

### main

| 配置项               | 默认值         | 描述 |
| :---                 | :---:         | :--- |
|gateway               | []            | Gateway服务器Uri |
|orm_uri               | ''            | mysql数据库连接地址 |
