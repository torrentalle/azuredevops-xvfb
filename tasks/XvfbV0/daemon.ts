import { ToolRunner } from 'azure-pipelines-task-lib/toolrunner';

const pidPrefix = '/tmp/start-stop-daemon_';

interface DaemonRunner {
    (tool: string): ToolRunner;
}

export class Daemon {

    public daemonControl:string = "/sbin/start-stop-daemon";
    public background: boolean = false;
    public arguments: Array<string> = [];
    public extraArguments: string = "";
    public pidId: number = 0;

    private _executable:string = "";
    private runner: DaemonRunner;

    constructor(runner: DaemonRunner) {
        this.runner = runner;
    }

    get executable(): string {
        return this._executable;
    }

    set executable(cmd: string) {
        var reg = /^\s*$/m;
        if (reg.test(cmd)) {
            throw Error("Command cannot be empty")
        }
        this._executable = cmd;
    }


    get pidfile(): string {
        return pidPrefix + this.pidId.toString() +'.pid'
    }


    public async start() : Promise<boolean> {
        var cmd = this.runner(this.daemonControl);
        cmd.arg('--start');
        cmd.arg(['--make-pidfile','--pidfile', this.pidfile]);
        if (this.background) {
            cmd.arg('--background')
        }
        cmd.arg(['--exec', this.executable]);
        if (this.arguments.length >0 || this.extraArguments.length > 0) {
            cmd.arg('--');
            this.arguments.forEach(element => {
                cmd.arg(element);
            });
            cmd.line(this.extraArguments);
        }
        
        let code: number = await cmd.exec();
    
        return code === 0;
    }

    public async status() : Promise<boolean> {
    
        var status = this.runner(this.daemonControl)
            .arg('--status')
            .arg(['--pidfile', this.pidfile]);
        var code: number = await status.exec();
    
        return code === 0;
    }


    public async stop():Promise<boolean> {
    
        var stop  = this.runner(this.daemonControl)
            .arg('--stop')
            .arg('--oknodo')
            .arg(['--remove-pidfile', '--pidfile', this.pidfile])
        var code: number = await stop.exec();

        return code === 0;
    }


}