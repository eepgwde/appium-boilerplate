// weaves
//
// Actions0 is a data container class. Used by performActions() in the Login procedure.
// This because the keys() method doesn't work on W3C apps. The class Actions0 is a container and
// restructures a string before sending it as key press sequences.
//
// Source0 is used in AppScreen and dumps pages. This module is at the base of the architecture.
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
  String.prototype.hashCode = (): number => {
    let hash = 0;
    // @ts-ignore
    const s = String(this)
    for (let i = 0; i < s.length; i++) {
      let character = s.charCodeAt(i);
      hash = ((hash << 5) - hash) + character;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  export class Actions0 {

    private readonly actions: { id: string; type: string; actions: FlatArray<{ type: string; value: string }[][], 1>[] };

    constructor(message: string) {
      const chars = Array.from(message)
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

  /**
   * Helper class to rename duplicate elements.
   */
  export class XDuplications {
    readonly ss: string[];
    readonly s: string;
    indices: number[]

    constructor(ss: string[], s: string) {
      this.ss = ss
      this.indices = []
      this.s = s
    }

    indicesOf() {
      let idx = this.ss.lastIndexOf(this.s);
      const i0s = []
      while (idx != -1) {
        i0s.push(idx)
        idx = (idx > 0 ? this.ss.lastIndexOf(this.s, idx - 1) : -1);
      }
      this.indices = i0s.reverse()
    }

    get renamed () : string[] {
      this.indicesOf()
      if (this.indices.length == 0) return this.ss

      // drop the first element same as this.s, get the range of the remaining indices
      // generate some replacements
      const toChgIdx = [...this.indices].splice(1)
      const idxes = [...Array(toChgIdx.length).keys()]
      const s1s = idxes.map( (i) => `${this.s}(${i+1})`)

      // clone the elements then replace the duplicates with the renamed
      const nss = [...this.ss]
      idxes.forEach( (i) => {
        const idx = toChgIdx[i]
        nss[idx] = s1s[i]
      })

      return nss
    }

    static findDuplicates = (k0: string[]) =>
      k0.filter((item: string, index: number) => k0.indexOf(item) !== index)

    static hasDuplicates = (k0: string[]) => (new Set(k0)).size !== k0.length
  }

  export class Source0 {
    private readonly destDir: string;
    private readonly useTempFile: boolean;
    private readonly prefix: string;
    private readonly postfix: string;

    constructor(destDir: string = "pages",
                        prefix: string = "w",
                        postfix: string = ".xml",
                        useTempFile: boolean = false) {
      if (!fs.existsSync(destDir, {recursive: true})) {
        fs.mkdirSync(destDir, {recursive: true})
      }
      this.prefix = prefix
      this.postfix = postfix
      this.destDir = destDir
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
      return this.destDir
    }

    public async makeHashCode(): Promise<{ xhashCode: string, src: string }> {
      // Snapshot the page source.
      // There is an "await" warning, that can be mitigated with this use of Promise.all
      const [page] = await Promise.all([browser.getPageSource()])
      const hexString = page.hashCode().toString(16)
      return {
        xhashCode: hexString,
        src: page
      };
    }

    /**
     * Writes out a page to a subdirectory, the session id is updated and another file with .xml1 is added.
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

      const page = await this.makeHashCode()

      // Generate a hash and add a signature and write to disk.
      let p0 = path.join(".", this.destDir, this.prefix + page.xhashCode + this.postfix + "1")
      const mark0 = {
        hashCode: page.xhashCode,
        name: name,
        signature: signature
      }
      fs.writeFile(p0, JSON.stringify(mark0), function (err: any) {
        if (err) throw err;
      });

      // Take an image
      try {
        const pic = browser.takeScreenshot()
        p0 = path.join(".", this.destDir, this.prefix + page.xhashCode + this.postfix + "2")
        fs.writeFile(p0, pic, function (err: any) {
          if (err) throw err;
        });
      } catch (e) {
        log.warn("failed to take screenshot: " + p0)
      }

      // Write out the page source to file

      if (this.useTempFile) { // not used.+
        const nm = tmp.fileSync({mode: 0o664, prefix: this.prefix, postfix: this.postfix, tmpdir: this.destDir});
        log.info("nm.name: " + nm.name)
        fs.writeFile(nm.name, page.src, function (err: any) {
          if (err) {
            log.warn('save-rnd: + ' + p0);
          }
        });
      } else { /* use a hashCode */
        let p0 = path.join(".", this.destDir, this.prefix + page.xhashCode + this.postfix)

        fs.writeFile(p0, page.src, function (err: any) {
          if (err) {
            log.warn('save-hash: + ' + p0);
            // throw err;
          }
        });
      }
      return page.xhashCode
    }
  }
}

