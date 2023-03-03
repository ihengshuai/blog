---
title: Typescript装饰器指南
description: 这是一篇Typescript装饰器使用指南,教大家理解什么装饰器,装饰器的作用
head:
  - - meta
    - name: keywords
      content: Typescript装饰器,ts装饰器,装饰器,类装饰器,参数装饰器,属性装饰器,方法装饰器,访问装饰器,装饰器模式,设计模式,Typescript Decorator
---

# Typescript装饰器指南

>Typescript装饰器模式，可以有效的提高开发效率，就像Java那种注解；装饰器让TypeScript的世界更好。 我们使用的许多库都基于这一强大特性构建, 例如[Angular](https://angular.io/)和[Nestjs](https://nestjs.com/)。 在这文章中我将介绍装饰器和它的许多细节。 我希望在读完这篇文章后，你可以理解何时和如何使用这一强的的特性。

## 概念

装饰器本身就是一种特殊的函数，被用于类的各个属性（类本身、类属性、类方法、类访问器、类方法的参数），装饰器就像高阶函数一样，对目标做了一层中间操作，可以很简洁的无痛修改一些功能和做一些有趣的功能

一个小例子：

```tsx
// 日志打印
function logger(key: string): any {
  return function () {
    console.log("call: \t\t", key);
  };
}

class HTTP {
  @logger("get")
  static get(url?: string) {
    return url;
  }
}
HTTP.get();  // 打印 call: get
```

## 装饰器类别

前面说了装饰器主要是用于类中，所以就有类、类方法、类属性、类访问器属性、类方法参数装饰器，接下来我们就一个个介绍

在介绍装饰器前，先介绍个工具库，在装饰器中反射往往发挥着很大作用，`reflect-metadata`库通常在装饰器中都会使用，接下来介绍下其基本作用

## Reflect-metadata(元数据)

严格地说，元数据和装饰器是EcmaScript中两个独立的部分。 然而，如果你想实现像是[反射](https://zh.wikipedia.org/wiki/%E5%8F%8D%E5%B0%84_(%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6))这样的能力，你总是同时需要它们。有了[reflect-metadata](https://github.com/rbuckton/reflect-metadata)的帮助， 我们可以获取编译期的类型。  
借助`reflect-metadata`，编译器可以拿到的类型有三种：

- `design:type`：属性类型
- `design:paramtypes`：方法的参数类型
- `design:returntypes`：方法返回值的类型

这三种方式拿到的结果都是构造函数（例如String和Number）。规则是：

- number -> Number
- string -> String
- boolean -> Boolean
- void/null/never -> undefined
- Array/Tuple -> Array
- Class -> Construtor
- Enum -> 如果是纯数字枚举为Number，否则为Object
- Function -> function
- 其余都是Object

## 类装饰器

类型：

```tsx
type ClassDecorator = <Func extends Function>(target: Func) => Func | void;
```

参数:

- @target：类的构造器
- @return：如果有值将会替代原有的类构造器的声明；或不返回值也可以修改原有的类

用途：

类装饰器可以继承现有类添加或修改一些属性或方法

```tsx
// 扩展一个toString方法
type Consturctor = { new (...args: any[]): any };

function toString<T extends Consturctor>(target: T): T {
  return class extends target {
    public toString() {
      return JSON.stringify(this);
    }
  };
}

@toString
class Car {
  constructor(public prize: number, public name: string) {}
}

// ts不会智能的推导出toString方法
console.log(new Car(1000, "BMW").toString()); // {"prize":1000,"name":"BMW"}
```

## 属性装饰器

类型：

```tsx
type PropertyDecorator = (target: Record<string|symbol, any>, prop: string | symbol) => any | void
```

参数：

- @target：对于实例属性成员是类的原型链，对于静态属性是类的构造器
- @prop：当前属性名称
- @return：返回的值将被忽略

用途：

属性装饰器可以收集信息，反射赋值，给类添加方法等等，下面介绍一个完整的例子

```tsx
import "reflect-metadata"; // 这里需要借助一个反射库

type Constructor = { new (...args: any): any }

// 用来管理所有可注入的service
const services: Map<Constructor, Constructor> = new Map();

// 注入装饰器
function Inject<T extends Constructor>(target: T) {
  services.set(target, target);
}
// 获取注入的service装饰器
function Service(target: Record<string|symbol, any>, key: string | symbol) {
  const service = services?.get(Reflect.getMetadata("design:type", target, key));
  service && (target[key] = new service());
}

// 常量装饰器
function constant(value: any) {
  return function (target: object, key: string) {
    Object.defineProperty(target, key, {
      enumerable: false,
      configurable: false,
      get() {
        return value;
      },
      set() {
        return value;
      },
    });
  };
}

// 用户相关Service
// 让当前service变成可注入
@Inject
class UserService {
        // 模拟获取用户信息
  public getUser(...args: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("user")
      }, 1000)
    })
  }
}

// 用户页面
class UserPage extends React.Component{
  @Service  // 注入UserService
  public service: UserService;

  // 让BASE_URL变成常量
  @constant(process.env.BASE_URL || 'https://www.baidu.com')
  private _BASE_URL: string;

  public getUser() {
    console.log(this.service)
    return this.service?.getUser({ BASE_URL: this._BASE_URL })
  }

  render() {
    return <>
      <button onClick={this.getUser}>获取用户信息</button>
    </>
  }
}
```

上面点击获取用户信息按钮就会去请求用户的信息，打印结果如下

![https://s3.bmp.ovh/imgs/2022/06/30/a4db1835bc490571.png](https://s3.bmp.ovh/imgs/2022/06/30/a4db1835bc490571.png)

## 方法装饰器

类型：

```tsx
Type MethodDecorator = (target: Record<string|symbol, any>, 
prop: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor |  void
```

参数：

- @target：对于静态成员是类构造器，对实例成员是原型链
- @prop：属性名称
- @descriptor：属性描述器
- @return：属性描述器或不返回

用途：

方法装饰器可以高阶目标方法，做一些参数转换，数据收集等等，如日志收集

```tsx
// 接着上面的介绍，做一个日志收集logger

// 日志收集
function logger(target: object, key: string, descriptor: PropertyDescriptor) {
  const origin = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    try {
      const start = +new Date();
      const rs = await origin.call(this, ...args);
      const end = +new Date();

      // 打印请求耗时
      console.log(`@logger: ${key} api request spend`, `${end - start}ms.`);

      // 这里可以做一些相关收集...
      return rs;
    } catch (err) {
      console.log(err);
    }
  };
}

@Inject
class UserService {
  @logger
  // 登录Request
  async postLogin(username: string) {
    const time = Math.floor(Math.random() * 10 * 1000);
    const rs = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.floor(Math.random() * 26) % 10) {
          resolve(username + ' logined success...');
        } else {
          reject('error');
        }
      }, time);
    });
    return rs;
  }
}

// 用户页面
class UserPage extends React.Component{
  @Service  // 注入UserService
  public service: UserService;

  public async toLogin(username: string) {
    return await this.service?.postLogin(username);
  }

  render() {
    return <>
      <button onClick={() => this.toLogin('Mr Ming')}>登录</button>
    </>
  }
}
```

上面点击登录后会记录请求耗时，控制台打印的结果如下：

![https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h3tgd7rxirj30r60a640p.jpg](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h3tgd7rxirj30r60a640p.jpg)

## 访问器装饰器

- 访问器装饰器和方法装饰器差不多，唯一不同的就是key不同
- 方法装饰器：value、wriable、enumerable、configurable
- 访问器装饰器：get、set、enumerate、configurable

用途：

```tsx
// 不变装饰器
function immutable(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  descriptor.set = function (value: any) {
    return value;
  };
}

// 私有属性装饰器
function toPrivate(target: object, key: string) {
  let _val: any = undefined;
  Object.defineProperty(target, key, {
    enumerable: false,
    configurable: false,
    get() {
      return _val;
    },
    set(val) {
      _val = val;
    },
  });
}

// 用户页面
class UserPage extends React.Component{
  @Service  // 注入UserService
  public service: UserService;

  @toPrivate
  private _PORT: number = 3306;
  get PORT() {
    return this._PORT;
  }
  @immutable
  set PORT(port: number) {
    this._PORT = port;
  } 

  render() {
    return <>
      <button onClick={() => (this.PORT = 2)}>改变PORT</button>
    </>
  }
}
```

现在给PORT赋值，将不会改变_PORT的值，如下图：

![https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h3ti440ni7j312w0sgqbp.jpg](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h3ti440ni7j312w0sgqbp.jpg)

## 参数装饰器

类型：

```tsx
type ParamerDecorator = (target: Record<string|symbol, any>, prop: string | symbol, paramIdx: number) => void
```

参数：

- @target：对于实例属性是类的原型链，对于静态属性是类的构造器
- prop：属性名
- paramIdx：参数位置

用途：

参数装饰器单独使用很有限，一般结合其他装饰器一起使用；下面介绍一个验证器案例，用户可以自定义验证器也可以使用原始类型来验证参数是否正确：

```tsx
// 参数装饰器
type ParamerDecorator = (
  target: Record<string | symbol, any>,
  prop: string | symbol,
  paramIdx: number,
) => void;
// 自定义验证器
type Validater = (...args: any) => boolean;
const validatorStorage: Record<string | symbol, Validater[]> = {};
const typeDecoratorFactory =
  (validator: Validater): ParamerDecorator =>
  (target, prop, idx) => {
    const targetValidators = validatorStorage[prop] ?? [];
    targetValidators[idx] = validator;
    validatorStorage[prop] = targetValidators;
  };
const isString = typeDecoratorFactory((str: string) => typeof str === 'string');
// 源验证器或自定义参数验证器
function validator(
  target: object,
  prop: string,
  descriptor: PropertyDescriptor,
) {
  // 反射获取参数源类型
  const typeMetaDatas: Function[] = Reflect.getMetadata(
    'design:paramtypes',
    target,
    prop,
  );
  const origin = descriptor.value;
  descriptor.value = function (...args: any[]) {
    // 取到自定义验证器
    const validators = validatorStorage[prop];

    // 验证参数
    if (args) {
      args.forEach((arg, idx) => {
        // 自定义验证器
        const validate = validators?.[idx];
        // 源类型验证器
        const metaValidate = typeMetaDatas?.[idx];
        const errorMsg = `Failed for parameter: ${prop} at method of ${
          JSON.stringify(target.constructor?.toString())?.match(
            /function (\w+)/i,
          )?.[1]
        }, expect 【${metaValidate.name?.toLowerCase()}】but 【${typeof arg}】`;
        if (validate && !validate(arg)) {
          throw new TypeError(errorMsg);
        }
        // 没有自定义验证器执行默认验证器
        else if (!validate) {
          if (metaValidate !== arg?.constructor) {
            throw new TypeError(errorMsg);
          }
        }
      });
    }

    // 执行源函数
    return origin.call(this, ...args);
  };
}

class LoginPage {
  // 省略前面代码...

  @validator
  public async toLogin(@isString username: string) { // 期望username为string
    return await this.service?.postLogin(username);
  }

  render() {
    return <>
      <button onClick={() => (this.toLogin(xxx)}>登录</button>
    </>
  }
}
```

现在当点击登录时，调用toLogin方法，就会验证username的参数是否合法（当然前提是参数不能为空的，ts也是无法知道参数是否必填，只是来验证参数的类型罢了），打印如下：

![https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h3tt2o96xrj315k11ob29.jpg](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h3tt2o96xrj315k11ob29.jpg)

当将isString代码改为 typeDecoratorFactory((*str*:  object) => str?.name === ‘Mr Ming’);

![https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h3ttid8rcnj31360e4alm.jpg](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h3ttid8rcnj31360e4alm.jpg)

当删除自定义验证器，再次执行会验证默认的类型验证器：

![https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h3ttkha08bj31460lqh5j.jpg](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h3ttkha08bj31460lqh5j.jpg)

## 执行顺序

上面我们针对每个类型的装饰器分别做了介绍并作了相关的例子实验，现在我们可以同时使用不同的装饰器，测试一下不同类型装饰器的执行顺序是如何的：

```tsx
// 记录
function trace(key: string): any {
  console.log('evaluate: \t', key);
  return function () {
    console.log('call: \t\t', key);
  };
}

// 类装饰器
@trace('Class Decorator')
class People {
  protected _name: string;

  @trace('Static Property _instance')
  public static _instance?: People;

  @trace('Instance Property grade')
  public grade: number;

  constructor(@trace('Constructor Parameter') name: string) {
    this._name = name;
    this.grade = 0;
    this.age = 0;
  }

  @trace('属性访问器')
  public get name() {
    return this._name;
  }

  @trace('Instance Method')
  add(
    @trace('Instance Method Param x') x: number,
    @trace('Instance Method Param y') y: number,
  ): number {
    return x + y;
  }

  @trace('Instance Property age')
  public age: number;

  @trace('Static Method getInstance')
  public static getInstance(
    @trace('Static Method Param name') name: string,
  ): People {
    if (!this._instance) {
      this._instance = new People(name);
    }
    return this._instance;
  }
}
```

上面的打印结果如下：

![https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h3tubgm2udj31680ymx4h.jpg](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1h3tubgm2udj31680ymx4h.jpg)

从上面的结果可以得出结论：
**装饰器访问顺序**

1. 实例属性：按定义从上往下 => 属性/方法(参数 -> 方法名)/属性访问器
2. 静态属性：按定义从上往下 => 属性/方法(参数 -> 方法名)
3. 构造器参数
4. 类装饰器

当改变实例或者静态属性的定义顺序，响应的执行顺序也会按着从上往下定义的顺序执行，有兴趣的小伙伴可以动手试试

至此，有关typescript的装饰器的基本使用就介绍完了，相信看到这里的小伙伴也会对其有相关的了解，希望读完后自己动手实践

## 实践

```tsx
// 待补充
```

<Reward />
<Gitalk />