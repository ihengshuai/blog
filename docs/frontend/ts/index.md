# typescript

JS是个动态弱类型语言，使用非常自由，但随着项目的不断演变代码越多产生的不确定性就会越大，而ts可以更好的进行类型约束，降低程序的不稳定性

<iframe src="//player.bilibili.com/player.html?aid=945017055&bvid=BV1RW4y147Xv&cid=888873805&page=1" scrolling="no" border="0" frameborder="no" width="100%" height="600" framespacing="0" allowfullscreen="true"> </iframe>

## 基础类型

## 内置null/undefined/void

## 内置any/unknown/never

## 枚举

## 接口interface和类型别名type

## 联合类型和交叉类型

## 索引类型keyof

## 类型查询typeof

## 类型守卫
类型收窄(类型推导)
- is
- typeof
- in
- instanceof

1. 守卫基本类型
2. 守卫对象类型、联合类型


## 类Class

## 泛型
1. `type<T>`
2. `interface<T>`
3. `function<T>`
4. `Class<T>`
5. `Promise<T>`

## 条件类型
1. extends
2. infer
3. 分布式条件类型

## 鸭子辨形
里氏替换

## 内置工具类型
1. 属性
```ts
type Partial<T> = {
  [K in keyof T]?: T[K]
}

type Required<T> = {
  [K in keyof T]-?: T[K]
}

type Readonly<T> = {
  readonly [K in keyof T]: T[K];
}

// 可变的
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
}
```
2. 结构
```ts
type Record<K extends keyof any, V> = {
  [P in K]: V;
}

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
}
type Omit<T, K extends any> = {
  
}
```

## 常用
```ts
type LiteralToPrimitive<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : never;
```


// 待更新...