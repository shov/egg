'use strict'

const check = require('check-types')
const fs = require('fs')

class Parser {

  constructor(program) {

    this._program = null

    if (program && check.string(program)) {
      this._program = program
    }
  }

  /**
   * Program setter
   * @param program
   */
  set program(program) {
    if (!check.string(program)) {
      throw new TypeError('Program must be a string!')
    }

    this._program = program
  }

  get program() {
    return this._program
  }

  /**
   * Load program from file
   * @param file
   * @return {Parser}
   */
  loadFromFile(file) {
    this._program = fs.readFileSync(file)
    return this
  }

  /**
   * Parse
   * @param {?string} program
   * @return {{type: string, value: string|number}|{type: string, name: string}|{type: string, operator: *, args: []}}
   */
  parse(program = null) {
    if (!program && !check.string(this._program)) {
      throw new Error(`Program is not loaded!`)
    }

    if(!program) {
      program = this._program
    }

    const {expr, rest} = this._parseExpression(program)

    if(this._skipSpace(rest).length > 0) {
      throw new SyntaxError(`Unexpected text after program!`)
    }

    return expr
  }

  /**
   * String parsing
   * @param {string} program
   */
  _parseExpression(program) {
    program = this._skipSpace(program)

    let match, expr

    if (match = /^"([^"]*)"/.exec(program)) {
      expr = {type: "value", value: match[1]}
    } else if (match = /^\d+\b/.exec(program)) {
      expr = {type: "value", value: Number(match[0])}
    } else if (match = /^[^\s(),#"]+/.exec(program)) {
      expr = {type: "word", name: match[0]}
    } else {
      throw new SyntaxError(`Unexpected syntax '${program}'!`)
    }

    return this._parseApply(expr, program.slice(match[0].length))
  }

  /**
   * Trim begin spaces
   * @param {string} string
   */
  _skipSpace(string) {
    let first = string.search(/\S/)
    if (first === -1) {
      return ""
    }

    return string.slice(first)
  }

  /**
   * Applying expressions
   * @param {{type: string, value: string|number}|{type: string, name: string}|{type: string, operator: *, args: []}} expr
   * @param {string} program
   */
  _parseApply(expr, program) {
    program = this._skipSpace(program)

    if (program[0] !== "(") {
      return {expr, rest: program}
    }

    program = this._skipSpace(program.slice(1))
    expr = {type: 'apply', operator: expr, args: []}

    while (program[0] !== ")") {
      let arg = this._parseExpression(program)
      expr.args.push(arg.expr)
      program = this._skipSpace(arg.rest)

      if (program[0] === ",") {
        program = this._skipSpace(program.slice(1))
      } else if (program[0] !== ")") {
        throw new SyntaxError(`Expected ',' or ')'!`)
      }
    }

    return this._parseApply(expr, program.slice(1))
  }
}

module.exports = Parser
