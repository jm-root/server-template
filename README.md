# 微服务器应用模板 server-template

基于jm-server建立业务服务, 通过例子帮助开发者快速了解jm模块的使用


## 项目目录

```
|--- config                          配置目录
|--- model                           数据模型定义
|--- spec                            Api接口文档例子 openapi 3.0
|--- tests                           启动服务器进行单元测试的例子，黑盒测试也可以在这里写
|--- packages                        包目录
    |--- consts                      常量定义目录
    |--- locale                      国际语言定义目录
    |--- decorate                    typeScript装饰器定义路由例子
    |--- hello                       简单例子
    |--- main                        引入orm快速定义CURD路由例子
    |--- main2                       引入orm快速定义CURD路由例子, 采用typeScript装饰器 
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

## tips

model 可以采用 sequelize-auto 从数据库逆向生成

```
node ./generateModel.js
```

或直接命令行

```
sequelize-auto -o "./model" -d main -h localhost -u root -x 123 -e mysql
```

