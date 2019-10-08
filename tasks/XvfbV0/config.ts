

interface XvfbScreen {
    width: number,
    height: number,
    depth: number
}

export class XvfbConfig {

    private socketPrefix:string = '/tmp/.X11-unix/X';   
    private _display:number = 0
    private _screen:XvfbScreen =  {
        width: 1280,
        height: 1024,
        depth: 8
    }

    public timeout:number = 10000;
    public xvfbPath:string = "/usr/bin/Xvfb";
    public testCommand:string = "xdpyinfo";
    
    get display(): number {
        return this._display;
    }

    get socket(): string {
        return this.socketPrefix + this.display.toString();
    }

    set display(display:number) {
        if (isNaN(display)) {
            return;
        }
        if (display < 0) {
            throw Error("display must be grather than 0");
        }
        this._display = display;
    }

    get screen(): XvfbScreen {
        return this._screen;
    }

    get screennum(): string {
        return '0';
    }


    get resolution(): string {
        return new Array(
            this.screen.width.toString(), 
            this.screen.height.toString(), 
            this.screen.depth.toString()
        ).join('x');
    }

    set resolution(size: string ) {
    
        var inputReg = /^([0-9]+)x([0-9]+)x([0-9]+)$/gi 
        let match = inputReg.exec(size);

        if (match === null ||match.length != 4) {
            throw Error("screen format must be 'WxHxD'");
        }
        this.screen = {
            width: Number(match[1]),
            height: Number(match[2]),
            depth: Number(match[3])
        }
    }

    set screen( screen: XvfbScreen) {
        if (screen.height <= 0 || screen.width <= 0 || screen.depth <= 0) {
            throw Error("resolution must be grather than 0.");
        }
        this._screen = screen;
    }

    get arguments():Array<string> {
        return [
            ':' + this.display.toString(), '-ac', '-screen', this.screennum, this.resolution
        ]
    }

    get testArguments():Array<string> {
        return [
            '-display',
            ':' + this.display.toString()
        ]
    }

}

