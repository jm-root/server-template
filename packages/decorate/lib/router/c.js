"use strict";
const jm_server_1 = require("jm-server");
module.exports = function () {
    const router = jm_server_1.ms.router();
    router.use((opts) => opts);
    return router;
};
