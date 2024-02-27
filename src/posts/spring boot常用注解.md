---
icon: pen-to-square
date: 2021-04-17
category:
  - 开发
tag:
  - Java
  - Spring
---

# spring boot常用注解

## @PathVariable

@PathVariable 映射 URL 绑定的占位符

带占位符的URL是Spring3.0的新特性，该功能在SpringMVC向REST目标挺进发展过程中具有里程碑的意义
通过@PathVariable可以将URL中占位符参数绑定到控制器处理方法的入参中：URL 中的 {xxx} 占位符可以通过@PathVariable("xxx") 绑定到操作方法的入参中。

```java
@RequestMapping("/test/{id}")
    public String test(@PathVariable("id") Integer testId)
    {
        return "sucess";
    }
```

------

## @Validated

Spring注解之@validated的使用

https://www.cnblogs.com/liaojie970/p/9036349.html

------

## @Component

当我们在一个类中使用@Autowired等Spring注解时，需要使用到@Component或其扩展注解。如果不用该注解或其扩展注解，则Spring会返回一个错误，指出找不到该类的bean。

```java
@Component
//元注解，把普通pojo实例化到spring容器中

@Controller
//控制器（注入服务），用于标注控制层

@Service
//服务（注入dao）用于标注服务层，主要用来进行业务的逻辑处理

@Repository
//（实现dao访问）用于标注数据访问层，也可以说用于标注数据访问组件，即DAO组件

/**
* 使用@Component,@Service,@Controller,@Repository注解的类，表示
* 把这些类纳入到spring容器中进行管理,同时也是表明把该类标记为
* Spring容器中的一个Bean。
*/
```

```java
<context:component-scan base-package="com.mmnc">

//该配置项明确了Spring扫描包的范围，包括这个包及其含有的子包中被@Component和它的扩展注释的类，将它们扫描进Spring容器并注入成Bean
```

事实上，一旦我们正在写的类调用了含有Spring注解的类，例如我在实现类中用到了@Autowired注解声明一个接口实现类，也就表明了被注解的类是从Spring容器中取出的，则调用的类也需要接受Spring容器管理。如果我们不知道应该用什么来注解该类，就可以使用@Component来注解。

如何取出Bean：https://blog.csdn.net/lycyl/article/details/82865009

初始化和销毁：https://blog.csdn.net/thinkingcao/article/details/71171222

------

## Lombok插件 @Data精简实体类代码

- @Data : 注解在类上, 为类提供读写属性, 此外还重写了 equals()、hashCode()、toString() 方法，也提供了默认无参构造函数，但不提供序列化操作

```java
//Equivalent to {@code @Getter @Setter @RequiredArgsConstructor @ToString @EqualsAndHashCode}
```

- @Getter/@Setter : 注解在类上, 为类提供读写属性
- @ToString : 注解在类上, 为类提供 toString() 方法
- @Slf4j : 注解在类上, 为类提供一个属性名为 log 的 log4j 的日志对象
- @Log4j : 注解在类上, 为类提供一个属性名为 log 的 log4j 的日志对象

*更常用的是 Slf4j 来做日志：*

[为什么使用 SLF4J 而不是 Log4J 来做 Java 日志 
(Why use SLF4J over Log4J for logging in Java) ](https://www.oschina.net/translate/why-use-sl4j-over-log4j-for-logging)