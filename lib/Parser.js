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
   * @return {{}}
   */
  parse() {
    if(!check.string(this._program)) {
      throw new Error(`Program is not loaded!`)
    }

    //TODO: call parsing
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
   * @param {{type: string, value: string|number}|{type: string, name: string}} expr
   * @param {string} program
   */
  _parseApply(expr, program) {

  }
}
