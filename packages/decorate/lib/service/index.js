"use strict";
const jm_server_1 = require("jm-server");
module.exports = class extends jm_server_1.Service {
    constructor(opts = {}, app) {
        super(opts);
        this.app = app;
        const { modules: { orm } } = this.app;
        this.orm = orm;
        this.emit('ready');
    }
    /**
     * 统一载入router目录下所有路由
     * @param opts
     */
    router(opts) {
        const dir = `${__dirname}/../router`;
        return this.loadRouter(dir, opts);
    }
};
