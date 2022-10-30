---
title: Promise使用与原理
description: 如何使用promise优雅的解决异步问题,promise使用技巧与原理
head:
  - - meta
    - name: keywords
      content: Promise,promise原理,异步操作,回调函数,异步机制
---

# Promise使用与原理

```js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  status = PENDING

  value = null
  reason = null

  onFulfilledCallback = []
  onRejectedCallback = []

  resolve = (value) => {
    if (this.status == PENDING) {
      this.status = FULFILLED
      this.value = value

      while (this.onFulfilledCallback.length) {
        const cb = this.onFulfilledCallback.shift()
        cb(value)
      }
    }
  }

  reject = (reason) => {
    if (this.status == PENDING) {
      this.status = REJECTED
      this.reason = reason

      while (this.onRejectedCallback.length) {
        const cb = this.onRejectedCallback.shift()
        cb(reason)
      }
    }
  }

  static resolve(param) {
    if (param instanceof MyPromise) return param
    return new MyPromise((resolve) => resolve(param))
  }

  static reject(param) {
    if (param instanceof MyPromise) return param
    return new MyPromise((resolve, reject) => reject(param))
  }

  then = (onFulfilled, onRejected) => {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    const _promise = new MyPromise((resolve, reject) => {
      if (this.status == FULFILLED) {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(_promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      } else if (this.status == REJECTED) {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(_promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      } else if (this.status == PENDING) {
        // 异步进行缓存回调函数
        this.onFulfilledCallback.push(() => {
          queueMicrotask(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(_promise, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
        this.onRejectedCallback.push(() => {
          queueMicrotask(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(_promise, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
      }
    })
    return _promise
  }
}

function resolvePromise(self, x, resolve, reject) {
  if (self === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if (x instanceof MyPromise) {
    try {
      x.then(resolve, reject)
    } catch (error) {
      reject(error)
    }
  } else {
    resolve(x)
  }
}

const promise = new MyPromise((resolve, reject) => {
  console.log('init Promsie')
  setTimeout(() => {
    resolve(1)
  })
})

promise
  .then((v1) => {
    console.log(v1)
    return 2
  })
  .then((v2) => {
    console.log(v2)
    return new MyPromise((resolve) => resolve(3))
  })
  .then((v) => {
    console.log(v)
    console.log('end')
  }, reason => {
    console.log(reason)
  })

MyPromise
  .resolve(new MyPromise((resolve) => resolve('static resolve')))
  .then((v) => {
    console.log(v)
    console.log('static')
  })

MyPromise
  .reject(false)
  .then(null, err => console.log(err))


MyPromise.resolve().then(() => {
  console.log(0);
  return MyPromise.resolve(4);
}).then((res) => {
  console.log(res)
})

MyPromise.resolve().then(() => {
  console.log(1);
}).then(() => {
  console.log(2);
}).then(() => {
  console.log(3);
}).then(() => {
  console.log(5);
}).then(() =>{
  console.log(6);
})
```

//待更新...

<Reward />
<Gitalk />