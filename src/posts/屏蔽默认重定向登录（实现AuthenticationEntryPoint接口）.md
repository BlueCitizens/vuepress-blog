---
icon: pen-to-square
date: 2021-03-16
category:
  - 开发
tag:
  - Java
  - Spring
---

# 屏蔽默认重定向登录（实现AuthenticationEntryPoint接口）

默认配置下Spring Security会保护所有资源接口，匿名用户将被强制转发到login接口。有时我们并不需要使用默认的登录接口，尤其需要实现前后端分离时。

1、实现AuthenticationEntryPoint接口

```java
/**
 * @Author: BlueCitizens
 * @Date: 2021/3/13 22:04
 * @Description: AuthenticationEntryPoint处理匿名用户访问无权限资源时的异常（未登录，登录状态过期失效等）
 */
@Component
@Slf4j
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint, Serializable {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException e) throws IOException, ServletException {
        log.error("Unauthorized access: \ncurrent IP:{}\nrequest URI :{}\n", IpUtils.getIpAddr(request), request.getRequestURI());
        String msg = StringUtils.format("Unauthorized access：{}，Authentication failed, unable to access system resources ", request.getRequestURI());
        ServletUtils.renderString(response, JSON.toJSONString(AjaxResult.error(HttpStatus.UNAUTHORIZED, msg)));
    }
}
```

2、注入SecurityConfig

```java
@Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                // 认证失败处理类
                .exceptionHandling()
                .authenticationEntryPoint(authenticationEntryPoint)//访问无权限资源时的异常处理
```

此时再调用未授权的接口就会直接返回错误信息给前台处理。