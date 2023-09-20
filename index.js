const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const port = 56189;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/now-playing", async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(
      "https://indie88.com/wp-content/themes/indie88/inc/streamon.php"
    );

    await page.waitForSelector(".cobrp-ticker-info", { timeout: 180000 });

    const grabNowPlayingInfo = await page.evaluate(() => {
      const nowPlayingElement = document.querySelector(".cobrp-ticker-info");
      const artistElement = nowPlayingElement.querySelector(".cobrp-ticker-artist");
      const songElement = nowPlayingElement.querySelector(".cobrp-ticker-songtitle");

      const artistText = artistElement ? artistElement.textContent.trim() : "";
      const songText = songElement ? songElement.textContent.trim() : "";

      return `${artistText} - ${songText}`;
    });

    await browser.close();

    res.send(grabNowPlayingInfo);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});