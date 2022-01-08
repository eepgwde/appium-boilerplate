// weaves
// This can be run from a reset.
// It is here to demonstrate browser commands in the debugger.

const slow0: number = 8000;
const slow1: number = (5 * slow0);

describe('One test only - drop into debugger and use it to login by hand: ', () => {
  beforeEach(async () => {
    console.log('Before each hook')
  });

  it('straight to debugger', async () => {
    await browser.debug()
    // Get a list of buttons to click
    // browser.clickables()
    // For Android use the same XPath as the clickables() method.
    // let cs = $$('//*[@clickable="true"]')
    // You can then click
    // cs[5].click()
    // To send input, use browser.clickables() again to find the number of the text input field, then re-list the
    // buttons and click it
    // cs = $$('//*[@clickable="true"]')
    // then send some key presses to it, like this:
    // browser.actions0('user@example.com\n')
    // Notice the use of '\n' to move to the next field.
    // And so on ...
  });

});
