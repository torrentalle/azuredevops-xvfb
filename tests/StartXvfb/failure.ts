"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var tmrm = require("azure-pipelines-task-lib/mock-run");
var path = require("path");
var taskPath = path.join(__dirname, '..','..', 'tasks', 'StartXvfb', 'index.js');
var tmr = new tmrm.TaskMockRunner(taskPath);
var a = {
    "which": {
        "/sbin/start-stop-daemon": "/sbin/start-stop-daemon"
    },
    "exec": {
        "/sbin/start-stop-daemon --start --background --make-pidfile --pidfile /tmp/custom_xvfb_99.pid --exec /usr/bin/Xvfb -- :99 -ac -screen 0 1280x1024x16": {
            "code": 1,
            "stdout": "",
            "stderr": ""
        },
        "/sbin/start-stop-daemon --status --pidfile /tmp/custom_xvfb_99.pid": {
            "code": 0,
            "stdout": "",
            "stderr": ""
        }
    }
};
tmr.setAnswers(a);
tmr.setInput('display', '99');
tmr.setInput('screen', '1280x1024x16');
tmr.run();
