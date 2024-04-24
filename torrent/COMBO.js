const torrentProviders = [
  require("./1337x"),
  require("./nyaaSI"),
  require("./yts"),
  require("./pirateBay"),
  require("./torLock"),
  require("./ezTV"),
  require("./torrentGalaxy"),
  require("./rarbg"),
  require("./kickAss"),
  require("./gloTorrents"),
  require("./magnet_dl"),
  require("./torrentFunk"),
  require("./torrentProject"),
];

async function fetchTorrents(query, page) {
  const comboTorrent = [];
  const timeout = 10000;

  const promises = torrentProviders.map((provider) =>
    Promise.race([
      new Promise((_, reject) =>
        setTimeout(() => {
          reject({ code: 408, message: "Timeout exceeded" });
        }, timeout)
      ),
      new Promise((resolve, _) => resolve(provider(query, page))),
    ])
  );

  await Promise.allSettled(promises)
    .then((comboResult) => {
      comboTorrent.push(
        ...comboResult
          .filter(
            (element) =>
              element.status === "fulfilled" &&
              element.value &&
              element.value.length > 0
          )
          .map((element) => element.value)
      );
    })
    .catch((err) => console.log(err));

  // Flatten the array
  const flattenedTorrents = comboTorrent.flat();

  // Sort by seeders in descending order
  flattenedTorrents.sort((a, b) => b.Seeders - a.Seeders);

  return flattenedTorrents;
}

module.exports = fetchTorrents;
