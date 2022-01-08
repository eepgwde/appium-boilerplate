import AppScreen from './AppScreen';

class HomeScreen extends AppScreen {
  // Early appears on wait page
  // 'id=canvasm.myo2:id/toolbar'

  // "id=canvasm.myo2:id/um_info1"
  // "id=canvasm.myo2:id/um_info2"
  // "id=canvasm.myo2:id/um_value_max"

  constructor() {
    super(browser.isAndroid ? 'id=canvasm.myo2:id/um_value_max' :
      AppScreen.iosPredicate('XCUIElementTypeNavigationBar', 'name',
        'Startseite'));
  }

  private get drawerImage1() {
    return $('id=canvasm.myo2:id/navigation_drawer_image_button');
  }

  // Makes a string from null.
  private f0 = (x: any) => (x != null) ? x : ""
  // Reduce two strings.
  private f1 = (x: string, y: string) => (x.length > 0) ? `${x} ${y}` : y

  async joiner0(t0: any[], fld: string) {
    const t10 = t0.map((x) => x.getAttribute(fld))
    const t20 = await Promise.all(t10).then((values) => values)
    return t20
  }

  async joiner1(s0: string, fld: string) : Promise<string> {
    const r0 = await $$(s0)
    const r10 = r0.map( (x) => x.getAttribute(fld))
    const r11 = await Promise.all(r10).then((values) => values)
    return r11.map( (x) => this.f0(x)).reduce(this.f1, "")
  }

  /**
   * Find the text strings associated with the clickable buttons.
   *
   * First list the buttons, for those that have text or content-desc, no further processing is needed.
   * For those that do not, list all the children nodes and get their text/content-desc attributes.
   */
  async listButtons(): Promise<string[]> {
    // * List the buttons.
    const clickables0 = super.buttons
    const t0 = await $$(clickables0); // This is ElementArray, I can't find the type
    super.log.debug("clickables: count: " + t0.length)

    // * See what top-level text/desc is available.
    // Merge them together using a reduce and prefix with their index+1
    const [ t20, t21 ] = await Promise.all([this.joiner0(t0, "text"), this.joiner0(t0, "content-desc")])
    const u0 = [...Array(t0.length).keys()].map((i) =>
      [i+1, [this.f0(t20[i]), this.f0(t21[i])].reduce(this.f1)])

    // * Find those that have no text (zero length), get their indices and build a child node selector string
    const u1 = u0.filter( (u) => u[1].length == 0).map( (u) => u[0])
    const f2 = (i: number) => `(${clickables0})[${i}]//*`
    const s0 = u1.map( (u) => f2(u))

    // For each of those search strings, get the text and content-desc and reduce it to one string.
    const p0 = s0.map( async (s) => {
      return await Promise.all([this.joiner1(s, "text"), this.joiner1(s, "content-desc")])
    });
    const p1 = await Promise.all(p0)
    const p2 = p1.map( (p) => p.reduce(this.f1) )

    // Put the elements p2 into u0 at the positions given in u1
    const idxs = [...Array(p2.length).keys()].map( (i:number) => {
      const idx = u1[i] - 1; u0[idx] = [u1[i], p2[i]]; return i
    })

    // If any are still blank use a string like 00
    idxs.map( (i) => {
      const u = u0[i];
      if (u[1].length == 0) {
        u[1] = u[0].toString().padStart(2, '0')
        u0[i] = u
      }
    })
    super.log.debug(u0.toString())

    // And return the string
    return u0.map( (u) => u[1])
  }
}

export default new HomeScreen();
