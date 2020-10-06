const Bundler = require("parcel-bundler");
const path = require("path");

const isBuild = process.env.NODE_ENV === "production";

const runBundleRenderer = async () => {
  const file = path.join(__dirname, "./src/renderer/index.html");

  const options = {
    outDir: "./dist/renderer/",
    outFile: "index.html",
    contentHash: false,
    publicUrl: isBuild ? "./" : "/dist/renderer/",
    target: "browser",
    detailedReport: false,
  };
  const bundler = new Bundler([file], options);
  if (isBuild) {
    const bundle = await bundler.bundle();
  } else {
    const bundle = await bundler.serve();
  }
};

const runBundleMain = async () => {
  const main = path.join(__dirname, "./src/main/index.ts");
  const preload = path.join(__dirname, "./src/preload.ts");
  const options = {
    outDir: "./dist/",
    target: "electron",
    detailedReport: true,
  };
  const bundler = new Bundler([main, preload], options);
  const bundle = await bundler.bundle();
  if (isBuild) {
    process.exit(0);
  }
  const electron = require("electron-connect").server.create({
    path: __dirname,
    stopOnClose: true,
  });
  electron.start();
  bundler.on("buildEnd", () => {
    electron.restart();
  });

  electron.on("stopped", () => process.exit(0));
};

const init = async () => {
  await runBundleRenderer();
  await runBundleMain();
};

init();
