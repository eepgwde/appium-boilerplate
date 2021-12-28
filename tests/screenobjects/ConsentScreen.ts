import AppScreen from './AppScreen';

/**
 * The consent screen has no info.
 *
 *
 */
class ConsentScreen extends AppScreen {
    /**
     * ConsentScreen overrides this to be non-fatal timeout.
     *
     * Wait until a button appears, then click the second from last clickable.
     * $$('id=canvasm.myo2:id/radio');
     */
    override async waitForIsShown(isShown = true, timeout: 8000): Promise<boolean | void> {
        let r0
        let r1
        try {
            r0 = $(this.selector).waitForDisplayed({
                timeout: timeout,
                reverse: !isShown
            });
            r1 = await r0

            const cbles = await $$('//*[*/@clickable = "true"]')
            const butn1 = cbles[cbles.length - 1]
            await butn1.click()
        } catch (error) {
            console.warn(error)
        }
        return r1
    }
}

export default new ConsentScreen('id=canvasm.myo2:id/ucHeader');
