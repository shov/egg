'use strict'

const codeExample=`
  do(
    define(x, 10),
    if(>(x, 5),
      print("large"),
      print("small")
     )
  )
`

/**
 * @type {Parser}
 */
const parser  = new (require('./lib/Parser'))()

const result = parser.parse(codeExample)

console.log(result)
