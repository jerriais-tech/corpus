import * as fs from "fs";
import * as path from "path";
import { parseFile, AUTHORS } from "./parse";
import type { ProcessFileRequestMessage, ResponseMessage } from "./types";

function processFile({
  id,
  infile,
  outdir,
  indir,
}: ProcessFileRequestMessage): ResponseMessage {
  const outpath = path.parse(infile);
  outpath.dir = path.relative(indir, outpath.dir);

  if (outpath.ext === ".html") {
    // Create a virtual template for HTML files
    outpath.dir = path.join("corpus/jerriais", outpath.dir);
    outpath.ext = ".md";
    outpath.base = `${outpath.name}${outpath.ext}`;

    const fileContent = fs.readFileSync(infile);
    const { content, data } = parseFile(fileContent, {
      rewriteRelativeUrls:
        outpath.name !== "index" &&
        outpath.name !== outpath.dir.split(path.sep).pop(),
    });
    const outfile = path.format(outpath);
    return {
      id,
      ...data,
      outfile,
      content,
      authorPage: Object.keys(AUTHORS).includes(outpath.name),
      related: data.related.map(({ url, text }: Record<string, string>) => ({
        url: `/${path.join(outpath.dir, outpath.name, url)}`,
        text,
      })),
      type: "process",
    };
  } else {
    // Copy non-html files to so the image plugin can work
    outpath.dir = path.join(outdir, "corpus", outpath.dir);
    fs.mkdirSync(outpath.dir, { recursive: true });
    const outfile = path.format(outpath);
    fs.copyFileSync(infile, outfile);
    return { id, type: "copy" };
  }
}

process.on("message", (message: ProcessFileRequestMessage) => {
  const result = processFile(message);
  if (result) {
    process.send?.(result); // Send a message back to the parent
  }
});

process.on("error", function (err) {
  if (err.code == "EPIPE") {
    process.exit(0);
  }
});
