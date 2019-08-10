import tl = require('azure-pipelines-task-lib/task');
import { XvfbConfig } from './config';
import { Daemon } from './daemon';
import { isNull } from 'util';

var debugArgs = process.argv.slice(2);

async function run() {

    try {

        var xvfbConfig: XvfbConfig = new XvfbConfig();              
        xvfbConfig.resolution = tl.getInput('screenSize', false);
        xvfbConfig.display = tl.getBoolInput('exportDisplay') ? 0: parseInt(tl.getInput('display', false));

        let action = debugArgs.length > 0 ? debugArgs[0]: tl.getInput('action', false);
        let actionResult;
        switch (action) {
            case  'start': {
                actionResult = await startDaemon(xvfbConfig);
                break;
            }
            case  'stop': {
                actionResult = await stopDaemon(xvfbConfig);
                break;
            }
            default: {
                tl.setResult(tl.TaskResult.Failed, 'Invalid action');    
            }
            console.log('Xvfb daemon ' + action + ': ' + actionResult );
        }
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

async function startDaemon(config: XvfbConfig) {

    console.log('Starting Xvfb daemon');
    
    var daemon = createDaemon(config);
    let result:boolean = await daemon.start()
    
    if (! result ) {
        tl.setResult(tl.TaskResult.Failed, 'Cannot start Xvfb daemon');
        return false;
    }
    
    return testDaemon(config,daemon);

}

async function testDaemon(config: XvfbConfig, daemon: Daemon): Promise<boolean>{

    let now = new Date().getTime();
    let end = now + config.timeout;
    while (now < end) {
        console.debug("Waiting for Xvfb to be ready")
        await delay(500)
        if (await daemon.exec(config.testCommand,config.testArguments)) {
            console.log("Xvfb ready to get connections")
            return true;
        }
        now = new Date().getTime();
    }

    return false;

}

async function stopDaemon(config: XvfbConfig) {
    console.log('Stopping Xvfb daemon');
    var daemon = createDaemon(config);
    let result:boolean = await daemon.stop()
    if (! result ) {
        tl.setResult(tl.TaskResult.Failed, 'Cannot stop Xvfb daemon');
    }
    
    return result;
}


function createDaemon(config: XvfbConfig): Daemon {
    
    var daemon:Daemon = new Daemon(tl.tool);
    daemon.background = true;
    daemon.executable = config.xvfbPath
    daemon.arguments = config.arguments
    daemon.extraArguments = tl.getInput('extraArguments', false);
    daemon.pidId = config.display;

    return daemon;
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

run();