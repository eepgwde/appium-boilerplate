const fs = require('fs');
const tmp = require('tmp');
const path = require('path');
const PropertiesReader = require('properties-reader')
import AppScreen from './AppScreen';

export module Screens {

    /**
     * Scripted area
     *
     * The types of WebdriverIO are not visible here and classes must compile.
     */
    export class NewPage {
        private static page_: Screens.NewPage;
        private static resources_: Map<string, string>;

        static async getSignature(name: string) : Promise<string> {
            const pg = await NewPage.getPage()
            const v0 = await pg.signature()
            return await AppScreen.source.dump(v0.toString(), name)
        }

        static async getPage() : Promise<Screens.NewPage> {
            this.page_ = new NewPage()
            return this.page_
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

            let v1 = await Promise.all(promises)
            return v1
        }

        static resources() : Map<string, string> {
            return NewPage.resources_
        }

        // Resources path
        // If there are files _desc.properties in the directory load them into a Map against
        // their hashCode.
        static async initialize(rpath: string) {
            if (!fs.existsSync(rpath)) return

            const files = await fs.readdirSync(rpath, (err) => {
                length: 0
            });
            if (typeof files == undefined) return
            if (files.length == 0) return

            const files1 = files.filter(fn => fn.endsWith('_desc.properties')).map( fn => path.join(rpath, fn) )
            let values = files1.map(fn => [ PropertiesReader(fn).get('hashCode'), fn ])
            NewPage.resources_ = Object.fromEntries(values)
        }
    }
}
