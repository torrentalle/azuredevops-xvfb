import { ToolRunner } from 'azure-pipelines-task-lib/toolrunner';

interface DaemonRunner {
    (tool: string): ToolRunner;
}

export class Daemon {

    private daemonControl:string = "/sbin/start-stop-daemon";
    public background: boolean = false;
    public pidPrefix = '/tmp/start-stop-daemon_';
    public arguments: Array<string> = [];
    public extraArguments: string | undefined;
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
        return this.pidPrefix + this.pidId.toString() +'.pid'
    }


    public async start() : Promise<boolean> {

        let args = ['--start', '--make-pidfile','--pidfile', this.pidfile];
        let extraArgs = undefined;

        if (this.background) {
            args.push('--background')
        }

        args.push('--exec', this.executable);
        if (this.arguments.length  >0 || this.extraArguments != undefined) {
            args.push('--');
            this.arguments.forEach(element => {
                args.push(element);
            });
            extraArgs = this.extraArguments;
        }

        return await this.exec(this.daemonControl, args, extraArgs);

    }

    public async status() : Promise<boolean> {
        
        return await this.exec(
            this.daemonControl,
            ['--status','--pidfile', this.pidfile]
        );
    }

    public async exec(command: string, args?: Array<string>, extraArgs?: string) : Promise<boolean> {

        var status = this.runner(command);
        if (args !== undefined) {
            args.forEach(value => {
                status.arg(value);
            });    
        }
        if (extraArgs !== undefined) {
            status.line(extraArgs);
        }
        
        let code = await status.exec();

        return code == 0;
        
    }

    public async stop():Promise<boolean> {
        return await this.exec(
            this.daemonControl,
            ['--stop', '--oknodo', '--remove-pidfile', '--pidfile', this.pidfile]
        );
    
    }


}