/*
 承襲form-create json
 Tag為大分類
 type為小分類

 {
 tag: form-item,
 type: input
 }

 {
 tag: form-generator,
 type: xxxx / or created by other people
 }

 {
 tag: grid-generator,
 type: xxxx / or created by other people
 }
 */

import basic from './basic'
import form from './form'
import formGroup from './formGroup'
export default [basic, form, formGroup]
