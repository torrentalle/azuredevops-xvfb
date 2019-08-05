import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');

const daemonToolPath = "/sbin/start-stop-daemon";
const defaultDisplay = "99"
const defaultScreen = "1280x1024x8"
const defaultExport = true

async function run() {

    try {
        
        console.log('Starting Xvfb daemon');
       
        // Start daemon  
        const display = await xvfbStart();
        if ( display == null ) {
            tl.setResult(tl.TaskResult.Failed, 'Cannot start Xvfb daemon');
            return;
        }

        // Check Xvfb status        
        var status:Boolean = await xvfbStatus();
        if (! status) {
            tl.setResult(tl.TaskResult.Failed, 'Xvfb daemon stopped unexpectedly');
            return;
        }
        console.log('Xvfb daemon started in display :' + display );

        // Publish variable for the rest of tasks
        if (getExport()) {
            tl.setTaskVariable("DISPLAY", ':' + display )
            console.log('Set Task Variable DISPLAY=":' + display +'"');
        }

    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}


async function xvfbStart():Promise<String|null> {

    const display = getDisplay();
    const screen = getScreen();

    const pidfile = '/tmp/custom_xvfb_'+display+'.pid';

    var start:tr.ToolRunner = tl.tool(daemonToolPath)
        .arg('--start')
        .arg('--background')
        .arg(['--make-pidfile','--pidfile', pidfile])
        .arg(['--exec', '/usr/bin/Xvfb'])
        .arg('--')
        .arg([':' + display])
        .arg('-ac')
        .arg(['-screen', '0', screen])
    var code: number = await start.exec();

    return code === 0? display : null;
}

async function xvfbStatus():Promise<Boolean> {
    const display = getDisplay();
    const pidfile = '/tmp/custom_xvfb_'+display+'.pid';

    await delay(1000);
    var start:tr.ToolRunner = tl.tool(daemonToolPath)
        .arg('--status')
        .arg(['--pidfile', pidfile])    
    var code: number = await start.exec();
    
    return code === 0;
}


function getDisplay(): string {
    // Get Display value
    let display = tl.getInput('display', false);
    if (display == null) {
        display = defaultDisplay;
    }

    var inputReg = /^[0-9]+$/g
    if (! inputReg.test(display)) {
        tl.setResult(tl.TaskResult.Failed, 'Bad Display was given');
        return "";
    }

    return display;
}

function getScreen(): string {
    // Get Display value
    let screen = tl.getInput('screen', false);
    if (screen == null) {
        screen = defaultScreen;
    }
    var inputReg = /^[0-9]+x[0-9]+x[0-9]+$/gi
    if (! inputReg.test(screen)) {
        tl.setResult(tl.TaskResult.Failed, 'Bad Screen Size was given');
        return "";
    }

    return screen;
}

function getExport() {
    // Get Display value
    let exportDisplay;
    try {
        exportDisplay = tl.getBoolInput('exportDisplay', true);
    } catch {
        exportDisplay = defaultExport
    }
 
    return exportDisplay;

}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

run();