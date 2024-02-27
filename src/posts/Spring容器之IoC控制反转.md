---
icon: pen-to-square
date: 2021-04-14
category:
  - 开发
tag:
  - Java
  - Spring
---

# Spring容器之IoC控制反转

## 控制反转 IoC Inversion of Control

IoC属于面向对象编程的设计原则，其目的是降低代码间的耦合度。

最常见的IoC方式是依赖注入DI（Dependency Injection）。*还有一种叫做依赖查找Dependency Lookup*。以DI为例，IoC是如何体现解耦的呢？

“通过控制反转，对象在被创建的时候，由一个调控系统内所有对象的外界实体将其所依赖的对象的引用传递给它。也可以说，依赖被注入到对象中。”[百度百科-控制反转](https://baike.baidu.com/item/%E6%8E%A7%E5%88%B6%E5%8F%8D%E8%BD%AC/1158025)

这句话简单来说，对象在创建时，它依赖的其他对象并不是由他自己内部的代码创建，而是某个外部的控制中心传递给他。举个例子，传统的面向对象编程中，倘若需要在一个类中使用另一个类的公开成员，需要在类中显式声明被调用类的对象。

```java
//A调用B的方法test
class A{
    B b = new B();
    
    b.test();
}

class B{
    public String test(){
        return "ok";
    }
}
```

存在明显的类与类之间的耦合。在不引入依赖注入的情况下，很难消除这种耦合，在A使用B的过程中，代码执行不可避免地将推进到new操作。

而采用依赖注入技术之后，A的代码只需要在内部定义一个私有的B对象（仅仅是声明一个对象而不去初始化它并不形成耦合），通过容器控制程序将B对象在外部new出来并注入到A类里的引用中，而不需要进一步new来获得这个对象，从而剔除了代码的耦合部分。

    至于具体获取的方法、对象被获取时的状态由设置该容器的配置文件来声明，容器依据配置文件在需要的时候建立依赖关系，把被调用的接口实现并注入到目标类中。由IoC容器来管理对象的生命周期、依赖关系等，从而使得应用程序的配置和依赖性规范与实际的应用程序代码分离。其中一个特点就是通过文本的配置文件进行应用程序组件间相互关系的配置，而不用重新修改并编译具体的代码。Spring容器也引入了相关机制。

## Spring的@Autowired注解

@Autowired注释可以对类的成员变量、方法及构造函数进行标注，指定Spring IoC为他们完成自动装配的工作。*通过@Autowired的使用来消除 set ，get方法*。

一个简单的例子：

```java
class A{
    @Autowired
    B b;
    
    b.test();
}

interface BInterface{
    String test();
}

class B implements BInterface{
    public String test(){
        return "ok";
    }
}
```

通过注解告知IoC处理程序对象B需要自动装配，调用test()时，从IoC程序就去容器中去查询对应的Bean。

## @Autowired实现原理

引入的包位置如下：
```
org.springframework.beans.factory.annotation.Autowired
```
在同一个目录annotation下有一个名为AutowiredAnnotationBeanPostProcessor的类（AutowiredAnnotation后置处理器）。在Spring IoC启动时，会自动装载该处理器并在容器扫描到@Autowired注解时，在容器中查找需要的Bean。

此时bean factory的getBean方法，一旦该方法调用，查找到该Bean则直接返回，若不存在就实例化该Bean并装配，也就是无论当前是否存在，总会返回一个bean实例。而了解另一个注解@Component就会知道，Spring开始执行Bean的实例化的时机就是组件扫描完成之后。在实例化和装配过程中，容器会多次递归调用getBean方法来保证充分解决类之间的依赖问题。这是一个复杂但万无一失的过程。

## @Autowired在几种不同情况下的作用

https://blog.csdn.net/u013257679/article/details/52295106

## @Qualifier和@Resource

有时候，我们为了向上提供不同的业务，需要多次实现服务接口service类。这就就会存在实现它的多个Impl类，要如何区分他们呢？

除了直接使用特定实现类本身来声明，也可以使用@Qualifier注解（适格者）或@Resource来实现相同的效果。

```java
//在@Service注解里带上名字
@Service("specifiedServiceImpl")
public class SpecifiedServiceImpl implements SpecifiedService{
    /* ...... */
}

@Autowired
SpecifiedServiceImpl specifiedServiceImpl;

//或者

@Autowired
@Qualifier("specifiedServiceImpl")
SpecifiedService specifiedService;

//或者

@Autowired
@Resource(name="specifiedServiceImpl")
SpecifiedService specifiedService;
```

## Quote

IoC:

[浅谈IOC--说清楚IOC是什么](https://blog.csdn.net/ivan820819/article/details/79744797)

@Autowired:

[@Autowired用法详解](https://www.cnblogs.com/fnlingnzb-learner/p/9723834.html)

[@Autowired用法详解](https://blog.csdn.net/u013257679/article/details/52295106)