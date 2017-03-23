export function validateOrder (order) {
  const errors = {}
  if (order.qty <= 0) {
    errors['qty'] = '请选择至少一件商品'
  }
  if (order.productId === undefined || order.productId === null) {
    errors['productId'] = '请选择产品'
  }
  if (order.size === undefined || order.size === null) {
    errors['size'] = '请选择尺码'
  }
  return errors
}

export function validateOrderWhenPresent (order) {
  const errors = {}
  if (order.qty <= 0) {
    errors['qty'] = '请选择至少一件商品'
  }

  return errors
}
