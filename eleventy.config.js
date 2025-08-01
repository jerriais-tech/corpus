import "tsx/esm";
// import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { renderToStaticMarkup } from "react-dom/server";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

const eleventyLesPageJerriaisesPlugin = (
  await import("./src/eleventy-lespages")
).default;

/** @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.setQuietMode(true);
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.setInputDirectory("content");
  eleventyConfig.setLayoutsDirectory("../layouts");

  // eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
  //   failOnError: false,
  //   formats: ["auto"],
  //   widths: ["auto"],
  //   urlPath: "/img",
  // });

  eleventyConfig.addPlugin(eleventyLesPageJerriaisesPlugin, {
    dir: "lespages/members.societe-jersiaise.org/geraint",
    ignore: [
      "jerriais/0",
      "jerriais/verbconj.html",
      "jerriais/verbconj2.html",
      "jerriais/verbconj3.html",
      "jerriais/index.html",
      "jerriais/assembliee.html",
      "jerriais/noue.html",
      "dolmens/dolmens.html",
      "helier.html",
      "statues/stones.html",
      "jerriais.html",
    ],
    layout: "layout.11ty.tsx",
  });

  eleventyConfig.addTemplateFormats("11ty.tsx");
  eleventyConfig.addExtension(["11ty.tsx"], {
    key: "11ty.js",
    compile: function () {
      return async function (data) {
        let content = await this.defaultRenderer(data);
        return `<!DOCTYPE html>${renderToStaticMarkup(content)}`;
      };
    },
  });

  eleventyConfig.addTemplateFormats("css");

  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async function (inputContent, inputPath) {
      return async (data) => {
        const result = await postcss([tailwindcss()]).process(inputContent, {
          from: inputPath,
          to: data.page.outputPath,
        });

        return result.css;
      };
    },
  });
}
