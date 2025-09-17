"use strict";
const jm_server_1 = require("jm-server");
// 类方式定义路由
class B {
    router() {
        const router = jm_server_1.ms.router();
        router.use((opts) => opts);
        return router;
    }
}
module.exports = B;
