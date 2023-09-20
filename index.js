import express from "express";
import axios from "axios";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Substitua 'YOUR_BROWSERLESS_API_KEY' pela sua chave de API do Browserless
const browserlessApiKey = '9883aff7-00df-4cef-a4e2-e583303a1975';
const browserlessEndpoint = `https://your-browserless-url.com?key=${browserlessApiKey}`;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/now-playing", async (req, res) => {
  try {
    const response = await axios.get(`${browserlessEndpoint}/goto`, {
      params: {
        url: "https://indie88.com/wp-content/themes/indie88/inc/streamon.php",
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to load the page");
    }

    const nowPlayingInfo = await axios.get(`${browserlessEndpoint}/evaluate`, {
      params: {
        expression: `
          const nowPlayingElement = document.querySelector(".cobrp-ticker-info");
          const artistElement = nowPlayingElement.querySelector(".cobrp-ticker-artist");
          const songElement = nowPlayingElement.querySelector(".cobrp-ticker-songtitle");

          const artistText = artistElement ? artistElement.textContent.trim() : "";
          const songText = songElement ? songElement.textContent.trim() : "";

          artistText + " - " + songText;
        `,
      },
    });

    res.send(nowPlayingInfo.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

