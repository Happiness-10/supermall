import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  addCart(context,payload) {
    return new Promise((resolve, reject) => {
      // 查找之前数组中是否有该商品
      let oldProduct = context.state.cartList.find(function (item) {
        return item.iid === payload.iid
      })

      // 判断oldProduct
      if (oldProduct) {
        context.commit(ADD_COUNTER,oldProduct)
        resolve('商品数量加1')
      } else {
        payload.count = 1
        context.commit(ADD_TO_CART,payload)
        resolve('添加了新的商品')
      }
      // console.log(payload);
    })
  }
}
