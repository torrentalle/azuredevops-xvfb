import tl = require('azure-pipelines-task-lib/task');
import { XvfbConfig } from './config';
import { Daemon } from './daemon';
import { isNull } from 'util';



async function run() {

    try {
        
        var xvfbConfig: XvfbConfig = new XvfbConfig();              
        xvfbConfig.resolution = tl.getInput('screenSize', false);
        xvfbConfig.display = parseInt(tl.getInput('display', false));        

        let action = tl.getInput('action', true);

        switch (action) {
            case  'start': {
                let s = await startDaemon(xvfbConfig);
                if (s) {
                    setDisplay(xvfbConfig.display);
                    console.log('Xvfb daemon started in display :' + xvfbConfig.display );
                }
                break;
            }
            case  'stop': {
                let s = await stopDaemon(xvfbConfig);
                if (s) {
                    setDisplay(null);
                    console.log('Xvfb daemon stopped' );
                }
                break;
            }
            default: {
                tl.setResult(tl.TaskResult.Failed, 'Invalid action');    
            }
        }
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

async function startDaemon(config: XvfbConfig) {
    var daemon = createDaemon(config);
    let result:boolean = await daemon.start()
    if (! result ) {
        tl.setResult(tl.TaskResult.Failed, 'Cannot start Xvfb daemon');
    }

    return result;
}

async function stopDaemon(config: XvfbConfig) {
    var daemon = createDaemon(config);
    let result:boolean = await daemon.stop()
    if (! result ) {
        tl.setResult(tl.TaskResult.Failed, 'Cannot stop Xvfb daemon');
    }
    
    return result;
}


function setDisplay(display: number|null): void {
    if (tl.getBoolInput('exportDisplay')) {
        let value = isNull(display)? '' : ':' + display.toString();
        tl.setTaskVariable("DISPLAY", value );
        console.log('Set Task Variable DISPLAY='+value)
    }
}

function createDaemon(config: XvfbConfig): Daemon {
    
    var daemon:Daemon = new Daemon(tl.tool);
    daemon.background = true;
    daemon.executable = config.xvfbPath
    daemon.arguments = config.getArrayArguments()
    daemon.extraArguments = tl.getInput('extraArguments', false);
    daemon.pidId = config.display;

    return daemon;
}

run();