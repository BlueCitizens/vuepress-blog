---
# cover: /assets/images/cover2.jpg
icon: pen-to-square
date: 2020-04-15
category:
  - 前端
tag:
  - JavaScript
star: false
sticky: false
---

# 纯js实现视觉差效果

给博客背景加了点视觉差效果，让观感更灵动一些。其实就是让背景和其他元素的滚动速度和幅度有一些区别。
* *因为是在vue中做的，语法可能略有不同，思路是一致的*
首先找一张背景图，最好高一些。加一下background的样式，或者直接用dom嗯塞，我就是嗯塞，不是个好习惯：
```key
// 添加body图片
setBodyBackGround() {
    document.body.style.backgroundImage = this.bodyBgImage;
    document.body.style.backgroundRepeat = 'repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundSize = '65%';
    document.body.style.backgroundPosition = 'center 0';
    document.body.style.backgroundColor = 'rgba(255, 255, 255,1)';//如果背景图有透明的部分，可以调整一下背景色
    document.body.style.position = 'relative';
}
```
size和水平position根据自己的需要调整。纵向位置最好为0，否则记得后面也需要做相应变动。
这里实现视觉差的方式同样是通过监听滚动事件，调整不同元素的滚动距离，实现“不同步滚动”的效果。这种方法兼容性比较好。新特性IntersectionObserver兼容性不太理想。有空可以尝试。
首先写个函数，用来给scroll事件绑定监听。
* *this.scrollTop相当于是一个全局变量，js中直接在外面var一个就好了*
```javascript
getScroll(){
    let newTop = document.documentElement.scrollTop || document.body.scrollTop; //解决兼容性
    let height = document.documentElement.scrollHeight;
    let cli_height = document.documentElement.clientHeight;
    if (newTop > this.scrollTop || newTop < this.scrollTop) {
        this.scrollTop = newTop;
        document.body.style.backgroundPositionY = '-' + Math.round(this.scrollTop / height * cli_height * 10000) / 10000 + 'px';
    }
}
```
监听一下事件
```javascript
window.addEventListener('scroll', this.getScroll);
```
到这里已经基本达到我们需要的效果了，其他都可以自己定制。
但是还有一些遗留问题，例如性能不佳，画面不流畅。后面逐一解决，先简单解释一下实现思路。
先获取几个值：
```javascript
let newTop = document.documentElement.scrollTop || document.body.scrollTop; //兼容性
let height = document.documentElement.scrollHeight;
let cli_height = document.documentElement.clientHeight;
```
通俗易懂的几个属性，注意这里都是针对根节点 < html > ，即document.documentElement.xx
**scrollTop**：已滚动高度，从页面顶端到视野顶端的距离，初值0，也就是网页滚动到顶部时是0。*这里同时处理了IE/Edge浏览器的兼容性，目前只能通过body节点获取scrollTop。*
```javascript
let newTop = document.documentElement.scrollTop || document.body.scrollTop; //兼容性
//相当于
let userAgent = navigator.userAgent;
if (userAgent.indexOf("IE") > -1 || userAgent.indexOf("Edge") > -1){
    let newTop = document.body.scrollTop;
}else{
    let newTop = document.documentElement.scrollTop;
}
```
**scrollHeight**：当前页面完整的可滚动高度，可以理解为展示当前页面中所有元素所需的高度。在不改变任何比例和长度的情况下，无论滚动到哪里这个值是固定的。
**clientHeight**：浏览器可视区域的高度，当改变浏览器视窗高度时，这个值随之改变。
不理解的话，写个函数在控制台打印，观察数值的变化。
全局变量scrollTop保存了当前的已滚动高度，scroll事件触发时，高度更新，比较变量中前一时刻的scrollTop的值，就可以得出是否滚动以及滚动的方向。最后还需要将这个变量的值更新，为下一次scroll事件准备。
随便写个式子计算一下，让背景的移动变慢一些或者快一些，符合你的想法就行：
```javascript
document.body.style.backgroundPositionY = '-' + Math.round(this.scrollTop / height * cli_height * 10000) / 10000 + 'px';
```
现在解决性能和视觉效果问题。实际应用时发现，滚动时页面卡顿比较严重，而且移动的视觉效果不是很理想。监听scroll事件是情非得已，我们仍然不希望它不断地被触发占用资源。因此通过类似节流的方法解决这个问题。
节流简单来说就是让一个函数在一段时间内只执行一次，或者说间隔特定时间执行一次。最简单的方法就是写一行setTimeout。这里不作赘述。
另外，并不需要在每次触发时都计算高度，移动背景，可以设置一个间隔的距离。
```javascript
if (newTop > this.scrollTop + 50 || newTop < this.scrollTop - 50) { //每隔50px移动一次
    this.scrollTop = newTop;
    document.body.style.backgroundPositionY = '-' + Math.round(this.scrollTop / height * cli_height * 10000) / 10000 + 'px';
}
```
但是这样出来的效果是很僵硬的，背景在一段一段的瞬移，我们还是希望看到连贯的效果，所以加上transition
```javascript
    document.body.style.transition = 'background-position 1.8s ease-out';
```
这样就能得到一个比较平滑而灵动，带有悬浮感的视觉差效果。
