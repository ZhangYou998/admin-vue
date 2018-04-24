/**
 * 该模块封装了所有和商品分类 API 相关操作函数
 * 把所有和服务器交互的 API 接口都封装成一个一个的函数
 *   方便维护
 *   可重用
 */

// ES6 新增了构造函数的新写法

class Category {
  // 类的构造函数
  // 当 new Category 的时候就会自动调用该函数
  // 必须叫 constructor
  constructor (x, y) {
    console.log(x, y)
  }

  // save 必须由实例来调用
  save () {
    console.log('实例方法 save 被调用了')
  }

  // 静态方法
  // 静态方法必须由类调用
  static findById () {
    console.log('静态方法 findById 被调用了')
  }
}

const c = new Category(1, 2)

c.save()
category.findById()
