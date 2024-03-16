import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "文章",
    // icon: "pen-to-square",
    children: [
      { text: "时间轴", icon: "timeline", link: "/timeline/"},
      {
        text: "时光机",
        icon: "pen-to-square",
        prefix: "/posts/随笔/",
        children: [
          { text: "博客的意义是什么？", icon: "pen-to-square", link: "博客的意义是什么？" },
          { text: "20年生日时的我", icon: "pen-to-square", link: "Forever 21 —— 生日快乐，我" },
        ],
      },
    ],
  },
  {
    text: "About Me",
    // icon: "circle-info",
    link: "/intro",
  },
  {
    text: "BCkun Index",
    // icon: "circle-info",
    link: "https://bckun.top",
  },
]);
