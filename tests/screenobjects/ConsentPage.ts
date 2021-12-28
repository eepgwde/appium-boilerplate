import AppScreen from './AppScreen';

/**
 * Scripted area
 *
 * The types of WebdriverIO are not visible here and classes must compile.
 */
export default class ConsentPage extends AppScreen {

    /**
     * Wait until a button appears, then click the second from last clickable.
     $$('id=canvasm.myo2:id/radio');
     */
    static async waitForConsent ():Promise<boolean|void> {
        var r0
        try {
            r0 = await browser.waitForVisible('id=canvasm.myo2:id/ucHeader', 8000)
        } catch (error) {
            console.error(error)
        }

        if (r0) {
            const cbles = await $$('//*[*/@clickable = "true"]')
            const butn1 = cbles[cbles.length - 1]
            await butn1.click()
        }
        return tag;
    }
}
