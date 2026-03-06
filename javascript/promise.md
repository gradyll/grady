---
url: /grady/javascript/promise.md
---
# Promise 相关知识

## 使用reduce进行Promise排队执行，按照顺序调接口

```js
const promises = [.....]
promises.reduce(
(prev, next) => prev.then(() => next.action()), 
Promise.resolve()
);
```

```js

class myPromise {
  constructor() {
  }

  state = PENDING
  value = undefine
  reason = undefine

    resolve = (value) => {
      if (this.state == PENDING) {
        this.value = value
        this.state = FULFILLED
      }
    }

    reject = (reason) => {
      if (this.state == PENDING) {
        this.state = REJECTED
        this.reason = reason
      }
    }

    then(onFulfilled, onRejected) {
      if (this.state == FULFILLED) {
        onFulfilled(this.value)
      } else if (this.state == REJECTED) {
        onRejected(this.reason)
      }
    }
}

```

```js
const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

class MyPromise {

  constructor(executor) {

    this.state = PENDING
    this.value = undefined
    this.reason = undefined

    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {

      if (this.state === PENDING) {

        this.state = FULFILLED
        this.value = value

        this.onFulfilledCallbacks.forEach(fn => fn())

      }

    }

    const reject = (reason) => {

      if (this.state === PENDING) {

        this.state = REJECTED
        this.reason = reason

        this.onRejectedCallbacks.forEach(fn => fn())

      }

    }

    try {

      executor(resolve, reject)

    } catch (e) {

      reject(e)

    }

  }

  then(onFulfilled, onRejected) {

    onFulfilled =
      typeof onFulfilled === "function"
        ? onFulfilled
        : value => value

    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : err => { throw err }

    const promise2 = new MyPromise((resolve, reject) => {

      if (this.state === FULFILLED) {

        setTimeout(() => {

          try {

            const x = onFulfilled(this.value)

            resolvePromise(promise2, x, resolve, reject)

          } catch (e) {

            reject(e)

          }

        })

      }

      if (this.state === REJECTED) {

        setTimeout(() => {

          try {

            const x = onRejected(this.reason)

            resolvePromise(promise2, x, resolve, reject)

          } catch (e) {

            reject(e)

          }

        })

      }

      if (this.state === PENDING) {

        this.onFulfilledCallbacks.push(() => {

          setTimeout(() => {

            try {

              const x = onFulfilled(this.value)

              resolvePromise(promise2, x, resolve, reject)

            } catch (e) {

              reject(e)

            }

          })

        })

        this.onRejectedCallbacks.push(() => {

          setTimeout(() => {

            try {

              const x = onRejected(this.reason)

              resolvePromise(promise2, x, resolve, reject)

            } catch (e) {

              reject(e)

            }

          })

        })

      }

    })

    return promise2

  }

}

function resolvePromise(promise2, x, resolve, reject) {

  if (promise2 === x) {

    return reject(new TypeError("Chaining cycle detected"))

  }

  if (x instanceof MyPromise) {

    x.then(y => {

      resolvePromise(promise2, y, resolve, reject)

    }, reject)

    return

  }

  if (x !== null && (typeof x === "object" || typeof x === "function")) {

    let called = false

    try {

      const then = x.then

      if (typeof then === "function") {

        then.call(
          x,
          y => {

            if (called) return
            called = true

            resolvePromise(promise2, y, resolve, reject)

          },
          r => {

            if (called) return
            called = true

            reject(r)

          }
        )

      } else {

        resolve(x)

      }

    } catch (e) {

      if (called) return
      called = true

      reject(e)

    }

  } else {

    resolve(x)

  }

}


/**
 * A+ 测试适配
 */

MyPromise.deferred = function () {

  let d = {}

  d.promise = new MyPromise((resolve, reject) => {

    d.resolve = resolve
    d.reject = reject

  })

  return d

}

module.exports = MyPromise

```
