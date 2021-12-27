// weaves
//
// The keys() method doesn't work on W3C apps.
// https://github.com/webdriverio/webdriverio/blob/9d2220e89144b0ca69232737957ad5fc32ca1300/packages/webdriverio/tests/commands/browser/keys.test.ts

const fs = require('fs');
const tmp = require('tmp');

export module Local {
    export class Actions0 {

        private actions: { id: string; type: string; actions: FlatArray<{ type: string; value: string }[][], 1>[] };

        constructor(mesg: string) {
            const chars = Array.from(mesg)
            const k1 = chars.map(v => [(this.keyPress(v, "keyDown")), (this.keyPress(v, "keyUp"))]).flat()
            this.actions = this.keyActions(k1)
        }

        get value(): object[] {
            return Array(this.actions)
        }

        keyPress(ch: string, dir: string): { type: string; value: string } {
            return {
                type: dir,
                value: ch
            }
        }

        keyActions(ks: FlatArray<{ type: string; value: string }[][], 1>[]):
            { id: string; type: string; actions: FlatArray<{ type: string; value: string }[][], 1>[] } {
            return {
                type: "key",
                actions: ks,
                id: "default keyboard"
            }
        }

    }

    export class Source0 {
        private ddir: string;
        private browser: object;
        private prefix: string;
        private postfix: string;

        constructor(browser: object, ddir: string = "pages", prefix: string = "w", postfix: string = ".xml") {
            fs.mkdirSync(ddir, {recursive: true})
            this.browser = browser
            this.prefix = prefix
            this.postfix = postfix
            this.ddir = ddir
        }

        get directory(): string {
            return this.ddir
        }

        async dump() {
            const page = await browser.getPageSource()
            const nm = tmp.fileSync({mode: 0o664, prefix: this.prefix, postfix: this.postfix, tmpdir: this.ddir});
            console.log("nm.name: " + nm.name)
            const promise = fs.writeFile(nm.name, page, function (err) {
                if (err) throw err;
                console.log('save');
            });
        }

    }
}
