const {
  Builder, Browser, By, Key, until,
} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

(async function ILovePDF() {
  const PATH_TO_PDF = 'C:/Users/MarokkoTV/Desktop/src/spanner-punk/pdf/123.pdf';
  const driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    await driver.get('https://www.ilovepdf.com/pdf_to_excel/');
    await driver.findElement(By.css('input[type="file"]')).sendKeys(PATH_TO_PDF);
    await driver.wait(until.elementsLocated(By.id('processTask')), 5000);
    const uploadButton = driver.findElement(By.id('processTask'));
    await uploadButton.click();

    // console.log()

    await driver.wait(until.elementLocated(By.id('pickfiles')), 5000);
    // await driver.findElement(stuff).getText
    // await driver.wait(until.elementTextIs('Download EXCEL'), 5000)
    // console.log(driver.wait(until.elementIsVisible(driver.findElement(stuff)), 5000))
    // console.log(await driver.wait(until.elementTextIs('Download EXCEL'), 5000))

    // let downloadButton = driver.findElement(stuff)
    // await downloadButton.click()
    // console.log("button:", downloadButton)
    // await driver.close()
    setTimeout(async () => {
      // await driver.close()
      console.log('is closed');
    }, 1000);
  } catch (error) {
    console.log('error:', error);
    // await driver.quit();
  }
}());
