// weaves
//
// Actions0 is used in Login
// The keys() method doesn't work on W3C apps, the class Actions0 does what it does before the send.
//
// Source0 is used in AppScreen and dumps pages.
//
// https://github.com/webdriverio/webdriverio/blob/9d2220e89144b0ca69232737957ad5fc32ca1300/packages/webdriverio/tests/commands/browser/keys.test.ts

const fs = require('fs');
const tmp = require('tmp');
const path = require('path');

export module Local {
    /**
     * Allegedly the same as Java.
     *
     * https://stackoverflow.com/posts/8076436/revisions
     */
    String.prototype.hashCode = function() {
        var hash = 0;
        for (var i = 0; i < this.length; i++) {
            var character = this.charCodeAt(i);
            hash = ((hash<<5)-hash)+character;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

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
        private readonly ddir: string;
        private browser_: object;
        private readonly useTempFile: boolean;

        static get browser() {
            return this.browser_;
        }
        private prefix: string;
        private postfix: string;

        constructor(browser: object,
                    ddir: string = "pages",
                    prefix: string = "w",
                    postfix: string = ".xml",
                    useTempFile: boolean = false) {
            fs.mkdirSync(ddir, {recursive: true})
            this.browser_ = browser
            this.prefix = prefix
            this.postfix = postfix
            this.ddir = ddir
            this.useTempFile = useTempFile
        }

        get directory(): string {
            return this.ddir
        }

        /**
         * Writes out a page to a sub-directory, the session id.
         */
        async dump(signature: string) {
            fs.writeFile("session.json-id", browser.sessionId.toString(), function (err) {
                if (err) throw err;
                console.log('session-id');
            });

            const page = await browser.getPageSource()

            console.log("hashCode: " + page.hashCode() + "; signature: " + signature)
            const hexString = page.hashCode().toString(16)

            let p0 = path.join(".", this.ddir, this.prefix + hexString + this.postfix + "1")

            const mark0 = {
                hashCode: hexString,
                signature: signature
            }

            const promise = fs.writeFile(p0, JSON.stringify(mark0), function (err) {
                if (err) throw err;
                console.log('save-hash');
            });

            if (this.useTempFile) {
                const nm = tmp.fileSync({mode: 0o664, prefix: this.prefix, postfix: this.postfix, tmpdir: this.ddir});
                console.log("nm.name: " + nm.name)
                const promise = fs.writeFile(nm.name, page, function (err) {
                    if (err) throw err;
                    console.log('save-rnd');
                });
            } else { /* use a hashCode */
                let p0 = path.join(".", this.ddir, this.prefix + hexString + this.postfix)

                const promise = fs.writeFile(p0, page, function (err) {
                    if (err) throw err;
                    console.log('save-hash');
                });
            }
        }

    }
}
