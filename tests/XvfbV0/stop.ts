import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', '..', 'tasks', 'XvfbV0', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

let a: ma.TaskLibAnswers = <ma.TaskLibAnswers> {
    "exec": {
        "/sbin/start-stop-daemon --stop --oknodo --remove-pidfile --pidfile /tmp/start-stop-daemon_0.pid": {
            "code": 0,
            "stdout": "",
            "stderr": ""
        }
    }
};
tmr.setAnswers(a)

tmr.setInput('action', 'stop');
tmr.setInput('exportDisplay', 'true');

tmr.run();