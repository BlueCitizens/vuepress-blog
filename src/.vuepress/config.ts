import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "BCkun's BLOG",
  description: "BC君的个人博客",
  
  extendsMarkdownOptions: (markdownOptions, app) => {
    if (markdownOptions.headers === false) return
    markdownOptions.headers ??= {}
    if (markdownOptions.headers.level) return
    markdownOptions.headers.level = [2, 3, 4, 5, 6]
  },

  theme,

  


  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
