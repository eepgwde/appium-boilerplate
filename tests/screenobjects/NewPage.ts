import AppScreen from './AppScreen';

export module Screens {

    /**
     * Scripted area
     *
     * The types of WebdriverIO are not visible here and classes must compile.
     */
    export class NewPage {

        static async getSignature() : Promise<string> {
            const v0 = await(new NewPage()).signature()
            console.log('signature: ' + v0.toString())
            await AppScreen.source.dump(v0.toString())
            return v0.toString()
        }

        public get radioButtons() {
            return $$('id=canvasm.myo2:id/radio');
        }

        public get clickables() {
            return $$('//*[*/@clickable = "true"]');
        }

        public get textNonEmpty() {
            return $$('//*[*/@text != ""]');
        }

        public get resourceId() {
            return $$('//*[*/@resource-id != ""]');
        }

        public get radioButton() {
            return $$('/hierarchy//*/android.widget.RadioButton');
        }

        public get editText() {
            return $$('/hierarchy//*/android.widget.EditText');
        }

        public get textView() {
            return $$('/hierarchy//*/android.widget.TextView');
        }

        async signature(): Promise<number[]> {
            const v0 = [
                this.radioButtons.length,
                this.radioButton.length,
                this.clickables.length,
                this.textNonEmpty.length,
                this.resourceId.length,
                this.editText.length,
                this.textView.length
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
