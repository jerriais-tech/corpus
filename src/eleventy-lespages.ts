import * as fs from "fs";
import * as path from "path";
import { parseFile, AUTHORS } from "./parse";

interface LesPagePluginOptions {
  dir: string;
  outSubDir?: string;
  ignore: string[];
  layout?: string;
}

function eleventyLesPagesJerriaisesPlugin(
  eleventyConfig: Record<string, any>,
  { dir, outSubDir = "lespages", ignore, layout }: LesPagePluginOptions
) {
  const outdir = eleventyConfig.dir.output;

  fs.globSync(path.join(dir, "**/*"))
    // Process HTML files last
    .sort((a, b) => {
      const aPath = path.parse(a);
      const bPath = path.parse(b);
      if (aPath.ext === ".html" && bPath.ext !== ".html") {
        return 1;
      }
      if (aPath.ext !== ".html" && bPath.ext === ".html") {
        return -1;
      }
      return 0;
    })
    .forEach((infile) => {
      if (fs.lstatSync(infile).isDirectory()) {
        return;
      }

      if (ignore.includes(path.relative(dir, infile))) {
        return;
      }

      const outpath = path.parse(infile);
      // if (outpath.name !== "erligion") {
      //   return;
      // }
      outpath.dir = path.join(outSubDir, path.relative(dir, outpath.dir));

      if (outpath.ext === ".html") {
        // Create a virtual template for HTML files
        outpath.ext = ".md";
        outpath.base = `${outpath.name}${outpath.ext}`;

        try {
          const fileContent = fs.readFileSync(infile);
          const { content, data } = parseFile(fileContent, {
            rewriteRelativeUrls:
              outpath.name !== "index" &&
              outpath.name !== outpath.dir.split(path.sep).pop(),
          });
          const outfile = path.format(outpath);
          eleventyConfig.addTemplate(outfile, content, {
            ...data,
            authorPage: Object.keys(AUTHORS).includes(outpath.name),
            layout,
          });
        } catch (error) {
          console.error(`${infile}: ${(error as Error).message}`);
        }
      } else {
        // Copy non-html files to so the image plugin can work
        outpath.dir = path.join(outdir, outpath.dir);
        fs.mkdirSync(outpath.dir, { recursive: true });
        const outfile = path.format(outpath);
        fs.copyFileSync(infile, outfile);
      }
    });
}

export default eleventyLesPagesJerriaisesPlugin;
