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

}

export default new HomeScreen();
