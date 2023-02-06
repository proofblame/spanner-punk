const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');


(async function ILovePDF() {
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
  const PATH_TO_PDF = "C:/Users/MarokkoTV/Desktop/src/spanner-punk/pdf/456.pdf"
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    await driver.get("https://www.ilovepdf.com/pdf_to_excel/")
    console.log("isLoaded", await driver.get("https://www.ilovepdf.com/pdf_to_excel/"))
    await delay(1000)
    await driver.findElement(By.css('input[type="file"]')).sendKeys(PATH_TO_PDF)
    await driver.wait(until.elementsLocated(By.id("processTask")), 5000)
    let uploadButton = driver.findElement(By.id("processTask"))
    await uploadButton.click()


    // console.log()
    await driver.manage().setTimeouts({ implicit: 10000 })
    await driver.wait(until.elementLocated(By.id("pickfiles")), 20000, 'Timed out after 20 seconds', 4000)

    async function titleFC() {
      const res = await driver.getTitle()
      console.log(res === "Download file | iLovePDF")
      if (res !== "Download file | iLovePDF") {
        setTimeout(async () => {
          titleFC()
        }, 1000)
      } else {
        await driver.wait(until.elementLocated(By.id("pickfiles")))
        let downloadButton = await driver.findElement(By.id("pickfiles"))
        await downloadButton.click()
        console.log("click")
      }

    }
    titleFC()


    // console.log('title=', res === "Download file | iLovePDF")


    //
    //
    //  await driver.wait(until.elementIsVisible(downloadButton))
    // console.log("downloadButton:", downloadButton)
    // await downloadButton.click()





    // setTimeout(async function() {
    //   await driver.close()
    //   console.log('is closed')
    // }, 1000);
  }
  catch (error) {
    console.log("error:", error)
    await driver.quit();
  }
})()
