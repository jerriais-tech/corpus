import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import { program } from "commander";
import { stringify } from "yaml";

import { parseFile } from "./parse";

program
  .name("pages-to-md")
  .description("CLI to convert Les Pages Jèrriaises into Markdown files")
  .version("0.0.1");

program
  .command("one")
  .description("Convert one HTML file into Markdown")
  .argument("<string>")
  .argument("<string>")
  .action((infile: string, outfile: string) => {
    const fileContent = fs.readFileSync(infile);

    const { content, data } = parseFile(fileContent);
    fs.writeFileSync(
      outfile,
      ["---", stringify(data), "---", content].join("\n")
    );
  });

const SKIP = ["0", "verbconj.html", "verbconj2.html", "verbconj3.html"];

program
  .command("all")
  .description("Convert every HTML file in a directory into Markdown")
  .argument("<string>")
  .argument("<string>")
  .action((indir: string, outdir: string) => {
    fs.globSync(path.join(indir, "**/*")).forEach((infile) => {
      if (fs.lstatSync(infile).isDirectory()) {
        return;
      }

      const outpath = path.parse(infile);
      outpath.dir = path.join(
        outdir.replace(/\/$/, ""),
        path.relative(indir, outpath.dir)
      );

      if (SKIP.includes(outpath.base)) {
        return;
      }

      fs.mkdirSync(outpath.dir, { recursive: true });

      if (outpath.ext === ".html") {
        outpath.ext = ".md";
        outpath.base = `${outpath.name}${outpath.ext}`;
        const outfile = path.format(outpath);

        console.log(`Parsing ${infile}`);

        try {
          const content = fs.readFileSync(infile);
          const $ = cheerio.load(content);

          const markdown = parseFile($);
          fs.writeFileSync(outfile, markdown);
        } catch (error) {
          console.error(`${infile}: ${(error as Error).message}`);
        }
      } else {
        const outfile = path.format(outpath);
        console.log(`Copying ${infile}`);
        fs.copyFileSync(infile, outfile);
      }
    });
  });

program.parse();
