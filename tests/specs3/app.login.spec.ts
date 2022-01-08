import LoginScreen from '../screenobjects/LoginScreen';
import AppScreen from "../screenobjects/AppScreen";
import ConsentScreen from "../screenobjects/ConsentScreen";
import HomeScreen from "../screenobjects/HomeScreen";
import {Screens} from "../screenobjects/NewPage";
import NewPage = Screens.NewPage;
import SingletonScreen = Screens.SingletonScreen;

// weaves
// This can run from noReset == true
//
// With this arrangement, a developer has a fairly fast code-test cycle.

const slow0 = 8000;
const slow1 = 3 * slow0;

describe('Consent and Login if needed ', () => {

  // This should only be run once for each test suite.
  before(async () => {
    console.log('reset state: ' + AppScreen.reset0)

    // If Consent appears click it away and follow login sequence.
    const t0 = await ConsentScreen.waitForIsShown(true, slow0);
    // If Consent appeared, we dismiss it
    if (t0) {
      await ConsentScreen.assent()
    }

    // If the Login appears, perform that and continue to the Home
    const t1 = await LoginScreen.waitForIsShown(true, slow0);
    if (t1) {
      await LoginScreen.waitForIsShownFatal(true, slow0);
      await LoginScreen.radioButton('MOCK')
      const password0 = 'test' + '\n';
      await LoginScreen.submitLoginForm1({username: 'o2udo00000002' + '\n', password: password0});

      // Logging in takes a long time
      await LoginScreen.waitForIsShownFatal(false, slow1);

      // And the home screen should appear
      await HomeScreen.waitForIsShownFatal(true, slow1);
    }
  });

  beforeEach(async () => {
    await NewPage.getSignature("new-test")
  });

  it('List some buttons ', async () => {
    const buttons = await SingletonScreen.instance.listButtons()
    console.log([...buttons.keys()].toString())
  });

  it('Straight to debugger ', async () => {
    await browser.debug()
  });

});
