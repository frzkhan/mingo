import {
  assert,
  each,
  err,
  getHash,
  getType,
  has,
  inArray,
  intersection,
  isArray,
  isBoolean,
  isDate,
  isEmpty,
  isEqual,
  isFunction,
  isNil,
  isNull,
  isNumber,
  isObject,
  isObjectLike,
  isRegExp,
  isString,
  isUndefined,
  keys
} from '../util'
import { computeValue, resolve, resolveObj, traverse, idKey, slice } from '../internal.js'
import { Query } from '../query.js'


/**
 * Projection Operators. https://docs.mongodb.com/manual/reference/operator/projection/
 */
export const projectionOperators = {

  /**
   * Projects the first element in an array that matches the query condition.
   *
   * @param obj
   * @param field
   * @param expr
   */
  $ (obj, expr, field) {
    err('$ not implemented')
  },

  /**
   * Projects only the first element from an array that matches the specified $elemMatch condition.
   *
   * @param obj
   * @param field
   * @param expr
   * @returns {*}
   */
  $elemMatch (obj, expr, field) {
    let arr = resolve(obj, field)
    let query = new Query(expr)
    assert(isArray(arr), '$elemMatch: invalid argument')
    for (let i = 0; i < arr.length; i++) {
      if (query.test(arr[i])) return [arr[i]]
    }
    return undefined
  },

  /**
   * Limits the number of elements projected from an array. Supports skip and limit slices.
   *
   * @param obj
   * @param field
   * @param expr
   */
  $slice (obj, expr, field) {
    let xs = resolve(obj, field)

    if (!isArray(xs)) return xs

    if (isArray(expr)) {
      return slice(xs, expr[0], expr[1])
    } else {
      assert(isNumber(expr), '$slice: invalid arguments for projection')
      return slice(xs, expr)
    }
  }
}