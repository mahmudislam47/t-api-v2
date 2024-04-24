const cors = require("cors");
const express = require("express");
const combo = require("./torrent/COMBO");
const websiteFunctions = {
  "1337x": torrent1337x = require("./torrent/1337x") ,
  "yts": yts  = require("./torrent/yts"),
  "eztv": ezTV  = require("./torrent/ezTV"),
  "torlock": torLock = require("./torrent/torLock"),
  "piratebay": pirateBay = require("./torrent/pirateBay"),
  "tgx": torrentGalaxy  = require("./torrent/torrentGalaxy"),
  "rarbg": rarbg  = require("./torrent/rarbg"),
  "kickass": kickAss = require("./torrent/kickAss") ,
  "glodls": glodls  = require("./torrent/gloTorrents"),
  "magnetdl": magnet_dl  = require("./torrent/magnet_dl"),
  "torrentfunk": torrentFunk = require("./torrent/torrentFunk"),
  "nyaasi": nyaaSI  = require("./torrent/nyaaSI"),
  "torrentproject": torrentProject = require("./torrent/torrentProject"),
};
const app = express();
app.use(cors());

app.use("/api/:website/:query/:page?", (req, res) => {
  let website = req.params.website.toLowerCase();
  let query = req.params.query;
  let page = req.params.page;

  function handleWebsite(res, website, query, page) { // Remove the 'res' parameter
    const websiteFunction = websiteFunctions[website];

    if (!websiteFunction) {
      return res.json({
        error: "Please select a valid website",
      });
    }
    websiteFunction(query, page).then((data) => {
      if (data === null) {
        return res.json({
          error: "Website is blocked. Change IP or try again later.",
        });
      } else if (data.length === 0) {
        return res.json({
          error: `No search result available for query (${query})`,
        });
      } else {
        return res.send(data);
      }
    });
  }

  if (website === "all") {
    combo(query, page).then((data) => {
      if (data !== null && data.length > 0) {
        return res.send(data);
      } else {
        return res.json({
          error: `No search result available for query (${query})`,
        });
      }
    });
  } else {
    // Pass 'res' as a parameter to 'handleWebsite'
    handleWebsite(res, website, query, page);
  }
});

app.use("/", (req, res) => {
  res.send("<h1>Welcome to Unoffical Torrent API</h1>");
});

console.log("Listening on PORT : ", 3000);
app.listen(3000);
