const fs = require('fs');
const tmp = require('tmp');
const path = require('path');
import PropertiesReader = require('properties-reader')
import AppScreen from './AppScreen';
import logger from "@wdio/logger";

/**
 * Provides for Screens.
 *
 * NewPage is a factory that produces KnownPage.
 */
export module Screens {

    const log = logger('Screens')

    /**
     * resources files Bean for an Android page from Appium.
     *
     * This uses the output from _desc.resources made by click.xslt.
     *
     * In the resources files, each element is addressed as: clk.text.<node-id>.<node> ,
     * or txt.text.<node-id>.<node>
     * So I split on node-id.
     * This is using the clicks.xslt transform using Saxon. It has the buttons on the screen as
     * clk.text.<node-id> under that there is txt.text.
     *
     * Each <node-id> is a screen element that is clickable. TextView ImageView Layout and others are their Element types.
     */
    export class KnownPage {
        public readonly hashCode: string = "";
        // public resources: typeof resourcesReader;
        public readonly propsFile: string;
        protected resources: PropertiesReader;

        constructor(hashCode: string, propsFile: string) {
            this.propsFile = propsFile
            this.hashCode = hashCode

            if (typeof propsFile == 'string' && propsFile.length > 0) {
                this.resources = PropertiesReader(propsFile)
                this.hashCode = this.resources.get("hashCode")
            }
        }

        /**
        * From the page at the server. XPath selector for clickable = true.
         *
         * We should have the same number of clickables as unique node-id in the resources file. This becomes
         * sections().
         */
        public get clickables() {
            return $$('//*[*/@clickable = "true"]');
        }

        /**
         * Split the resources file into sections.
         *
         * Usually, the sections are the node-id of the resources file.
         * This returns a list of node-id as hexadecimal string. Monotonically increasing in a weird way.
         * The resources.each function has to use a side-effect to laod the array.
         * @protected
         */
        protected sectionate() {
            var sections: string[] = [ "" ];
            this.resources.each((key: string, value: string) => {
                const section = key.split(".")[2]
                // ignore the header
                if (typeof section == 'string') {
                    if (!sections.includes(section)) {
                        sections.push(section)
                    }
                }
            })
            return sections
        }

        // This is not used, but explains how the text and desc filter works.
        protected ftags(part: string): string[] {
            const t0 = [`clk.text.${part}`, `clk.desc.${part}`, `txt.text.${part}`, `txt.desc.${part}`]
            return t0
        }

        // The clickables from the resources file
        public get textsR() {
            return this.items_()
        }

        /**
         * Get some features from the properties file.
         * @param filter0
         * @protected
         */
        protected items_(filter0? : (x: string) => boolean) : Map<string, string> {
            if (filter0 == undefined) {
                filter0 = (x) => { return x == "text" || x == "desc" }
            }

            log.info(this.resources.get("hashCode"))
            log.info(this.resources.length)

            const sections = this.sectionate();

            // const idxes = [...Array(40).keys()].map(v => (v + 1).toString().padStart(2, '0'))

            const props = this.resources.getAllProperties()

            const keys = Object.keys(props)

            // get the third element of a.b.c
            // with that, do a join for .b being text or desc.
            // and get the value, remove empties
            const kvs = keys.filter(k => k.split(".").length > 3).map(k => [k.split(".")[2], k])
            const kvs1 = kvs.map(x => [x[0], x[1], x[1].split(".")[1]])
                .filter(x => (x[2] == "text" || x[2] == "desc"))
                .map(x => [x[0], x[1]]).map(x => [x[0], this.resources.get(x[1])])
                .filter(x => x[1].length > 0)
            // sort on the first field.
            const kvs2 = kvs1.sort(function (a, b) {
                return a[0].localeCompare(b[0])
            });
            // Turn that into a map
            const kvs3 = Object.fromEntries(kvs2)
            const kvs4 = new Map(Object.entries(kvs3))

            // Create some names from numbers
            // map each section to 01 .. 99
            const idxes1 = [...Array(sections.length).keys()]
            const sections1 = idxes1.map(i => [sections[i], (i + 1).toString().padStart(2, '0')])
            const sections2 = Object.fromEntries(sections1)
            const sections3 = new Map(Object.entries(sections2))

            // Finally, join the text/desc with the numbers.
            const map0 = new Map()
            for (const [key, value] of sections3) {
                // @ts-ignore
                map0.set(key, value.concat(" : " + kvs4.get(key)))
            }
            return map0
        }

    }

    /**
     * Another singleton: used to get the signatures of a page.
     */
    export class NewPage {
        private static page_: Screens.NewPage;
        private static resources_: Map<string, string> = new Map<string, string>();

        private static known_ = new Map<string, KnownPage>()

        private constructor() {
        }

        public get radioButtons() {
            // reliable
            return $$('/hierarchy//*[*/@resource-id = "canvasm.myo2:id/radio"]');
        }

        public get radioButton() {
            // unreliable - one screen misses all of them?
            return $$('/hierarchy//*/android.widget.RadioButton');
        }

        public get clickables() {
            // unreliable - one screen misses all of them?
            return $$('//*[*/@clickable = "true"]');
        }

        public get textNonEmpty() {
            // reliable
            return $$('//*[*/@text != ""]');
        }

        public get resourceId() {
            // reliable
            return $$('//*[*/@resource-id != ""]');
        }

        public get editText() {
            // reliable
            return $$('/hierarchy//*/android.widget.EditText');
        }

        public get textView() {
            // reliable
            return $$('/hierarchy//*/android.widget.TextView');
        }

        public get drawerLayout() {
            return $$('/hierarchy//*/androidx.drawerlayout.widget.DrawerLayout');
        }

        private static maker(hash0: string, fn: string) : KnownPage {
            const pg1 = new KnownPage(hash0, fn)
            NewPage.known_.set(hash0, pg1)
            return pg1
        }

        public static pageOf(hash0: string, fn: string = "") : KnownPage {
            return NewPage.known_.get(hash0) ?? NewPage.maker(hash0, fn)
        }

        static async getSignature(name: string): Promise<KnownPage> {
            const v0 = await (new NewPage()).signature()

            const hash0 = await AppScreen.source.dump(v0.toString(), name)
            const fn = NewPage.resources_.get(hash0) ?? ""

            const pg = NewPage.pageOf(hash0, fn)
            return pg
        }

        static resources(): Map<string, string> {
            return NewPage.resources_
        }

        // their hashCode.
        static async initialize(rpath: string) {
            if (!fs.existsSync(rpath)) return

            const files = fs.readdirSync(rpath, (err) => {
                log.warn(err)
            });
            if (typeof files == undefined) return
            if (files.length == 0) return

            const files1 = files.filter(fn => fn.endsWith('_desc.properties')).map(fn => path.join(rpath, fn))
            let values = files1.map(fn => [PropertiesReader(fn).get('hashCode'), fn])
            // convert an array to a map
            NewPage.resources_ = new Map(values)
        }

        // Resources path
        // If there are files _desc.resources in the directory load them into a Map against

        async signature(): Promise<number[]> {
            const v0 = [
                this.radioButtons.length,
                this.radioButton.length,
                this.clickables.length,
                this.textNonEmpty.length,
                this.resourceId.length,
                this.editText.length,
                this.textView.length,
                this.drawerLayout.length
            ];

            let promises = v0.map(async v => {
                await v;
                return v
            });

            const v1 = await Promise.all(promises)
            return v1
        }
    }
}
