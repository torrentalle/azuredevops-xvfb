

interface XvfbScreen {
    width: number,
    height: number,
    depth: number
}

export class XvfbConfig {
    
    private _display:number = 99
    private _screen:XvfbScreen =  {
        width: 1280,
        height: 1024,
        depth: 8
    }

    public xvfbPath:string = "/usr/bin/Xvfb";
    

    get display(): number {
        return this._display;
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

    set resolution(size: string) {
        if (size == null) {
            return;
        }
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
            throw Error("resolution must be grather than 0. " + this.resolution);
        }
        this._screen = screen;
    }

    public getArrayArguments():Array<string> {
        return [
            ':' + this.display.toString(), '-ac', '-screen', this.screennum, this.resolution
        ]
    }

}

