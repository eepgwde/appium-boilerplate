import AppScreen from './AppScreen';

/**
 * The Consent screen may appear depending on Reset and Cookie options
 *
 * There is a safe test for a button. Safe means you know this is the Consent Screen.
 *
 * Some unsafe action is available, see the throw statement.
 *
 */
class ConsentScreen extends AppScreen {
    constructor() {
        super(browser.isAndroid ?
            AppScreen.andPredicate('*', 'text', 'Alles') :
            AppScreen.iosPredicate('XCUIElementTypeButton', 'name', 'Alles'))
    }

    /**
     * Click the second from last button.
     */
    async assent1() {
        try {
            const v0 = await super.safely(super.buttons)
            if (!v0) return

            const buttons = await $$(super.buttons)
            const len0 = buttons.length
            // @ts-ignore
            await buttons[len0 >= 2 ? (len0 - 1) : 0].click()
        } catch (error) {
            this.log.warn(error)
        }
    }

    /**
     * Simply click the accept button.
     */
    async assent() {
        try {
            await $(this.selector).click()
        } catch (error) {
            this.log.warn(error)
        }
    }
}

export default new ConsentScreen();
