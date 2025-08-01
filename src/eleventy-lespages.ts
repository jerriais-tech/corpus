import * as fs from "fs";
import * as path from "path";
import { LesPagePluginOptions } from "./types";

import WorkerPool from "./WorkerPool";

async function eleventyLesPagesJerriaisesPlugin(
  eleventyConfig: Record<string, any>,
  options: LesPagePluginOptions
) {
  const outdir = eleventyConfig.directories.output;
  const { dir, ignore, layout } = options;

  const filenames = fs.globSync(path.join(dir, "**/*")).filter((infile) => {
    return (
      !fs.lstatSync(infile).isDirectory() &&
      !ignore.includes(path.relative(dir, infile))
    );
  });

  const assets: string[] = [];
  const pages: string[] = [];
  filenames.forEach((infile) => {
    if (path.parse(infile).ext === ".html") {
      pages.push(infile);
    } else {
      assets.push(infile);
    }
  });

  const workerPool = new WorkerPool();

  // Copy assets to output folder
  await Promise.all(
    assets.map((infile) => workerPool.processFile({ infile, outdir, options }))
  );

  // Create a virtual template for HTML files
  await Promise.all(
    pages.map(async (infile) => {
      const message = await workerPool.processFile({ infile, outdir, options });
      if (message.type === "process") {
        const { outfile, content, authorPage } = message;
        eleventyConfig.addTemplate(outfile, content, {
          authorPage,
          layout,
        });
      }
    })
  );

  workerPool.exit();
}

export default eleventyLesPagesJerriaisesPlugin;
