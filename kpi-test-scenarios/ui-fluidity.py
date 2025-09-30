import logging
from typing import Any, Dict, Optional, Union

"""Import more if needed."""
import time

supportAppiumOptions: bool = True
try:
    from appium.webdriver.webdriver import AppiumOptions
except ImportError:
    supportAppiumOptions = False

from appium import webdriver

appium_url: str = "http://127.0.0.1:4723"
options: Optional[Union[Dict[str, Any], AppiumOptions]] = None
logger = logging.getLogger(__name__)

# Please do not change the name of the class.
class TestRunner:
    _PRESS_DELAY: float = 0.9

    def __init__(self, device_serial_number: str):
        self.__driver: Optional[webdriver.webdriver.WebDriver] = None
        self.__capabilities: Dict[str, Any] = {
            "platformName": "Kepler",
            "appium:automationName": "automation-toolkit/JSON-RPC",
            "kepler:device": f"vda://{device_serial_number}",
            "kepler:jsonRPCPort": 8383,
            "newCommandTimeout": 500,
            "appium:deviceName": device_serial_number,
            "appURL": "com.amazondeveloper.keplersportapp.main"
        }

    # You might also define helper function to modularize
    # functions called within the test scenario.
    def _press_dpad(self, direction: str, interval: float):
        """Helper function to send D-pad key press event to Kepler device.
        
        Args:
            Direction (str): D-pad direction key. Please refer to 
                https://developer.amazon.com/docs/kepler-tv/appium-commands.html
                for D-pad direction keys.
            interval (int): The time interval between each movement along the path, in unit seconds.
                _press_dpad will wait for time difference between the interval and time lapse of
                press event.
        """
        # We keep "holdDuration" to 0 (no holding) to
        # reproduce D-pad clicking behavior by app users.
        start: float = time.time()
        self.__driver.execute_script(
                "jsonrpc: injectInputKeyEvent",
                [{"inputKeyEvent": direction , "holdDuration": 0}]
            )
        cmd_time: float = time.time() - start
        if interval > cmd_time:
            wait_time: float = interval - cmd_time
            logger.info(f"Sleeping for {wait_time} seconds to give {interval} seconds interval between D-pad press events.")
            time.sleep(wait_time)

    def prep(self) -> None:
        if supportAppiumOptions:
            self.__driver = webdriver.Remote(
                appium_url,
                options=AppiumOptions().load_capabilities(self.__capabilities)
            )
        else:
            self.__driver = webdriver.Remote(appium_url, self.__capabilities)

        # wait 10 seconds for app to warm up
        logger.info("Waiting for application to warm up for 10 seconds")
        time.sleep(10)

                # Login
        self._press_dpad("96", TestRunner._PRESS_DELAY)
        time.sleep(2)
        self.__driver.get_window_rect()  # workaround for element not found issue
        time.sleep(2)
        input_email = self.__driver.find_element(by="xpath",
                                                 value="(//children[@test_id='title']/../../following-sibling::children/children)[2]")
        input_email.send_keys("test@test.com")
        self._press_dpad("158", TestRunner._PRESS_DELAY)
        self._press_dpad("108", TestRunner._PRESS_DELAY)
        self._press_dpad("96", TestRunner._PRESS_DELAY)
        time.sleep(2)
        self.__driver.get_window_rect()  # workaround for element not found issue
        time.sleep(2)
        input_password = self.__driver.find_element(by="xpath",
                                                    value="(//children[@test_id='title']/../../following-sibling::children/children)[2]")
        input_password.send_keys("12345678")
        self._press_dpad("158", TestRunner._PRESS_DELAY)
        self._press_dpad("108", TestRunner._PRESS_DELAY)
        self._press_dpad("108", TestRunner._PRESS_DELAY)
        self._press_dpad("96", TestRunner._PRESS_DELAY)
        self.__driver.get_window_rect()  # workaround for element not found issue
        time.sleep(2)

        # Profile screen
        self._press_dpad("96", TestRunner._PRESS_DELAY)

        time.sleep(2)
        self.__driver.get_window_rect()  # workaround for element not found issue
        time.sleep(2)


    def run(self) -> None:
        # Measure UI Fluidity by moving around Home screen Carousels
        self._press_dpad("106", TestRunner._PRESS_DELAY)
        self._press_dpad("106", TestRunner._PRESS_DELAY)
        self._press_dpad("106", TestRunner._PRESS_DELAY)
        self._press_dpad("106", TestRunner._PRESS_DELAY)
        self._press_dpad("106", TestRunner._PRESS_DELAY)
        self._press_dpad("105", TestRunner._PRESS_DELAY)
        self._press_dpad("105", TestRunner._PRESS_DELAY)
        self._press_dpad("105", TestRunner._PRESS_DELAY)
        self._press_dpad("105", TestRunner._PRESS_DELAY)
        self._press_dpad("105", TestRunner._PRESS_DELAY)
        self._press_dpad("108", TestRunner._PRESS_DELAY)
        self._press_dpad("108", TestRunner._PRESS_DELAY)
        self._press_dpad("108", TestRunner._PRESS_DELAY)
        self._press_dpad("108", TestRunner._PRESS_DELAY)
        self._press_dpad("108", TestRunner._PRESS_DELAY)
        self._press_dpad("103", TestRunner._PRESS_DELAY)
        self._press_dpad("103", TestRunner._PRESS_DELAY)
        self._press_dpad("103", TestRunner._PRESS_DELAY)
        self._press_dpad("103", TestRunner._PRESS_DELAY)
        self._press_dpad("103", TestRunner._PRESS_DELAY)
        