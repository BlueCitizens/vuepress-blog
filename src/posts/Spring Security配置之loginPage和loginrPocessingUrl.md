---
icon: pen-to-square
date: 2021-03-14
category:
  - 后端
tag:
  - Java
  - Spring
---


# Spring Security配置之loginPage和loginrPocessingUrl

spring security配置configure方法下有一项是formLogin，通过此项来配置表单登录/登出。项目中通常会用自定义的登陆页面覆盖默认的页面。本文全面分析了loginPage和loginrPocessingUrl之配置。

先抛一个配置的例子：

```java
.formLogin()
    .loginPage("/login")
    .loginProcessingUrl("/form")
```

则登录入口为login，而前台的表单动作应相应配置为form。

/login提供的静态资源login.html的部分：

```html
<form action="/form" method="post">
    <input name="username" id="name"/>
    <input name="password" id="password"/>
<button type="submit">登录</button>
</form>
```

也就是说，loginProcessUrl并不代表一个真实的接口，登录动作由Spring Security完成。

下面分析其不同的配置组合方式。

------
在不使用自定义的登录页面，即loginPage项缺省时，SpringSecurity会提供自带的登录html页面。
**一旦为loginPage提供自定义参数，就必须使用自定义的页面了，需要有对应的get页面方法和静态资源目录下对应的页面（如static/templates/login.html）。否则会报404，后台也能看到对/login的Get方法是无效的。**

其配置遵循如下规则：

若配置loginPage和loginProcessingUrl均缺省，则都为/login。Spring Security提供自带登陆页面，其中的form标签如下：

```html
<form class="form-signin" method="post" action="/login">
        <h2 class="form-signin-heading">Please sign in</h2>
        <p>
          <label for="username" class="sr-only">Username</label>
          <input type="text" id="username" name="username" class="form-control" placeholder="Username" required="" autofocus="">
        </p>
        <p>
          <label for="password" class="sr-only">Password</label>
          <input type="password" id="password" name="password" class="form-control" placeholder="Password" required="">
        </p>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      </form>
```

可以清楚地看到action为/login，相当于：

**注：这里只是便于理解，缺省与配置存在根本区别，上面提到一旦配置就必须使用自定义的登录页面。实际应用时应不写。**

```
.formLogin()
    .loginPage("/login")
    .loginProcessingUrl("/login")
```

------

若配置了loginProcessingUrl而缺省了loginPage，那么loginPage依然为默认的/login，而loginProcessingUrl为自定义的/loginxx，即实际配置为

```java
.formLogin()
    .loginProcessingUrl("/loginxx")
```

时，依然是由Spring Security提供登录页面，唯一的区别是form表单的action随着配置变更了：

```html
<!-- 注意form标签的action，随着loginProcessingUrl而变 -->
<form class="form-signin" method="post" action="/loginxx">
        <h2 class="form-signin-heading">Please sign in</h2>
        <p>
          <label for="username" class="sr-only">Username</label>
          <input type="text" id="username" name="username" class="form-control" placeholder="Username" required="" autofocus="">
        </p>
        <p>
          <label for="password" class="sr-only">Password</label>
          <input type="password" id="password" name="password" class="form-control" placeholder="Password" required="">
        </p>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      </form>
```
也就相当于作了如下配置（**依然只是便于理解**）：

```java
.formLogin()
    .loginPage("/login")
    .loginProcessingUrl("/loginxx")
```

------

若主动配置了loginPage，此时就会启用自定义的登录页面。需要有对应的资源接口，例如通过Controller：

```java
    @GetMapping({"login","/"})
    public String getLogin() {
        //返回html页面
        return "login";
    }
```

若loginProcessingUrl缺省，loginProcessingUrl将默认与loginPage保持一致，此时自定义的表单动作可以缺省，或者与loginPage相同即可，并声明为post。即

```java
.formLogin()
    .loginPage("/cuntomLogin")
```

```html
<form method="post">
<!-- 表单内容 -->
</form>
```

或者

```html
<form action="/customLogin" method="post">
<!-- 表单内容 -->
</form>
```
经过实际测试都是可以的。

相应地，若同时配置了loginPage和loginProcessingUrl，则表单中的action不可缺省其必须与配置保持一致。若仅仅声明post则会报post错误，

```
HttpRequestMethodNotSupportedException: Request method 'POST' not supported
```

若全部缺省则不会有任何动作。

正确的配置例子如下：
```java
.formLogin()
    .loginPage("/loginxx")
    .loginProcessingUrl("/loginyy")
```

```html
<form action="/loginyy" method="post">
<!-- 表单内容 -->
</form>
```

此时两个参数都是自定义的，登录入口为loginxx，登录动作为loginyy。

## 总结

其实一句话就能搞清楚：**不能配置不存在的东西，要么交给Spring Security自己完成，要么都用自己的。配置和资源是一一对应的关系，要么都缺要么都写**。唯一的例外就是仅配置loginProcessingUrl的情况，Spring Security会自动完成登录页面的配置。

但追根溯源，是由于loginPage的配置与否决定的。loginProcessingUrl本身就不是一个实际的资源接口，改变这个url仅仅是给一个抽象行为变更姓名，用户信息检查动作仍然由Spring Security完成。而loginPage是资源接口，需要有对应的controller响应请求返回静态资源。一旦配置，登录页面就从自动化部署中解放了出来，获得了更多定制的可能性，此时开发人员掌握一定程度的优先权。