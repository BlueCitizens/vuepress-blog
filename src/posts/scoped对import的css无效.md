---
icon: pen-to-square
date: 2020-04-14
category:
  - 前端
tag:
  - Vue
---

# scoped对import的css无效

在vue组件的style中@import了一些css文件，在加了scoped的情况下仍然会在全局生效，直接写或者引入stylus就没有问题。初步研究似乎是一个很怪的特性，不是配置上出了问题。记录一下。
