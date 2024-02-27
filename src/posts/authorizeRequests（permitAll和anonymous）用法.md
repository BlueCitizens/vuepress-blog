---
icon: pen-to-square
date: 2021-03-15
category:
  - 后端
tag:
  - Java
  - Spring
---

# authorizeRequests（permitAll和anonymous）用法

```java
.authorizeRequests()

//**为通配符

.antMatchers("/captchaImage", "/websocket/**").anonymous()

.antMatchers("/user/**").permitAll()
```

anonymous() 允许匿名用户（不带身份信息，即未登录）访问。**不允许已包含身份信息（即已登录）的用户访问!**

permitAll() 接受匿名用户或持有身份信息的请求，且不校验权限，无条件授权。**不管登入,不登入 都能访问！**

也就是说，anonymous要比permitAll严格,anonymous仅授权给未登录用户的访问权限。但在这两种情况下,默认都会创建一个HttpSession对象。这只是一种由Spring Security提供的管理权限的方法，而并不是为了区分两种用户。

*permitAll(): Always evaluates to true*

*isAnonymous():  Returns true if the current principal is an anonymous user*

*文档中对这种设计作出了解释，并称之为匿名访问。*

<details>
<summary>documentation：</summary>
<pre><code>

It’s generally considered good security practice to adopt a “deny-by-default” where you explicitly specify what is allowed and disallow everything else. Defining what is accessible to unauthenticated users is a similar situation, particularly for web applications. Many sites require that users must be authenticated for anything other than a few URLs (for example the home and login pages). In this case it is easiest to define access configuration attributes for these specific URLs rather than have for every secured resource. Put differently, sometimes it is nice to say ROLE_SOMETHING is required by default and only allow certain exceptions to this rule, such as for login, logout and home pages of an application. You could also omit these pages from the filter chain entirely, thus bypassing the access control checks, but this may be undesirable for other reasons, particularly if the pages behave differently for authenticated users.

This is what we mean by anonymous authentication.

Note that there is no real conceptual difference between a user who is “anonymously authenticated” and an unauthenticated user. Spring Security’s anonymous authentication just gives you a more convenient way to configure your access-control attributes.
</code></pre>
<pre><code>
一般认为，采用 "默认拒绝 "的方式是一种很好的安全做法，即明确规定什么是被允许的，而不允许其他一切。定义未经认证的用户可以访问的内容也是类似的情况，特别是对于网络应用。许多网站要求用户必须对除少数URL（例如主页和登录页面）以外的任何内容进行认证。在这种情况下，为这些特定的URL定义访问配置属性是最简单的，而不是为每个安全资源定义。换句话说，有时说 ROLE_SOMETHING 是默认需要的，而只允许某些例外，例如应用程序的登录、注销和主页。你也可以将这些页面从过滤链中完全省略掉，从而绕过访问控制检查，但由于其他原因，这可能是不可取的，特别是如果这些页面对已认证用户的行为有所不同。

这就是我们所说的匿名认证的意思。

请注意，"匿名认证 "的用户和未认证的用户在概念上并没有真正的区别。Spring Security的匿名认证只是给你提供了一个更方便的方式来配置你的访问控制属性。
</code></pre>
</details>

https://www.icode9.com/content-1-519203.html

### 记录一个报错信息

```
nested exception is java.lang.IllegalStateException: Can't configure antMatchers after anyRequest
```

使用SpringSecurity配置http顺序错误，不能在anyRequest()之后再配置permitAll()，
anyRequest()必须是最后一个

https://blog.csdn.net/liurui50/article/details/109495323