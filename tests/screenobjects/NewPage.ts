import AppScreen from './AppScreen';

export module Screens {

    /**
     * Scripted area
     *
     * The types of WebdriverIO are not visible here and classes must compile.
     */
    export class NewPage {
        private static page_: Screens.NewPage;

        static async getSignature(name: string) : Promise<string> {
            const pg = await NewPage.getPage()
            const v0 = await pg.signature()
            await AppScreen.source.dump(v0.toString(), name)
            return v0.toString()
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
    }
}
