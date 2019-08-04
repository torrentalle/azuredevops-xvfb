"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var tmrm = require("azure-pipelines-task-lib/mock-run");
var path = require("path");
var taskPath = path.join(__dirname, '..','..', 'tasks', 'StartXvfb', 'index.js');
var tmr = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('display', '99');
tmr.setInput('screen', 'INVALID');
tmr.run();
