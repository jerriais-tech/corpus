import * as fs from "fs";
import * as path from "path";
import { LesPagePluginOptions } from "./types";

import WorkerPool from "./WorkerPool";

const assetDir = "lespages/members.societe-jersiaise.org/geraint";
const dir = "lespages/members.societe-jersiaise.org/geraint/jerriais";

async function eleventyLesPagesJerriaisesPlugin(
  eleventyConfig: Record<string, any>,
  options: LesPagePluginOptions
) {
  const outdir = eleventyConfig.directories.output;
  const { ignore, layout } = options;

  const assets = fs.globSync(path.join(assetDir, "**/*")).filter((infile) => {
    return (
      !fs.lstatSync(infile).isDirectory() &&
      !ignore.includes(path.relative(dir, infile)) &&
      path.parse(infile).ext !== ".html"
    );
  });

  const pages = fs.globSync(path.join(dir, "**/*")).filter((infile) => {
    return (
      !fs.lstatSync(infile).isDirectory() &&
      !ignore.includes(path.relative(dir, infile)) &&
      path.parse(infile).ext === ".html"
    );
  });

  const workerPool = new WorkerPool();

  // Copy assets to output folder
  await Promise.all(
    assets.map((infile) =>
      workerPool.processFile({ infile, outdir, indir: assetDir })
    )
  );

  // Create a virtual template for HTML files
  await Promise.all(
    pages.map(async (infile) => {
      const message = await workerPool.processFile({
        infile,
        outdir,
        indir: dir,
      });
      if (message.type === "process") {
        const { outfile, content, id, type, ...data } = message;
        eleventyConfig.addTemplate(outfile, content, {
          ...data,
          layout,
        });
      }
    })
  );

  workerPool.exit();
}

export default eleventyLesPagesJerriaisesPlugin;
