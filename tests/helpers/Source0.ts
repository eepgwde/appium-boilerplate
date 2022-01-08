// weaves
//
// This has typescript errors because of hashCode.
//
// Actions0 is used in Login
// The keys() method doesn't work on W3C apps, the class Actions0 does what it does before the send.
//
// Source0 is used in AppScreen and dumps pages.
//
// There is also a log that can be used.
//
// https://github.com/webdriverio/webdriverio/blob/9d2220e89144b0ca69232737957ad5fc32ca1300/packages/webdriverio/tests/commands/browser/keys.test.ts

import logger from "@wdio/logger";

const fs = require('fs');
const tmp = require('tmp');
const path = require('path');

export module Local {
  export const log = logger('Source0')

  /**
   * Allegedly the same as Java.
   *
   * https://stackoverflow.com/posts/8076436/revisions
   *
   * It is fiddly to extend String and make it typesafe.
   * https://stackoverflow.com/questions/39877156/how-to-extend-string-prototype-and-use-it-next-in-typescript
   *
   */
  String.prototype.hashCode = function () {
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
      var character = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + character;
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
    private readonly useTempFile: boolean;
    private prefix: string;
    private postfix: string;

    constructor(ddir: string = "pages",
                        prefix: string = "w",
                        postfix: string = ".xml",
                        useTempFile: boolean = false) {
      if (!fs.existsSync(ddir, {recursive: true})) {
        fs.mkdirSync(ddir, {recursive: true})
      }
      this.prefix = prefix
      this.postfix = postfix
      this.ddir = ddir
      this.useTempFile = useTempFile
      Source0._instance = this
    }

    static _instance: Source0

    static get instance(): Source0 {
      if (Source0._instance === undefined)
        Source0._instance = new Source0()

      return Source0._instance
    }

    get directory(): string {
      return this.ddir
    }

    public async hashCode(): Promise<{ hashCode: string, src: string }> {
      // Snapshot the page source.
      const page = await browser.getPageSource()
      const hexString = page.hashCode().toString(16)
      return {
        hashCode: hexString,
        src: page
      };
    }

    /**
     * Writes out a page to a sub-directory, the session id is updated and another file with .xml1 is added.
     *
     * dump() is now called by getSignature()
     */
    async dump(signature: string, name: string = "unnamed") {
      // Update the session-id
      const sid = browser.sessionId.toString().replace('_', '');
      fs.writeFile("session.json-id", sid, function (err: any) {
        if (err) throw err;
        log.info('session-id');
      });

      // Snapshot the page source.
      // const page = await browser.getPageSource()
      // const hexString = page.hashCode().toString(16)

      const page = await this.hashCode()

      // Generate a hash and add a signature and write to disk.
      let p0 = path.join(".", this.ddir, this.prefix + page.hashCode + this.postfix + "1")
      const mark0 = {
        hashCode: page.hashCode,
        name: name,
        signature: signature
      }
      const promise = fs.writeFile(p0, JSON.stringify(mark0), function (err: any) {
        if (err) throw err;
      });

      // Take an image
      try {
        const pic = browser.takeScreenshot()
        p0 = path.join(".", this.ddir, this.prefix + page.hashCode + this.postfix + "2")
        const promise1 = fs.writeFile(p0, pic, function (err: any) {
          if (err) throw err;
        });
      } catch (e) {
        log.warn("failed to take screenshot: " + p0)
      }

      // Write out the page source to file


      if (this.useTempFile) { // not used.+
        const nm = tmp.fileSync({mode: 0o664, prefix: this.prefix, postfix: this.postfix, tmpdir: this.ddir});
        log.info("nm.name: " + nm.name)
        const promise = fs.writeFile(nm.name, page.src, function (err: any) {
          if (err) {
            log.warn('save-rnd: + ' + p0);
          }
        });
      } else { /* use a hashCode */
        let p0 = path.join(".", this.ddir, this.prefix + page.hashCode + this.postfix)

        const promise = fs.writeFile(p0, page.src, function (err: any) {
          if (err) {
            log.warn('save-hash: + ' + p0);
            // throw err;
          }
        });
      }
      return page.hashCode
    }
  }
}

