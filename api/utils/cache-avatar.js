import https from "node:https";
import fs from "fs";

function getImage(url, filename) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        res.pipe(fs.createWriteStream(filename));
        res.on("end", () => {
          resolve();
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

export default async function cacheAvatar(username, avatar) {
  const staticPath = process.env.STATIC_PATH || "";
  const path = `${staticPath}avatars/${username}.png`;
  await getImage(
    `https://www.avatarsinpixels.com/minipix/${avatar}/2/show.png`,
    path
  );
  return path;
}
