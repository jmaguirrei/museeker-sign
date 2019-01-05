// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../../../../../libs/ui/src/styles/registerStyles.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerStyles = registerStyles;

function registerStyles(isBrowser, registerNumber, styledRules) {
  if (!styledRules) return;

  if (isBrowser) {
    var node = document.getElementById('component-styles');
    var alreadyRegistered = node.innerHTML.indexOf("--".concat(registerNumber)) > -1;
    if (!alreadyRegistered) node.innerHTML += styledRules;
  } else {
    // global.__componentStyles used in SSR Server Side Rendering
    if (!global.__componentStyles) global.__componentStyles = '';
    global.__componentStyles += styledRules;
  }
}
},{}],"../../../../../libs/ui/node_modules/stylis/stylis.js":[function(require,module,exports) {
var define;
/*
 *          __        ___
 *    _____/ /___  __/ (_)____
 *   / ___/ __/ / / / / / ___/
 *  (__  ) /_/ /_/ / / (__  )
 * /____/\__/\__, /_/_/____/
 *          /____/
 *
 * light - weight css preprocessor @licence MIT
 */
(function (factory) {/* eslint-disable */
	typeof exports === 'object' && typeof module !== 'undefined' ? (module['exports'] = factory(null)) :
		typeof define === 'function' && define['amd'] ? define(factory(null)) :
			(window['stylis'] = factory(null))
}(/** @param {*=} options */function factory (options) {/* eslint-disable */

	'use strict'

	/**
	 * Notes
	 *
	 * The ['<method name>'] pattern is used to support closure compiler
	 * the jsdoc signatures are also used to the same effect
	 *
	 * ----
	 *
	 * int + int + int === n4 [faster]
	 *
	 * vs
	 *
	 * int === n1 && int === n2 && int === n3
	 *
	 * ----
	 *
	 * switch (int) { case ints...} [faster]
	 *
	 * vs
	 *
	 * if (int == 1 && int === 2 ...)
	 *
	 * ----
	 *
	 * The (first*n1 + second*n2 + third*n3) format used in the property parser
	 * is a simple way to hash the sequence of characters
	 * taking into account the index they occur in
	 * since any number of 3 character sequences could produce duplicates.
	 *
	 * On the other hand sequences that are directly tied to the index of the character
	 * resolve a far more accurate measure, it's also faster
	 * to evaluate one condition in a switch statement
	 * than three in an if statement regardless of the added math.
	 *
	 * This allows the vendor prefixer to be both small and fast.
	 */

	var nullptn = /^\0+/g /* matches leading null characters */
	var formatptn = /[\0\r\f]/g /* matches new line, null and formfeed characters */
	var colonptn = /: */g /* splits animation rules */
	var cursorptn = /zoo|gra/ /* assert cursor varient */
	var transformptn = /([,: ])(transform)/g /* vendor prefix transform, older webkit */
	var animationptn = /,+\s*(?![^(]*[)])/g /* splits multiple shorthand notation animations */
	var propertiesptn = / +\s*(?![^(]*[)])/g /* animation properties */
	var elementptn = / *[\0] */g /* selector elements */
	var selectorptn = /,\r+?/g /* splits selectors */
	var andptn = /([\t\r\n ])*\f?&/g /* match & */
	var escapeptn = /:global\(((?:[^\(\)\[\]]*|\[.*\]|\([^\(\)]*\))*)\)/g /* matches :global(.*) */
	var invalidptn = /\W+/g /* removes invalid characters from keyframes */
	var keyframeptn = /@(k\w+)\s*(\S*)\s*/ /* matches @keyframes $1 */
	var plcholdrptn = /::(place)/g /* match ::placeholder varient */
	var readonlyptn = /:(read-only)/g /* match :read-only varient */
	var beforeptn = /\s+(?=[{\];=:>])/g /* matches \s before ] ; = : */
	var afterptn = /([[}=:>])\s+/g /* matches \s after characters [ } = : */
	var tailptn = /(\{[^{]+?);(?=\})/g /* matches tail semi-colons ;} */
	var whiteptn = /\s{2,}/g /* matches repeating whitespace */
	var pseudoptn = /([^\(])(:+) */g /* pseudo element */
	var writingptn = /[svh]\w+-[tblr]{2}/ /* match writing mode property values */
	var gradientptn = /([\w-]+t\()/g /* match *gradient property */
	var supportsptn = /\(\s*(.*)\s*\)/g /* match supports (groups) */
	var propertyptn = /([\s\S]*?);/g /* match properties leading semicolon */
	var selfptn = /-self|flex-/g /* match flex- and -self in align-self: flex-*; */
	var pseudofmt = /[^]*?(:[rp][el]a[\w-]+)[^]*/ /* extrats :readonly or :placholder from selector */
	var trimptn = /[ \t]+$/ /* match tail whitspace */
	var dimensionptn = /stretch|:\s*\w+\-(?:conte|avail)/ /* match max/min/fit-content, fill-available */
	var imgsrcptn = /([^-])(image-set\()/

	/* vendors */
	var webkit = '-webkit-'
	var moz = '-moz-'
	var ms = '-ms-'

	/* character codes */
	var SEMICOLON = 59 /* ; */
	var CLOSEBRACES = 125 /* } */
	var OPENBRACES = 123 /* { */
	var OPENPARENTHESES = 40 /* ( */
	var CLOSEPARENTHESES = 41 /* ) */
	var OPENBRACKET = 91 /* [ */
	var CLOSEBRACKET = 93 /* ] */
	var NEWLINE = 10 /* \n */
	var CARRIAGE = 13 /* \r */
	var TAB = 9 /* \t */
	var AT = 64 /* @ */
	var SPACE = 32 /*   */
	var AND = 38 /* & */
	var DASH = 45 /* - */
	var UNDERSCORE = 95 /* _ */
	var STAR = 42 /* * */
	var COMMA = 44 /* , */
	var COLON = 58 /* : */
	var SINGLEQUOTE = 39 /* ' */
	var DOUBLEQUOTE = 34 /* " */
	var FOWARDSLASH = 47 /* / */
	var GREATERTHAN = 62 /* > */
	var PLUS = 43 /* + */
	var TILDE = 126 /* ~ */
	var NULL = 0 /* \0 */
	var FORMFEED = 12 /* \f */
	var VERTICALTAB = 11 /* \v */

	/* special identifiers */
	var KEYFRAME = 107 /* k */
	var MEDIA = 109 /* m */
	var SUPPORTS = 115 /* s */
	var PLACEHOLDER = 112 /* p */
	var READONLY = 111 /* o */
	var IMPORT = 105 /* <at>i */
	var CHARSET = 99 /* <at>c */
	var DOCUMENT = 100 /* <at>d */
	var PAGE = 112 /* <at>p */

	var column = 1 /* current column */
	var line = 1 /* current line numebr */
	var pattern = 0 /* :pattern */

	var cascade = 1 /* #id h1 h2 vs h1#id h2#id  */
	var prefix = 1 /* vendor prefix */
	var escape = 1 /* escape :global() pattern */
	var compress = 0 /* compress output */
	var semicolon = 0 /* no/semicolon option */
	var preserve = 0 /* preserve empty selectors */

	/* empty reference */
	var array = []

	/* plugins */
	var plugins = []
	var plugged = 0
	var should = null

	/* plugin context */
	var POSTS = -2
	var PREPS = -1
	var UNKWN = 0
	var PROPS = 1
	var BLCKS = 2
	var ATRUL = 3

	/* plugin newline context */
	var unkwn = 0

	/* keyframe animation */
	var keyed = 1
	var key = ''

	/* selector namespace */
	var nscopealt = ''
	var nscope = ''

	/**
	 * Compile
	 *
	 * @param {Array<string>} parent
	 * @param {Array<string>} current
	 * @param {string} body
	 * @param {number} id
	 * @param {number} depth
	 * @return {string}
	 */
	function compile (parent, current, body, id, depth) {
		var bracket = 0 /* brackets [] */
		var comment = 0 /* comments /* // or /* */
		var parentheses = 0 /* functions () */
		var quote = 0 /* quotes '', "" */

		var first = 0 /* first character code */
		var second = 0 /* second character code */
		var code = 0 /* current character code */
		var tail = 0 /* previous character code */
		var trail = 0 /* character before previous code */
		var peak = 0 /* previous non-whitespace code */

		var counter = 0 /* count sequence termination */
		var context = 0 /* track current context */
		var atrule = 0 /* track @at-rule context */
		var pseudo = 0 /* track pseudo token index */
		var caret = 0 /* current character index */
		var format = 0 /* control character formating context */
		var insert = 0 /* auto semicolon insertion */
		var invert = 0 /* inverted selector pattern */
		var length = 0 /* generic length address */
		var eof = body.length /* end of file(length) */
		var eol = eof - 1 /* end of file(characters) */

		var char = '' /* current character */
		var chars = '' /* current buffer of characters */
		var child = '' /* next buffer of characters */
		var out = '' /* compiled body */
		var children = '' /* compiled children */
		var flat = '' /* compiled leafs */
		var selector /* generic selector address */
		var result /* generic address */

		// ...build body
		while (caret < eof) {
			code = body.charCodeAt(caret)

			// eof varient
			if (caret === eol) {
				// last character + noop context, add synthetic padding for noop context to terminate
				if (comment + quote + parentheses + bracket !== 0) {
					if (comment !== 0) {
						code = comment === FOWARDSLASH ? NEWLINE : FOWARDSLASH
					}

					quote = parentheses = bracket = 0
					eof++
					eol++
				}
			}

			if (comment + quote + parentheses + bracket === 0) {
				// eof varient
				if (caret === eol) {
					if (format > 0) {
						chars = chars.replace(formatptn, '')
					}

					if (chars.trim().length > 0) {
						switch (code) {
							case SPACE:
							case TAB:
							case SEMICOLON:
							case CARRIAGE:
							case NEWLINE: {
								break
							}
							default: {
								chars += body.charAt(caret)
							}
						}

						code = SEMICOLON
					}
				}

				// auto semicolon insertion
				if (insert === 1) {
					switch (code) {
						// false flags
						case OPENBRACES:
						case CLOSEBRACES:
						case SEMICOLON:
						case DOUBLEQUOTE:
						case SINGLEQUOTE:
						case OPENPARENTHESES:
						case CLOSEPARENTHESES:
						case COMMA: {
							insert = 0
						}
						// ignore
						case TAB:
						case CARRIAGE:
						case NEWLINE:
						case SPACE: {
							break
						}
						// valid
						default: {
							insert = 0
							length = caret
							first = code
							caret--
							code = SEMICOLON

							while (length < eof) {
								switch (body.charCodeAt(length++)) {
									case NEWLINE:
									case CARRIAGE:
									case SEMICOLON: {
										++caret
										code = first
										length = eof
										break
									}
									case COLON: {
										if (format > 0) {
											++caret
											code = first
										}
									}
									case OPENBRACES: {
										length = eof
									}
								}
							}
						}
					}
				}

				// token varient
				switch (code) {
					case OPENBRACES: {
						chars = chars.trim()
						first = chars.charCodeAt(0)
						counter = 1
						length = ++caret

						while (caret < eof) {
							switch (code = body.charCodeAt(caret)) {
								case OPENBRACES: {
									counter++
									break
								}
								case CLOSEBRACES: {
									counter--
									break
								}
								case FOWARDSLASH: {
									switch (second = body.charCodeAt(caret + 1)) {
										// /*, //
										case STAR:
										case FOWARDSLASH: {
											caret = delimited(second, caret, eol, body)
										}
									}
									break
								}
								// given "[" === 91 & "]" === 93 hence forth 91 + 1 + 1 === 93
								case OPENBRACKET: {
									code++
								}
								// given "(" === 40 & ")" === 41 hence forth 40 + 1 === 41
								case OPENPARENTHESES: {
									code++
								}
								// quote tail delimiter is identical to the head delimiter hence noop,
								// fallthrough clauses have been shifted to the correct tail delimiter
								case DOUBLEQUOTE:
								case SINGLEQUOTE: {
									while (caret++ < eol) {
										if (body.charCodeAt(caret) === code) {
											break
										}
									}
								}
							}

							if (counter === 0) {
								break
							}

							caret++
						}

						child = body.substring(length, caret)

						if (first === NULL) {
							first = (chars = chars.replace(nullptn, '').trim()).charCodeAt(0)
						}

						switch (first) {
							// @at-rule
							case AT: {
								if (format > 0) {
									chars = chars.replace(formatptn, '')
								}

								second = chars.charCodeAt(1)

								switch (second) {
									case DOCUMENT:
									case MEDIA:
									case SUPPORTS:
									case DASH: {
										selector = current
										break
									}
									default: {
										selector = array
									}
								}

								child = compile(current, selector, child, second, depth+1)
								length = child.length

								// preserve empty @at-rule
								if (preserve > 0 && length === 0) {
									length = chars.length
								}

								// execute plugins, @at-rule context
								if (plugged > 0) {
									selector = select(array, chars, invert)
									result = proxy(ATRUL, child, selector, current, line, column, length, second, depth, id)
									chars = selector.join('')

									if (result !== void 0) {
										if ((length = (child = result.trim()).length) === 0) {
											second = 0
											child = ''
										}
									}
								}

								if (length > 0) {
									switch (second) {
										case SUPPORTS: {
											chars = chars.replace(supportsptn, supports)
										}
										case DOCUMENT:
										case MEDIA:
										case DASH: {
											child = chars + '{' + child + '}'
											break
										}
										case KEYFRAME: {
											chars = chars.replace(keyframeptn, '$1 $2' + (keyed > 0 ? key : ''))
											child = chars + '{' + child + '}'

											if (prefix === 1 || (prefix === 2 && vendor('@'+child, 3))) {
												child = '@' + webkit + child + '@' + child
											} else {
												child = '@' + child
											}
											break
										}
										default: {
											child = chars + child

											if (id === PAGE) {
												child = (out += child, '')
											}
										}
									}
								} else {
									child = ''
								}

								break
							}
							// selector
							default: {
								child = compile(current, select(current, chars, invert), child, id, depth+1)
							}
						}

						children += child

						// reset
						context = 0
						insert = 0
						pseudo = 0
						format = 0
						invert = 0
						atrule = 0
						chars = ''
						child = ''
						code = body.charCodeAt(++caret)
						break
					}
					case CLOSEBRACES:
					case SEMICOLON: {
						chars = (format > 0 ? chars.replace(formatptn, '') : chars).trim()

						if ((length = chars.length) > 1) {
							// monkey-patch missing colon
							if (pseudo === 0) {
								first = chars.charCodeAt(0)

								// first character is a letter or dash, buffer has a space character
								if ((first === DASH || first > 96 && first < 123)) {
									length = (chars = chars.replace(' ', ':')).length
								}
							}

							// execute plugins, property context
							if (plugged > 0) {
								if ((result = proxy(PROPS, chars, current, parent, line, column, out.length, id, depth, id)) !== void 0) {
									if ((length = (chars = result.trim()).length) === 0) {
										chars = '\0\0'
									}
								}
							}

							first = chars.charCodeAt(0)
							second = chars.charCodeAt(1)

							switch (first) {
								case NULL: {
									break
								}
								case AT: {
									if (second === IMPORT || second === CHARSET) {
										flat += chars + body.charAt(caret)
										break
									}
								}
								default: {
									if (chars.charCodeAt(length-1) === COLON) {
										break
									}

									out += property(chars, first, second, chars.charCodeAt(2))
								}
							}
						}

						// reset
						context = 0
						insert = 0
						pseudo = 0
						format = 0
						invert = 0
						chars = ''
						code = body.charCodeAt(++caret)
						break
					}
				}
			}

			// parse characters
			switch (code) {
				case CARRIAGE:
				case NEWLINE: {
					// auto insert semicolon
					if (comment + quote + parentheses + bracket + semicolon === 0) {
						// valid non-whitespace characters that
						// may precede a newline
						switch (peak) {
							case CLOSEPARENTHESES:
							case SINGLEQUOTE:
							case DOUBLEQUOTE:
							case AT:
							case TILDE:
							case GREATERTHAN:
							case STAR:
							case PLUS:
							case FOWARDSLASH:
							case DASH:
							case COLON:
							case COMMA:
							case SEMICOLON:
							case OPENBRACES:
							case CLOSEBRACES: {
								break
							}
							default: {
								// current buffer has a colon
								if (pseudo > 0) {
									insert = 1
								}
							}
						}
					}

					// terminate line comment
					if (comment === FOWARDSLASH) {
						comment = 0
					} else if (cascade + context === 0 && id !== KEYFRAME && chars.length > 0) {
						format = 1
						chars += '\0'
					}

					// execute plugins, newline context
					if (plugged * unkwn > 0) {
						proxy(UNKWN, chars, current, parent, line, column, out.length, id, depth, id)
					}

					// next line, reset column position
					column = 1
					line++
					break
				}
				case SEMICOLON:
				case CLOSEBRACES: {
					if (comment + quote + parentheses + bracket === 0) {
						column++
						break
					}
				}
				default: {
					// increment column position
					column++

					// current character
					char = body.charAt(caret)

					// remove comments, escape functions, strings, attributes and prepare selectors
					switch (code) {
						case TAB:
						case SPACE: {
							if (quote + bracket + comment === 0) {
								switch (tail) {
									case COMMA:
									case COLON:
									case TAB:
									case SPACE: {
										char = ''
										break
									}
									default: {
										if (code !== SPACE) {
											char = ' '
										}
									}
								}
							}
							break
						}
						// escape breaking control characters
						case NULL: {
							char = '\\0'
							break
						}
						case FORMFEED: {
							char = '\\f'
							break
						}
						case VERTICALTAB: {
							char = '\\v'
							break
						}
						// &
						case AND: {
							// inverted selector pattern i.e html &
							if (quote + comment + bracket === 0 && cascade > 0) {
								invert = 1
								format = 1
								char = '\f' + char
							}
							break
						}
						// ::p<l>aceholder, l
						// :read-on<l>y, l
						case 108: {
							if (quote + comment + bracket + pattern === 0 && pseudo > 0) {
								switch (caret - pseudo) {
									// ::placeholder
									case 2: {
										if (tail === PLACEHOLDER && body.charCodeAt(caret-3) === COLON) {
											pattern = tail
										}
									}
									// :read-only
									case 8: {
										if (trail === READONLY) {
											pattern = trail
										}
									}
								}
							}
							break
						}
						// :<pattern>
						case COLON: {
							if (quote + comment + bracket === 0) {
								pseudo = caret
							}
							break
						}
						// selectors
						case COMMA: {
							if (comment + parentheses + quote + bracket === 0) {
								format = 1
								char += '\r'
							}
							break
						}
						// quotes
						case DOUBLEQUOTE:
						case SINGLEQUOTE: {
							if (comment === 0) {
								quote = quote === code ? 0 : (quote === 0 ? code : quote)
							}
							break
						}
						// attributes
						case OPENBRACKET: {
							if (quote + comment + parentheses === 0) {
								bracket++
							}
							break
						}
						case CLOSEBRACKET: {
							if (quote + comment + parentheses === 0) {
								bracket--
							}
							break
						}
						// functions
						case CLOSEPARENTHESES: {
							if (quote + comment + bracket === 0) {
								parentheses--
							}
							break
						}
						case OPENPARENTHESES: {
							if (quote + comment + bracket === 0) {
								if (context === 0) {
									switch (tail*2 + trail*3) {
										// :matches
										case 533: {
											break
										}
										// :global, :not, :nth-child etc...
										default: {
											counter = 0
											context = 1
										}
									}
								}

								parentheses++
							}
							break
						}
						case AT: {
							if (comment + parentheses + quote + bracket + pseudo + atrule === 0) {
								atrule = 1
							}
							break
						}
						// block/line comments
						case STAR:
						case FOWARDSLASH: {
							if (quote + bracket + parentheses > 0) {
								break
							}

							switch (comment) {
								// initialize line/block comment context
								case 0: {
									switch (code*2 + body.charCodeAt(caret+1)*3) {
										// //
										case 235: {
											comment = FOWARDSLASH
											break
										}
										// /*
										case 220: {
											length = caret
											comment = STAR
											break
										}
									}
									break
								}
								// end block comment context
								case STAR: {
									if (code === FOWARDSLASH && tail === STAR && length + 2 !== caret) {
										// /*<!> ... */, !
										if (body.charCodeAt(length+2) === 33) {
											out += body.substring(length, caret+1)
										}
										char = ''
										comment = 0
									}
								}
							}
						}
					}

					// ignore comment blocks
					if (comment === 0) {
						// aggressive isolation mode, divide each individual selector
						// including selectors in :not function but excluding selectors in :global function
						if (cascade + quote + bracket + atrule === 0 && id !== KEYFRAME && code !== SEMICOLON) {
							switch (code) {
								case COMMA:
								case TILDE:
								case GREATERTHAN:
								case PLUS:
								case CLOSEPARENTHESES:
								case OPENPARENTHESES: {
									if (context === 0) {
										// outside of an isolated context i.e nth-child(<...>)
										switch (tail) {
											case TAB:
											case SPACE:
											case NEWLINE:
											case CARRIAGE: {
												char = char + '\0'
												break
											}
											default: {
												char = '\0' + char + (code === COMMA ? '' : '\0')
											}
										}
										format = 1
									} else {
										// within an isolated context, sleep untill it's terminated
										switch (code) {
											case OPENPARENTHESES: {
												// :globa<l>(
												if (pseudo + 7 === caret && tail === 108) {
													pseudo = 0
												}
												context = ++counter
												break
											}
											case CLOSEPARENTHESES: {
												if ((context = --counter) === 0) {
													format = 1
													char += '\0'
												}
												break
											}
										}
									}
									break
								}
								case TAB:
								case SPACE: {
									switch (tail) {
										case NULL:
										case OPENBRACES:
										case CLOSEBRACES:
										case SEMICOLON:
										case COMMA:
										case FORMFEED:
										case TAB:
										case SPACE:
										case NEWLINE:
										case CARRIAGE: {
											break
										}
										default: {
											// ignore in isolated contexts
											if (context === 0) {
												format = 1
												char += '\0'
											}
										}
									}
								}
							}
						}

						// concat buffer of characters
						chars += char

						// previous non-whitespace character code
						if (code !== SPACE && code !== TAB) {
							peak = code
						}
					}
				}
			}

			// tail character codes
			trail = tail
			tail = code

			// visit every character
			caret++
		}

		length = out.length

		// preserve empty selector
 		if (preserve > 0) {
 			if (length === 0 && children.length === 0 && (current[0].length === 0) === false) {
 				if (id !== MEDIA || (current.length === 1 && (cascade > 0 ? nscopealt : nscope) === current[0])) {
					length = current.join(',').length + 2
 				}
 			}
		}

		if (length > 0) {
			// cascade isolation mode?
			selector = cascade === 0 && id !== KEYFRAME ? isolate(current) : current

			// execute plugins, block context
			if (plugged > 0) {
				result = proxy(BLCKS, out, selector, parent, line, column, length, id, depth, id)

				if (result !== void 0 && (out = result).length === 0) {
					return flat + out + children
				}
			}

			out = selector.join(',') + '{' + out + '}'

			if (prefix*pattern !== 0) {
				if (prefix === 2 && !vendor(out, 2))
					pattern = 0

				switch (pattern) {
					// ::read-only
					case READONLY: {
						out = out.replace(readonlyptn, ':'+moz+'$1')+out
						break
					}
					// ::placeholder
					case PLACEHOLDER: {
						out = (
							out.replace(plcholdrptn, '::' + webkit + 'input-$1') +
							out.replace(plcholdrptn, '::' + moz + '$1') +
							out.replace(plcholdrptn, ':' + ms + 'input-$1') + out
						)
						break
					}
				}

				pattern = 0
			}
		}

		return flat + out + children
	}

	/**
	 * Select
	 *
	 * @param {Array<string>} parent
	 * @param {string} current
	 * @param {number} invert
	 * @return {Array<string>}
	 */
	function select (parent, current, invert) {
		var selectors = current.trim().split(selectorptn)
		var out = selectors

		var length = selectors.length
		var l = parent.length

		switch (l) {
			// 0-1 parent selectors
			case 0:
			case 1: {
				for (var i = 0, selector = l === 0 ? '' : parent[0] + ' '; i < length; ++i) {
					out[i] = scope(selector, out[i], invert, l).trim()
				}
				break
			}
			// >2 parent selectors, nested
			default: {
				for (var i = 0, j = 0, out = []; i < length; ++i) {
					for (var k = 0; k < l; ++k) {
						out[j++] = scope(parent[k] + ' ', selectors[i], invert, l).trim()
					}
				}
			}
		}

		return out
	}

	/**
	 * Scope
	 *
	 * @param {string} parent
	 * @param {string} current
	 * @param {number} invert
	 * @param {number} level
	 * @return {string}
	 */
	function scope (parent, current, invert, level) {
		var selector = current
		var code = selector.charCodeAt(0)

		// trim leading whitespace
		if (code < 33) {
			code = (selector = selector.trim()).charCodeAt(0)
		}

		switch (code) {
			// &
			case AND: {
				switch (cascade + level) {
					case 0:
					case 1: {
						if (parent.trim().length === 0) {
							break
						}
					}
					default: {
						return selector.replace(andptn, '$1'+parent.trim())
					}
				}
				break
			}
			// :
			case COLON: {
				switch (selector.charCodeAt(1)) {
					// g in :global
					case 103: {
						if (escape > 0 && cascade > 0) {
							return selector.replace(escapeptn, '$1').replace(andptn, '$1'+nscope)
						}
						break
					}
					default: {
						// :hover
						return parent.trim() + selector.replace(andptn, '$1'+parent.trim())
					}
				}
			}
			default: {
				// html &
				if (invert*cascade > 0 && selector.indexOf('\f') > 0) {
					return selector.replace(andptn, (parent.charCodeAt(0) === COLON ? '' : '$1')+parent.trim())
				}
			}
		}

		return parent + selector
	}

	/**
	 * Property
	 *
	 * @param {string} input
	 * @param {number} first
	 * @param {number} second
	 * @param {number} third
	 * @return {string}
	 */
	function property (input, first, second, third) {
		var index = 0
		var out = input + ';'
		var hash = (first*2) + (second*3) + (third*4)
		var cache

		// animation: a, n, i characters
		if (hash === 944) {
			return animation(out)
		} else if (prefix === 0 || (prefix === 2 && !vendor(out, 1))) {
			return out
		}

		// vendor prefix
		switch (hash) {
			// text-decoration/text-size-adjust/text-shadow/text-align/text-transform: t, e, x
			case 1015: {
				// text-shadow/text-align/text-transform, a
				return out.charCodeAt(10) === 97 ? webkit + out + out : out
			}
			// filter/fill f, i, l
			case 951: {
				// filter, t
				return out.charCodeAt(3) === 116 ? webkit + out + out : out
			}
			// color/column, c, o, l
			case 963: {
				// column, n
				return out.charCodeAt(5) === 110 ? webkit + out + out : out
			}
			// box-decoration-break, b, o, x
			case 1009: {
				if (out.charCodeAt(4) !== 100) {
					break
				}
			}
			// mask, m, a, s
			// clip-path, c, l, i
			case 969:
			case 942: {
				return webkit + out + out
			}
			// appearance: a, p, p
			case 978: {
				return webkit + out + moz + out + out
			}
			// hyphens: h, y, p
			// user-select: u, s, e
			case 1019:
			case 983: {
				return webkit + out + moz + out + ms + out + out
			}
			// background/backface-visibility, b, a, c
			case 883: {
				// backface-visibility, -
				if (out.charCodeAt(8) === DASH) {
					return webkit + out + out
				}

				// image-set(...)
				if (out.indexOf('image-set(', 11) > 0) {
					return out.replace(imgsrcptn, '$1'+webkit+'$2') + out
				}

				return out
			}
			// flex: f, l, e
			case 932: {
				if (out.charCodeAt(4) === DASH) {
					switch (out.charCodeAt(5)) {
						// flex-grow, g
						case 103: {
							return webkit + 'box-' + out.replace('-grow', '') + webkit + out + ms + out.replace('grow', 'positive') + out
						}
						// flex-shrink, s
						case 115: {
							return webkit + out + ms + out.replace('shrink', 'negative') + out
						}
						// flex-basis, b
						case 98: {
							return webkit + out + ms + out.replace('basis', 'preferred-size') + out
						}
					}
				}

				return webkit + out + ms + out + out
			}
			// order: o, r, d
			case 964: {
				return webkit + out + ms + 'flex' + '-' + out + out
			}
			// justify-items/justify-content, j, u, s
			case 1023: {
				// justify-content, c
				if (out.charCodeAt(8) !== 99) {
					break
				}

				cache = out.substring(out.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify')
				return webkit + 'box-pack' + cache + webkit + out + ms + 'flex-pack' + cache + out
			}
			// cursor, c, u, r
			case 1005: {
				return cursorptn.test(out) ? out.replace(colonptn, ':' + webkit) + out.replace(colonptn, ':' + moz) + out : out
			}
			// writing-mode, w, r, i
			case 1000: {
				cache = out.substring(13).trim()
				index = cache.indexOf('-') + 1

				switch (cache.charCodeAt(0)+cache.charCodeAt(index)) {
					// vertical-lr
					case 226: {
						cache = out.replace(writingptn, 'tb')
						break
					}
					// vertical-rl
					case 232: {
						cache = out.replace(writingptn, 'tb-rl')
						break
					}
					// horizontal-tb
					case 220: {
						cache = out.replace(writingptn, 'lr')
						break
					}
					default: {
						return out
					}
				}

				return webkit + out + ms + cache + out
			}
			// position: sticky
			case 1017: {
				if (out.indexOf('sticky', 9) === -1) {
					return out
				}
			}
			// display(flex/inline-flex/inline-box): d, i, s
			case 975: {
				index = (out = input).length - 10
				cache = (out.charCodeAt(index) === 33 ? out.substring(0, index) : out).substring(input.indexOf(':', 7) + 1).trim()

				switch (hash = cache.charCodeAt(0) + (cache.charCodeAt(7)|0)) {
					// inline-
					case 203: {
						// inline-box
						if (cache.charCodeAt(8) < 111) {
							break
						}
					}
					// inline-box/sticky
					case 115: {
						out = out.replace(cache, webkit+cache)+';'+out
						break
					}
					// inline-flex
					// flex
					case 207:
					case 102: {
						out = (
							out.replace(cache, webkit+(hash > 102 ? 'inline-' : '')+'box')+';'+
							out.replace(cache, webkit+cache)+';'+
							out.replace(cache, ms+cache+'box')+';'+
							out
						)
					}
				}

				return out + ';'
			}
			// align-items, align-center, align-self: a, l, i, -
			case 938: {
				if (out.charCodeAt(5) === DASH) {
					switch (out.charCodeAt(6)) {
						// align-items, i
						case 105: {
							cache = out.replace('-items', '')
							return webkit + out + webkit + 'box-' + cache + ms + 'flex-' + cache + out
						}
						// align-self, s
						case 115: {
							return webkit + out + ms + 'flex-item-' + out.replace(selfptn, '') + out
						}
						// align-content
						default: {
							return webkit + out + ms + 'flex-line-pack' + out.replace('align-content', '').replace(selfptn, '') + out
						}
					}
				}
				break
			}
			// min/max
			case 973:
			case 989: {
				// min-/max- height/width/block-size/inline-size
				if (out.charCodeAt(3) !== DASH || out.charCodeAt(4) === 122) {
					break
				}
			}
			// height/width: min-content / width: max-content
			case 931:
			case 953: {
				if (dimensionptn.test(input) === true) {
					// stretch
					if ((cache = input.substring(input.indexOf(':') + 1)).charCodeAt(0) === 115)
						return property(input.replace('stretch', 'fill-available'), first, second, third).replace(':fill-available', ':stretch')
					else
						return out.replace(cache, webkit + cache) + out.replace(cache, moz + cache.replace('fill-', '')) + out
				}
				break
			}
			// transform, transition: t, r, a
			case 962: {
				out = webkit + out + (out.charCodeAt(5) === 102 ? ms + out : '') + out

				// transitions
				if (second + third === 211 && out.charCodeAt(13) === 105 && out.indexOf('transform', 10) > 0) {
					return out.substring(0, out.indexOf(';', 27) + 1).replace(transformptn, '$1' + webkit + '$2') + out
				}

				break
			}
		}

		return out
	}

	/**
	 * Vendor
	 *
	 * @param {string} content
	 * @param {number} context
	 * @return {boolean}
	 */
	function vendor (content, context) {
		var index = content.indexOf(context === 1 ? ':' : '{')
		var key = content.substring(0, context !== 3 ? index : 10)
		var value = content.substring(index + 1, content.length - 1)

		return should(context !== 2 ? key : key.replace(pseudofmt, '$1'), value, context)
	}

	/**
	 * Supports
	 *
	 * @param {string} match
	 * @param {string} group
	 * @return {string}
	 */
	function supports (match, group) {
		var out = property(group, group.charCodeAt(0), group.charCodeAt(1), group.charCodeAt(2))

		return out !== group+';' ? out.replace(propertyptn, ' or ($1)').substring(4) : '('+group+')'
	}

	/**
	 * Animation
	 *
	 * @param {string} input
	 * @return {string}
	 */
	function animation (input) {
		var length = input.length
		var index = input.indexOf(':', 9) + 1
		var declare = input.substring(0, index).trim()
		var out = input.substring(index, length-1).trim()

		switch (input.charCodeAt(9)*keyed) {
			case 0: {
				break
			}
			// animation-*, -
			case DASH: {
				// animation-name, n
				if (input.charCodeAt(10) !== 110) {
					break
				}
			}
			// animation/animation-name
			default: {
				// split in case of multiple animations
				var list = out.split((out = '', animationptn))

				for (var i = 0, index = 0, length = list.length; i < length; index = 0, ++i) {
					var value = list[i]
					var items = value.split(propertiesptn)

					while (value = items[index]) {
						var peak = value.charCodeAt(0)

						if (keyed === 1 && (
							// letters
							(peak > AT && peak < 90) || (peak > 96 && peak < 123) || peak === UNDERSCORE ||
							// dash but not in sequence i.e --
							(peak === DASH && value.charCodeAt(1) !== DASH)
						)) {
							// not a number/function
							switch (isNaN(parseFloat(value)) + (value.indexOf('(') !== -1)) {
								case 1: {
									switch (value) {
										// not a valid reserved keyword
										case 'infinite': case 'alternate': case 'backwards': case 'running':
										case 'normal': case 'forwards': case 'both': case 'none': case 'linear':
										case 'ease': case 'ease-in': case 'ease-out': case 'ease-in-out':
										case 'paused': case 'reverse': case 'alternate-reverse': case 'inherit':
										case 'initial': case 'unset': case 'step-start': case 'step-end': {
											break
										}
										default: {
											value += key
										}
									}
								}
							}
						}

						items[index++] = value
					}

					out += (i === 0 ? '' : ',') + items.join(' ')
				}
			}
		}

		out = declare + out + ';'

		if (prefix === 1 || (prefix === 2 && vendor(out, 1)))
			return webkit + out + out

		return out
	}

	/**
	 * Isolate
	 *
	 * @param {Array<string>} current
	 */
	function isolate (current) {
		for (var i = 0, length = current.length, selector = Array(length), padding, element; i < length; ++i) {
			// split individual elements in a selector i.e h1 h2 === [h1, h2]
			var elements = current[i].split(elementptn)
			var out = ''

			for (var j = 0, size = 0, tail = 0, code = 0, l = elements.length; j < l; ++j) {
				// empty element
				if ((size = (element = elements[j]).length) === 0 && l > 1) {
					continue
				}

				tail = out.charCodeAt(out.length-1)
				code = element.charCodeAt(0)
				padding = ''

				if (j !== 0) {
					// determine if we need padding
					switch (tail) {
						case STAR:
						case TILDE:
						case GREATERTHAN:
						case PLUS:
						case SPACE:
						case OPENPARENTHESES:  {
							break
						}
						default: {
							padding = ' '
						}
					}
				}

				switch (code) {
					case AND: {
						element = padding + nscopealt
					}
					case TILDE:
					case GREATERTHAN:
					case PLUS:
					case SPACE:
					case CLOSEPARENTHESES:
					case OPENPARENTHESES: {
						break
					}
					case OPENBRACKET: {
						element = padding + element + nscopealt
						break
					}
					case COLON: {
						switch (element.charCodeAt(1)*2 + element.charCodeAt(2)*3) {
							// :global
							case 530: {
								if (escape > 0) {
									element = padding + element.substring(8, size - 1)
									break
								}
							}
							// :hover, :nth-child(), ...
							default: {
								if (j < 1 || elements[j-1].length < 1) {
									element = padding + nscopealt + element
								}
							}
						}
						break
					}
					case COMMA: {
						padding = ''
					}
					default: {
						if (size > 1 && element.indexOf(':') > 0) {
							element = padding + element.replace(pseudoptn, '$1' + nscopealt + '$2')
						} else {
							element = padding + element + nscopealt
						}
					}
				}

				out += element
			}

			selector[i] = out.replace(formatptn, '').trim()
		}

		return selector
	}

	/**
	 * Proxy
	 *
	 * @param {number} context
	 * @param {string} content
	 * @param {Array<string>} selectors
	 * @param {Array<string>} parents
	 * @param {number} line
	 * @param {number} column
	 * @param {number} length
	 * @param {number} id
	 * @param {number} depth
	 * @param {number} at
	 * @return {(string|void|*)}
	 */
	function proxy (context, content, selectors, parents, line, column, length, id, depth, at) {
		for (var i = 0, out = content, next; i < plugged; ++i) {
			switch (next = plugins[i].call(stylis, context, out, selectors, parents, line, column, length, id, depth, at)) {
				case void 0:
				case false:
				case true:
				case null: {
					break
				}
				default: {
					out = next
				}
			}
		}
		if (out !== content) {
		  return out
		}
	}

	/**
	 * @param {number} code
	 * @param {number} index
	 * @param {number} length
	 * @param {string} body
	 * @return {number}
	 */
	function delimited (code, index, length, body) {
		for (var i = index + 1; i < length; ++i) {
			switch (body.charCodeAt(i)) {
				// /*
				case FOWARDSLASH: {
					if (code === STAR) {
						if (body.charCodeAt(i - 1) === STAR &&  index + 2 !== i) {
							return i + 1
						}
					}
					break
				}
				// //
				case NEWLINE: {
					if (code === FOWARDSLASH) {
						return i + 1
					}
				}
			}
		}

		return i
	}

	/**
	 * @param {number} type
	 * @param {number} index
	 * @param {number} length
	 * @param {number} find
	 * @param {string} body
	 * @return {number}
	 */
	function match (type, index, length, body) {
		for (var i = index + 1; i < length; ++i) {
			switch (body.charCodeAt(i)) {
				case type: {
					return i
				}
			}
		}

		return i
	}

	/**
	 * Minify
	 *
	 * @param {(string|*)} output
	 * @return {string}
	 */
	function minify (output) {
		return output
			.replace(formatptn, '')
			.replace(beforeptn, '')
			.replace(afterptn, '$1')
			.replace(tailptn, '$1')
			.replace(whiteptn, ' ')
	}

	/**
	 * Use
	 *
	 * @param {(Array<function(...?)>|function(...?)|number|void)?} plugin
	 */
	function use (plugin) {
		switch (plugin) {
			case void 0:
			case null: {
				plugged = plugins.length = 0
				break
			}
			default: {
				if (typeof plugin === 'function') {
					plugins[plugged++] = plugin
				}	else if (typeof plugin === 'object') {
					for (var i = 0, length = plugin.length; i < length; ++i) {
						use(plugin[i])
					}
				} else {
					unkwn = !!plugin|0
				}
			}
 		}

 		return use
	}

	/**
	 * Set
	 *
	 * @param {*} options
	 */
	function set (options) {
		for (var name in options) {
			var value = options[name]
			switch (name) {
				case 'keyframe': keyed = value|0; break
				case 'global': escape = value|0; break
				case 'cascade': cascade = value|0; break
				case 'compress': compress = value|0; break
				case 'semicolon': semicolon = value|0; break
				case 'preserve': preserve = value|0; break
				case 'prefix':
					should = null

					if (!value) {
						prefix = 0
					} else if (typeof value !== 'function') {
						prefix = 1
					} else {
						prefix = 2
						should = value
					}
			}
		}

		return set
	}

	/**
	 * Stylis
	 *
	 * @param {string} selector
	 * @param {string} input
	 * @return {*}
	 */
	function stylis (selector, input) {
		if (this !== void 0 && this.constructor === stylis) {
			return factory(selector)
		}

		// setup
		var ns = selector
		var code = ns.charCodeAt(0)

		// trim leading whitespace
		if (code < 33) {
			code = (ns = ns.trim()).charCodeAt(0)
		}

		// keyframe/animation namespace
		if (keyed > 0) {
			key = ns.replace(invalidptn, code === OPENBRACKET ? '' : '-')
		}

		// reset, used to assert if a plugin is moneky-patching the return value
		code = 1

		// cascade/isolate
		if (cascade === 1) {
			nscope = ns
		} else {
			nscopealt = ns
		}

		var selectors = [nscope]
		var result

		// execute plugins, pre-process context
		if (plugged > 0) {
			result = proxy(PREPS, input, selectors, selectors, line, column, 0, 0, 0, 0)

			if (result !== void 0 && typeof result === 'string') {
				input = result
			}
		}

		// build
		var output = compile(array, selectors, input, 0, 0)

		// execute plugins, post-process context
		if (plugged > 0) {
			result = proxy(POSTS, output, selectors, selectors, line, column, output.length, 0, 0, 0)

			// bypass minification
			if (result !== void 0 && typeof(output = result) !== 'string') {
				code = 0
			}
		}

		// reset
		key = ''
		nscope = ''
		nscopealt = ''
		pattern = 0
		line = 1
		column = 1

		return compress*code === 0 ? output : minify(output)
	}

	stylis['use'] = use
	stylis['set'] = set

	if (options !== void 0) {
		set(options)
	}

	return stylis
}));

},{}],"../../../../../libs/ui/src/styles/processStyle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processStyle = processStyle;

var _stylis = _interopRequireDefault(require("stylis"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// stylis minify CSS and add vendor prefixes
function processStyle(key, rules) {
  if (key) return (0, _stylis.default)(".".concat(key), rules); // Inline styles does not need the class selector

  var out = (0, _stylis.default)('', rules);
  return out.substr(1, out.length - 2);
}
},{"stylis":"../../../../../libs/ui/node_modules/stylis/stylis.js"}],"../../../../../libs/ui/src/styles/getClasses.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClasses = getClasses;

var _processStyle = require("./processStyle");

function getClasses(registerNumber) {
  var componentStyles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var styleKeys = Object.keys(componentStyles);
  var mapping = {};
  var rules = styleKeys.reduce(function (acum, key) {
    var newClassName = "".concat(key, "--").concat(registerNumber);
    mapping[key] = newClassName;
    return "".concat(acum).concat((0, _processStyle.processStyle)(newClassName, componentStyles[key]));
  }, '');
  return {
    rules: rules,
    mapping: mapping
  };
}
},{"./processStyle":"../../../../../libs/ui/src/styles/processStyle.js"}],"../../../../../libs/ui/src/styles/getStyles.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStyles = getStyles;

var _processStyle = require("./processStyle");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getStyles() {
  var componentStyles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var styleKeys = Object.keys(componentStyles); // Return only inlineStyles to be attached to the component

  return styleKeys.reduce(function (acum, key) {
    var isFunction = typeof componentStyles[key] === 'function';
    return _objectSpread({}, acum, _defineProperty({}, key, isFunction ? function () {
      return (0, _processStyle.processStyle)(null, componentStyles[key].apply(componentStyles, arguments));
    } : (0, _processStyle.processStyle)(null, componentStyles[key])));
  }, {});
}
},{"./processStyle":"../../../../../libs/ui/src/styles/processStyle.js"}],"../../../../../libs/ui/src/styles/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _registerStyles = require("./registerStyles");

var _getClasses = require("./getClasses");

var _getStyles = require("./getStyles");

var _default = {
  registerStyles: _registerStyles.registerStyles,
  getClasses: _getClasses.getClasses,
  getStyles: _getStyles.getStyles
};
exports.default = _default;
},{"./registerStyles":"../../../../../libs/ui/src/styles/registerStyles.js","./getClasses":"../../../../../libs/ui/src/styles/getClasses.js","./getStyles":"../../../../../libs/ui/src/styles/getStyles.js"}],"../../../../../libs/ui/src/hoc/custom/getFinalProps.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFinalProps = getFinalProps;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getFinalProps(args) {
  var store = args.store,
      componentDef = args.componentDef,
      classesMapping = args.classesMapping,
      processedStyles = args.processedStyles;
  var _componentDef$state = componentDef.state,
      state = _componentDef$state === void 0 ? function () {
    return {};
  } : _componentDef$state,
      _componentDef$actions = componentDef.actions,
      actions = _componentDef$actions === void 0 ? function () {
    return {};
  } : _componentDef$actions;

  var classes = _objectSpread({}, Object.keys(classesMapping).reduce(function (acum, key) {
    return _objectSpread({}, acum, _defineProperty({}, key, classesMapping[key]));
  }, {}));

  return function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return {
      props: props,
      state: state(props, store),
      actions: actions(props, store),
      styles: processedStyles,
      classes: classes
    };
  };
}
},{}],"../../../../../libs/ui/src/hoc/custom/getStore.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStore = getStore;

function getStore(Store, registerNumber) {
  return {
    alerts: Store.objects.alerts,
    check: Store.methods.check,
    toggle: Store.methods.toggle,
    measure: Store.utils.measure,
    set: Store.methods.set,
    setItem: Store.methods.setItem,
    call: Store.process.call,
    get: Store.methods.get(registerNumber),
    db: Store.db ? Store.db.query : function () {
      return undefined;
    }
  };
}
},{}],"../../../../../libs/ui/src/hoc/custom/create.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _styles = _interopRequireDefault(require("../../styles"));

var _getFinalProps = require("./getFinalProps");

var _getStore = require("./getStore");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(isBrowser, Store) {
  return function (componentDef) {
    var registerNumber = Store.methods.registerComponent(componentDef);

    var processedClasses = _styles.default.getClasses(registerNumber, componentDef.classes); // Provoque Side Effect for classes styles


    _styles.default.registerStyles(isBrowser, registerNumber, processedClasses.rules);

    var store = (0, _getStore.getStore)(Store, registerNumber);

    var processedStyles = _styles.default.getStyles(componentDef.styles);

    var solveProps = (0, _getFinalProps.getFinalProps)({
      store: store,
      componentDef: componentDef,
      classesMapping: processedClasses.mapping || {},
      processedStyles: processedStyles
    });
    return function renderComponent(props, children) {
      // Called on inital render and every update
      var render = function render() {
        var finalProps = solveProps(props);
        var rendered = componentDef.render(finalProps, children);
        return rendered;
      }; // console.log('-------------------', component);


      var rendered = render();
      return rendered;
    };
  };
};

exports.default = _default;
},{"../../styles":"../../../../../libs/ui/src/styles/index.js","./getFinalProps":"../../../../../libs/ui/src/hoc/custom/getFinalProps.js","./getStore":"../../../../../libs/ui/src/hoc/custom/getStore.js"}],"../../../../../libs/ui/src/hoc/createHoc.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHoc = createHoc;

var _create = _interopRequireDefault(require("./custom/create"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createHoc(isBrowser) {
  return function (Store) {
    return (0, _create.default)(isBrowser, Store);
  };
}
},{"./custom/create":"../../../../../libs/ui/src/hoc/custom/create.js"}],"../../../../../libs/ui/src/lit-html-server/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.unsafeHTML = exports.guard = exports.repeat = exports.html = void 0;
var unsafeCode = '@__unsafe__';

function manageFunction(str) {
  var indexOfHandler = str.indexOf('@');
  return str.substr(0, indexOfHandler).trim();
}

function manageVal(leftValue, str) {
  var isArray = Array.isArray(str);
  if (isArray) return str.join('');

  if (str.length === 0) {
    if (leftValue.endsWith('=')) return '""';
    return '';
  }

  if (str.indexOf(unsafeCode) > -1) return str.replace(unsafeCode, '');
  if (str.match(/\r|\n/)) return str;
  return "\"".concat(str, "\"");
}

var html = function html(fixed) {
  for (var _len = arguments.length, dynamic = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    dynamic[_key - 1] = arguments[_key];
  }

  return fixed.reduce(function (acum, value, i) {
    var dynVal = dynamic[i] || '';
    var isFunction = typeof dynVal === 'function';
    if (isFunction) return "".concat(acum).concat(manageFunction(value));
    var valString = manageVal(value, String(dynVal));
    return "".concat(acum).concat(value).concat(valString).replace(/>\s*,\s*</, '><');
  }, '');
};

exports.html = html;

var repeat = function repeat(data, key, render) {
  return data.map(render);
};

exports.repeat = repeat;

var guard = function guard(item, render) {
  return render();
};

exports.guard = guard;

var unsafeHTML = function unsafeHTML(htmlString) {
  return "".concat(unsafeCode).concat(htmlString.trim());
}; // Not used in SSR


exports.unsafeHTML = unsafeHTML;

var render = function render() {
  return undefined;
};

exports.render = render;
},{}],"../../../../../libs/ui/node_modules/lit-html/lib/directive.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDirective = exports.directive = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive so that lit-html will call the function
 * during template rendering, rather than passing as a value.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object
 *
 * @example
 *
 * ```
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 * ```
 */

const directive = f => (...args) => {
  const d = f(...args);
  directives.set(d, true);
  return d;
};

exports.directive = directive;

const isDirective = o => typeof o === 'function' && directives.has(o);

exports.isDirective = isDirective;
},{}],"../../../../../libs/ui/node_modules/lit-html/lib/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNodes = exports.reparentNodes = exports.isCEPolyfill = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isCEPolyfill = window.customElements !== undefined && window.customElements.polyfillWrapFlushCallback !== undefined;
/**
 * Reparents nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), into another container (could be the same container), before
 * `beforeNode`. If `beforeNode` is null, it appends the nodes to the
 * container.
 */

exports.isCEPolyfill = isCEPolyfill;

const reparentNodes = (container, start, end = null, before = null) => {
  let node = start;

  while (node !== end) {
    const n = node.nextSibling;
    container.insertBefore(node, before);
    node = n;
  }
};
/**
 * Removes nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), from `container`.
 */


exports.reparentNodes = reparentNodes;

const removeNodes = (container, startNode, endNode = null) => {
  let node = startNode;

  while (node !== endNode) {
    const n = node.nextSibling;
    container.removeChild(node);
    node = n;
  }
};

exports.removeNodes = removeNodes;
},{}],"../../../../../libs/ui/node_modules/lit-html/lib/part.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noChange = void 0;

/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
exports.noChange = noChange;
},{}],"../../../../../libs/ui/node_modules/lit-html/lib/template.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastAttributeNameRegex = exports.createMarker = exports.isTemplatePartActive = exports.Template = exports.boundAttributeSuffix = exports.markerRegex = exports.nodeMarker = exports.marker = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */

exports.marker = marker;
const nodeMarker = `<!--${marker}-->`;
exports.nodeMarker = nodeMarker;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */

exports.markerRegex = markerRegex;
const boundAttributeSuffix = '$lit$';
/**
 * An updateable Template that tracks the location of dynamic parts.
 */

exports.boundAttributeSuffix = boundAttributeSuffix;

class Template {
  constructor(result, element) {
    this.parts = [];
    this.element = element;
    let index = -1;
    let partIndex = 0;
    const nodesToRemove = [];

    const _prepareTemplate = template => {
      const content = template.content; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
      // null

      const walker = document.createTreeWalker(content, 133
      /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
      NodeFilter.SHOW_TEXT */
      , null, false); // The actual previous node, accounting for removals: if a node is removed
      // it will never be the previousNode.

      let previousNode; // Used to set previousNode at the top of the loop.

      let currentNode;

      while (walker.nextNode()) {
        index++;
        previousNode = currentNode;
        const node = currentNode = walker.currentNode;

        if (node.nodeType === 1
        /* Node.ELEMENT_NODE */
        ) {
            if (node.hasAttributes()) {
              const attributes = node.attributes; // Per
              // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
              // attributes are not guaranteed to be returned in document order.
              // In particular, Edge/IE can return them out of order, so we cannot
              // assume a correspondance between part index and attribute index.

              let count = 0;

              for (let i = 0; i < attributes.length; i++) {
                if (attributes[i].value.indexOf(marker) >= 0) {
                  count++;
                }
              }

              while (count-- > 0) {
                // Get the template literal section leading up to the first
                // expression in this attribute
                const stringForPart = result.strings[partIndex]; // Find the attribute name

                const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
                // All bound attributes have had a suffix added in
                // TemplateResult#getHTML to opt out of special attribute
                // handling. To look up the attribute value we also need to add
                // the suffix.

                const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                const attributeValue = node.getAttribute(attributeLookupName);
                const strings = attributeValue.split(markerRegex);
                this.parts.push({
                  type: 'attribute',
                  index,
                  name,
                  strings
                });
                node.removeAttribute(attributeLookupName);
                partIndex += strings.length - 1;
              }
            }

            if (node.tagName === 'TEMPLATE') {
              _prepareTemplate(node);
            }
          } else if (node.nodeType === 3
        /* Node.TEXT_NODE */
        ) {
            const nodeValue = node.nodeValue;

            if (nodeValue.indexOf(marker) < 0) {
              continue;
            }

            const parent = node.parentNode;
            const strings = nodeValue.split(markerRegex);
            const lastIndex = strings.length - 1; // We have a part for each match found

            partIndex += lastIndex; // Generate a new text node for each literal section
            // These nodes are also used as the markers for node parts

            for (let i = 0; i < lastIndex; i++) {
              parent.insertBefore(strings[i] === '' ? createMarker() : document.createTextNode(strings[i]), node);
              this.parts.push({
                type: 'node',
                index: index++
              });
            }

            parent.insertBefore(strings[lastIndex] === '' ? createMarker() : document.createTextNode(strings[lastIndex]), node);
            nodesToRemove.push(node);
          } else if (node.nodeType === 8
        /* Node.COMMENT_NODE */
        ) {
            if (node.nodeValue === marker) {
              const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
              // the following are true:
              //  * We don't have a previousSibling
              //  * previousSibling is being removed (thus it's not the
              //    `previousNode`)
              //  * previousSibling is not a Text node
              //
              // TODO(justinfagnani): We should be able to use the previousNode
              // here as the marker node and reduce the number of extra nodes we
              // add to a template. See
              // https://github.com/PolymerLabs/lit-html/issues/147

              const previousSibling = node.previousSibling;

              if (previousSibling === null || previousSibling !== previousNode || previousSibling.nodeType !== Node.TEXT_NODE) {
                parent.insertBefore(createMarker(), node);
              } else {
                index--;
              }

              this.parts.push({
                type: 'node',
                index: index++
              });
              nodesToRemove.push(node); // If we don't have a nextSibling add a marker node.
              // We don't have to check if the next node is going to be removed,
              // because that node will induce a new marker if so.

              if (node.nextSibling === null) {
                parent.insertBefore(createMarker(), node);
              } else {
                index--;
              }

              currentNode = previousNode;
              partIndex++;
            } else {
              let i = -1;

              while ((i = node.nodeValue.indexOf(marker, i + 1)) !== -1) {
                // Comment node has a binding marker inside, make an inactive part
                // The binding won't work, but subsequent bindings will
                // TODO (justinfagnani): consider whether it's even worth it to
                // make bindings in comments work
                this.parts.push({
                  type: 'node',
                  index: -1
                });
              }
            }
          }
      }
    };

    _prepareTemplate(element); // Remove text binding nodes after the walk to not disturb the TreeWalker


    for (const n of nodesToRemove) {
      n.parentNode.removeChild(n);
    }
  }

}

exports.Template = Template;

const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
// small manual size-savings.


exports.isTemplatePartActive = isTemplatePartActive;

const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#attributes-0
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-character
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */


exports.createMarker = createMarker;
const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
exports.lastAttributeNameRegex = lastAttributeNameRegex;
},{}],"../../../../../libs/ui/node_modules/lit-html/lib/template-instance.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplateInstance = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
  constructor(template, processor, options) {
    this._parts = [];
    this.template = template;
    this.processor = processor;
    this.options = options;
  }

  update(values) {
    let i = 0;

    for (const part of this._parts) {
      if (part !== undefined) {
        part.setValue(values[i]);
      }

      i++;
    }

    for (const part of this._parts) {
      if (part !== undefined) {
        part.commit();
      }
    }
  }

  _clone() {
    // When using the Custom Elements polyfill, clone the node, rather than
    // importing it, to keep the fragment in the template's document. This
    // leaves the fragment inert so custom elements won't upgrade and
    // potentially modify their contents by creating a polyfilled ShadowRoot
    // while we traverse the tree.
    const fragment = _dom.isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
    const parts = this.template.parts;
    let partIndex = 0;
    let nodeIndex = 0;

    const _prepareInstance = fragment => {
      // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
      // null
      const walker = document.createTreeWalker(fragment, 133
      /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
      , null, false);
      let node = walker.nextNode(); // Loop through all the nodes and parts of a template

      while (partIndex < parts.length && node !== null) {
        const part = parts[partIndex]; // Consecutive Parts may have the same node index, in the case of
        // multiple bound attributes on an element. So each iteration we either
        // increment the nodeIndex, if we aren't on a node with a part, or the
        // partIndex if we are. By not incrementing the nodeIndex when we find a
        // part, we allow for the next part to be associated with the current
        // node if neccessasry.

        if (!(0, _template.isTemplatePartActive)(part)) {
          this._parts.push(undefined);

          partIndex++;
        } else if (nodeIndex === part.index) {
          if (part.type === 'node') {
            const part = this.processor.handleTextExpression(this.options);
            part.insertAfterNode(node);

            this._parts.push(part);
          } else {
            this._parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
          }

          partIndex++;
        } else {
          nodeIndex++;

          if (node.nodeName === 'TEMPLATE') {
            _prepareInstance(node.content);
          }

          node = walker.nextNode();
        }
      }
    };

    _prepareInstance(fragment);

    if (_dom.isCEPolyfill) {
      document.adoptNode(fragment);
      customElements.upgrade(fragment);
    }

    return fragment;
  }

}

exports.TemplateInstance = TemplateInstance;
},{"./dom.js":"../../../../../libs/ui/node_modules/lit-html/lib/dom.js","./template.js":"../../../../../libs/ui/node_modules/lit-html/lib/template.js"}],"../../../../../libs/ui/node_modules/lit-html/lib/template-result.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVGTemplateResult = exports.TemplateResult = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
  constructor(strings, values, type, processor) {
    this.strings = strings;
    this.values = values;
    this.type = type;
    this.processor = processor;
  }
  /**
   * Returns a string of HTML used to create a `<template>` element.
   */


  getHTML() {
    const endIndex = this.strings.length - 1;
    let html = '';

    for (let i = 0; i < endIndex; i++) {
      const s = this.strings[i]; // This replace() call does two things:
      // 1) Appends a suffix to all bound attribute names to opt out of special
      // attribute value parsing that IE11 and Edge do, like for style and
      // many SVG attributes. The Template class also appends the same suffix
      // when looking up attributes to creat Parts.
      // 2) Adds an unquoted-attribute-safe marker for the first expression in
      // an attribute. Subsequent attribute expressions will use node markers,
      // and this is safe since attributes with multiple expressions are
      // guaranteed to be quoted.

      let addedMarker = false;
      html += s.replace(_template.lastAttributeNameRegex, (_match, whitespace, name, value) => {
        addedMarker = true;
        return whitespace + name + _template.boundAttributeSuffix + value + _template.marker;
      });

      if (!addedMarker) {
        html += _template.nodeMarker;
      }
    }

    return html + this.strings[endIndex];
  }

  getTemplateElement() {
    const template = document.createElement('template');
    template.innerHTML = this.getHTML();
    return template;
  }

}
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTMl in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */


exports.TemplateResult = TemplateResult;

class SVGTemplateResult extends TemplateResult {
  getHTML() {
    return `<svg>${super.getHTML()}</svg>`;
  }

  getTemplateElement() {
    const template = super.getTemplateElement();
    const content = template.content;
    const svgElement = content.firstChild;
    content.removeChild(svgElement);
    (0, _dom.reparentNodes)(content, svgElement.firstChild);
    return template;
  }

}

exports.SVGTemplateResult = SVGTemplateResult;
},{"./dom.js":"../../../../../libs/ui/node_modules/lit-html/lib/dom.js","./template.js":"../../../../../libs/ui/node_modules/lit-html/lib/template.js"}],"../../../../../libs/ui/node_modules/lit-html/lib/parts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventPart = exports.PropertyPart = exports.PropertyCommitter = exports.BooleanAttributePart = exports.NodePart = exports.AttributePart = exports.AttributeCommitter = exports.isPrimitive = void 0;

var _directive = require("./directive.js");

var _dom = require("./dom.js");

var _part = require("./part.js");

var _templateInstance = require("./template-instance.js");

var _templateResult = require("./template-result.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isPrimitive = value => value === null || !(typeof value === 'object' || typeof value === 'function');
/**
 * Sets attribute values for AttributeParts, so that the value is only set once
 * even if there are multiple parts for an attribute.
 */


exports.isPrimitive = isPrimitive;

class AttributeCommitter {
  constructor(element, name, strings) {
    this.dirty = true;
    this.element = element;
    this.name = name;
    this.strings = strings;
    this.parts = [];

    for (let i = 0; i < strings.length - 1; i++) {
      this.parts[i] = this._createPart();
    }
  }
  /**
   * Creates a single part. Override this to create a differnt type of part.
   */


  _createPart() {
    return new AttributePart(this);
  }

  _getValue() {
    const strings = this.strings;
    const l = strings.length - 1;
    let text = '';

    for (let i = 0; i < l; i++) {
      text += strings[i];
      const part = this.parts[i];

      if (part !== undefined) {
        const v = part.value;

        if (v != null && (Array.isArray(v) || typeof v !== 'string' && v[Symbol.iterator])) {
          for (const t of v) {
            text += typeof t === 'string' ? t : String(t);
          }
        } else {
          text += typeof v === 'string' ? v : String(v);
        }
      }
    }

    text += strings[l];
    return text;
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element.setAttribute(this.name, this._getValue());
    }
  }

}

exports.AttributeCommitter = AttributeCommitter;

class AttributePart {
  constructor(comitter) {
    this.value = undefined;
    this.committer = comitter;
  }

  setValue(value) {
    if (value !== _part.noChange && (!isPrimitive(value) || value !== this.value)) {
      this.value = value; // If the value is a not a directive, dirty the committer so that it'll
      // call setAttribute. If the value is a directive, it'll dirty the
      // committer if it calls setValue().

      if (!(0, _directive.isDirective)(value)) {
        this.committer.dirty = true;
      }
    }
  }

  commit() {
    while ((0, _directive.isDirective)(this.value)) {
      const directive = this.value;
      this.value = _part.noChange;
      directive(this);
    }

    if (this.value === _part.noChange) {
      return;
    }

    this.committer.commit();
  }

}

exports.AttributePart = AttributePart;

class NodePart {
  constructor(options) {
    this.value = undefined;
    this._pendingValue = undefined;
    this.options = options;
  }
  /**
   * Inserts this part into a container.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendInto(container) {
    this.startNode = container.appendChild((0, _template.createMarker)());
    this.endNode = container.appendChild((0, _template.createMarker)());
  }
  /**
   * Inserts this part between `ref` and `ref`'s next sibling. Both `ref` and
   * its next sibling must be static, unchanging nodes such as those that appear
   * in a literal section of a template.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterNode(ref) {
    this.startNode = ref;
    this.endNode = ref.nextSibling;
  }
  /**
   * Appends this part into a parent part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendIntoPart(part) {
    part._insert(this.startNode = (0, _template.createMarker)());

    part._insert(this.endNode = (0, _template.createMarker)());
  }
  /**
   * Appends this part after `ref`
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterPart(ref) {
    ref._insert(this.startNode = (0, _template.createMarker)());

    this.endNode = ref.endNode;
    ref.endNode = this.startNode;
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this._pendingValue)) {
      const directive = this._pendingValue;
      this._pendingValue = _part.noChange;
      directive(this);
    }

    const value = this._pendingValue;

    if (value === _part.noChange) {
      return;
    }

    if (isPrimitive(value)) {
      if (value !== this.value) {
        this._commitText(value);
      }
    } else if (value instanceof _templateResult.TemplateResult) {
      this._commitTemplateResult(value);
    } else if (value instanceof Node) {
      this._commitNode(value);
    } else if (Array.isArray(value) || value[Symbol.iterator]) {
      this._commitIterable(value);
    } else {
      // Fallback, will render the string representation
      this._commitText(value);
    }
  }

  _insert(node) {
    this.endNode.parentNode.insertBefore(node, this.endNode);
  }

  _commitNode(value) {
    if (this.value === value) {
      return;
    }

    this.clear();

    this._insert(value);

    this.value = value;
  }

  _commitText(value) {
    const node = this.startNode.nextSibling;
    value = value == null ? '' : value;

    if (node === this.endNode.previousSibling && node.nodeType === Node.TEXT_NODE) {
      // If we only have a single text node between the markers, we can just
      // set its value, rather than replacing it.
      // TODO(justinfagnani): Can we just check if this.value is primitive?
      node.textContent = value;
    } else {
      this._commitNode(document.createTextNode(typeof value === 'string' ? value : String(value)));
    }

    this.value = value;
  }

  _commitTemplateResult(value) {
    const template = this.options.templateFactory(value);

    if (this.value && this.value.template === template) {
      this.value.update(value.values);
    } else {
      // Make sure we propagate the template processor from the TemplateResult
      // so that we use its syntax extension, etc. The template factory comes
      // from the render function options so that it can control template
      // caching and preprocessing.
      const instance = new _templateInstance.TemplateInstance(template, value.processor, this.options);

      const fragment = instance._clone();

      instance.update(value.values);

      this._commitNode(fragment);

      this.value = instance;
    }
  }

  _commitIterable(value) {
    // For an Iterable, we create a new InstancePart per item, then set its
    // value to the item. This is a little bit of overhead for every item in
    // an Iterable, but it lets us recurse easily and efficiently update Arrays
    // of TemplateResults that will be commonly returned from expressions like:
    // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
    // If _value is an array, then the previous render was of an
    // iterable and _value will contain the NodeParts from the previous
    // render. If _value is not an array, clear this part and make a new
    // array for NodeParts.
    if (!Array.isArray(this.value)) {
      this.value = [];
      this.clear();
    } // Lets us keep track of how many items we stamped so we can clear leftover
    // items from a previous render


    const itemParts = this.value;
    let partIndex = 0;
    let itemPart;

    for (const item of value) {
      // Try to reuse an existing part
      itemPart = itemParts[partIndex]; // If no existing part, create a new one

      if (itemPart === undefined) {
        itemPart = new NodePart(this.options);
        itemParts.push(itemPart);

        if (partIndex === 0) {
          itemPart.appendIntoPart(this);
        } else {
          itemPart.insertAfterPart(itemParts[partIndex - 1]);
        }
      }

      itemPart.setValue(item);
      itemPart.commit();
      partIndex++;
    }

    if (partIndex < itemParts.length) {
      // Truncate the parts array so _value reflects the current state
      itemParts.length = partIndex;
      this.clear(itemPart && itemPart.endNode);
    }
  }

  clear(startNode = this.startNode) {
    (0, _dom.removeNodes)(this.startNode.parentNode, startNode.nextSibling, this.endNode);
  }

}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */


exports.NodePart = NodePart;

class BooleanAttributePart {
  constructor(element, name, strings) {
    this.value = undefined;
    this._pendingValue = undefined;

    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
      throw new Error('Boolean attributes can only contain a single expression');
    }

    this.element = element;
    this.name = name;
    this.strings = strings;
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this._pendingValue)) {
      const directive = this._pendingValue;
      this._pendingValue = _part.noChange;
      directive(this);
    }

    if (this._pendingValue === _part.noChange) {
      return;
    }

    const value = !!this._pendingValue;

    if (this.value !== value) {
      if (value) {
        this.element.setAttribute(this.name, '');
      } else {
        this.element.removeAttribute(this.name);
      }
    }

    this.value = value;
    this._pendingValue = _part.noChange;
  }

}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */


exports.BooleanAttributePart = BooleanAttributePart;

class PropertyCommitter extends AttributeCommitter {
  constructor(element, name, strings) {
    super(element, name, strings);
    this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
  }

  _createPart() {
    return new PropertyPart(this);
  }

  _getValue() {
    if (this.single) {
      return this.parts[0].value;
    }

    return super._getValue();
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element[this.name] = this._getValue();
    }
  }

}

exports.PropertyCommitter = PropertyCommitter;

class PropertyPart extends AttributePart {} // Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the thrid
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.


exports.PropertyPart = PropertyPart;
let eventOptionsSupported = false;

try {
  const options = {
    get capture() {
      eventOptionsSupported = true;
      return false;
    }

  };
  window.addEventListener('test', options, options);
  window.removeEventListener('test', options, options);
} catch (_e) {}

class EventPart {
  constructor(element, eventName, eventContext) {
    this.value = undefined;
    this._pendingValue = undefined;
    this.element = element;
    this.eventName = eventName;
    this.eventContext = eventContext;

    this._boundHandleEvent = e => this.handleEvent(e);
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this._pendingValue)) {
      const directive = this._pendingValue;
      this._pendingValue = _part.noChange;
      directive(this);
    }

    if (this._pendingValue === _part.noChange) {
      return;
    }

    const newListener = this._pendingValue;
    const oldListener = this.value;
    const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
    const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

    if (shouldRemoveListener) {
      this.element.removeEventListener(this.eventName, this._boundHandleEvent, this._options);
    }

    if (shouldAddListener) {
      this._options = getOptions(newListener);
      this.element.addEventListener(this.eventName, this._boundHandleEvent, this._options);
    }

    this.value = newListener;
    this._pendingValue = _part.noChange;
  }

  handleEvent(event) {
    if (typeof this.value === 'function') {
      this.value.call(this.eventContext || this.element, event);
    } else {
      this.value.handleEvent(event);
    }
  }

} // We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.


exports.EventPart = EventPart;

const getOptions = o => o && (eventOptionsSupported ? {
  capture: o.capture,
  passive: o.passive,
  once: o.once
} : o.capture);
},{"./directive.js":"../../../../../libs/ui/node_modules/lit-html/lib/directive.js","./dom.js":"../../../../../libs/ui/node_modules/lit-html/lib/dom.js","./part.js":"../../../../../libs/ui/node_modules/lit-html/lib/part.js","./template-instance.js":"../../../../../libs/ui/node_modules/lit-html/lib/template-instance.js","./template-result.js":"../../../../../libs/ui/node_modules/lit-html/lib/template-result.js","./template.js":"../../../../../libs/ui/node_modules/lit-html/lib/template.js"}],"../../../../../libs/ui/node_modules/lit-html/lib/default-template-processor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultTemplateProcessor = exports.DefaultTemplateProcessor = void 0;

var _parts = require("./parts.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
  /**
   * Create parts for an attribute-position binding, given the event, attribute
   * name, and string literals.
   *
   * @param element The element containing the binding
   * @param name  The attribute name
   * @param strings The string literals. There are always at least two strings,
   *   event for fully-controlled bindings with a single expression.
   */
  handleAttributeExpressions(element, name, strings, options) {
    const prefix = name[0];

    if (prefix === '.') {
      const comitter = new _parts.PropertyCommitter(element, name.slice(1), strings);
      return comitter.parts;
    }

    if (prefix === '@') {
      return [new _parts.EventPart(element, name.slice(1), options.eventContext)];
    }

    if (prefix === '?') {
      return [new _parts.BooleanAttributePart(element, name.slice(1), strings)];
    }

    const comitter = new _parts.AttributeCommitter(element, name, strings);
    return comitter.parts;
  }
  /**
   * Create parts for a text-position binding.
   * @param templateFactory
   */


  handleTextExpression(options) {
    return new _parts.NodePart(options);
  }

}

exports.DefaultTemplateProcessor = DefaultTemplateProcessor;
const defaultTemplateProcessor = new DefaultTemplateProcessor();
exports.defaultTemplateProcessor = defaultTemplateProcessor;
},{"./parts.js":"../../../../../libs/ui/node_modules/lit-html/lib/parts.js"}],"../../../../../libs/ui/node_modules/lit-html/lib/template-factory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templateFactory = templateFactory;
exports.templateCaches = void 0;

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
  let templateCache = templateCaches.get(result.type);

  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };
    templateCaches.set(result.type, templateCache);
  }

  let template = templateCache.stringsArray.get(result.strings);

  if (template !== undefined) {
    return template;
  } // If the TemplateStringsArray is new, generate a key from the strings
  // This key is shared between all templates with identical content


  const key = result.strings.join(_template.marker); // Check if we already have a Template for this key

  template = templateCache.keyString.get(key);

  if (template === undefined) {
    // If we have not seen this key before, create a new Template
    template = new _template.Template(result, result.getTemplateElement()); // Cache the Template for this key

    templateCache.keyString.set(key, template);
  } // Cache all future queries for this TemplateStringsArray


  templateCache.stringsArray.set(result.strings, template);
  return template;
}

const templateCaches = new Map();
exports.templateCaches = templateCaches;
},{"./template.js":"../../../../../libs/ui/node_modules/lit-html/lib/template.js"}],"../../../../../libs/ui/node_modules/lit-html/lib/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.parts = void 0;

var _dom = require("./dom.js");

var _parts = require("./parts.js");

var _templateFactory = require("./template-factory.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const parts = new WeakMap();
/**
 * Renders a template to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result a TemplateResult created by evaluating a template tag like
 *     `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */

exports.parts = parts;

const render = (result, container, options) => {
  let part = parts.get(container);

  if (part === undefined) {
    (0, _dom.removeNodes)(container, container.firstChild);
    parts.set(container, part = new _parts.NodePart(Object.assign({
      templateFactory: _templateFactory.templateFactory
    }, options)));
    part.appendInto(container);
  }

  part.setValue(result);
  part.commit();
};

exports.render = render;
},{"./dom.js":"../../../../../libs/ui/node_modules/lit-html/lib/dom.js","./parts.js":"../../../../../libs/ui/node_modules/lit-html/lib/parts.js","./template-factory.js":"../../../../../libs/ui/node_modules/lit-html/lib/template-factory.js"}],"../../../../../libs/ui/node_modules/lit-html/lit-html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DefaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.DefaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "defaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.defaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "SVGTemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.SVGTemplateResult;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.TemplateResult;
  }
});
Object.defineProperty(exports, "directive", {
  enumerable: true,
  get: function () {
    return _directive.directive;
  }
});
Object.defineProperty(exports, "isDirective", {
  enumerable: true,
  get: function () {
    return _directive.isDirective;
  }
});
Object.defineProperty(exports, "removeNodes", {
  enumerable: true,
  get: function () {
    return _dom.removeNodes;
  }
});
Object.defineProperty(exports, "reparentNodes", {
  enumerable: true,
  get: function () {
    return _dom.reparentNodes;
  }
});
Object.defineProperty(exports, "noChange", {
  enumerable: true,
  get: function () {
    return _part.noChange;
  }
});
Object.defineProperty(exports, "AttributeCommitter", {
  enumerable: true,
  get: function () {
    return _parts.AttributeCommitter;
  }
});
Object.defineProperty(exports, "AttributePart", {
  enumerable: true,
  get: function () {
    return _parts.AttributePart;
  }
});
Object.defineProperty(exports, "BooleanAttributePart", {
  enumerable: true,
  get: function () {
    return _parts.BooleanAttributePart;
  }
});
Object.defineProperty(exports, "EventPart", {
  enumerable: true,
  get: function () {
    return _parts.EventPart;
  }
});
Object.defineProperty(exports, "isPrimitive", {
  enumerable: true,
  get: function () {
    return _parts.isPrimitive;
  }
});
Object.defineProperty(exports, "NodePart", {
  enumerable: true,
  get: function () {
    return _parts.NodePart;
  }
});
Object.defineProperty(exports, "PropertyCommitter", {
  enumerable: true,
  get: function () {
    return _parts.PropertyCommitter;
  }
});
Object.defineProperty(exports, "PropertyPart", {
  enumerable: true,
  get: function () {
    return _parts.PropertyPart;
  }
});
Object.defineProperty(exports, "parts", {
  enumerable: true,
  get: function () {
    return _render.parts;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _render.render;
  }
});
Object.defineProperty(exports, "templateCaches", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateCaches;
  }
});
Object.defineProperty(exports, "templateFactory", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateFactory;
  }
});
Object.defineProperty(exports, "TemplateInstance", {
  enumerable: true,
  get: function () {
    return _templateInstance.TemplateInstance;
  }
});
Object.defineProperty(exports, "createMarker", {
  enumerable: true,
  get: function () {
    return _template.createMarker;
  }
});
Object.defineProperty(exports, "isTemplatePartActive", {
  enumerable: true,
  get: function () {
    return _template.isTemplatePartActive;
  }
});
Object.defineProperty(exports, "Template", {
  enumerable: true,
  get: function () {
    return _template.Template;
  }
});
exports.svg = exports.html = void 0;

var _defaultTemplateProcessor = require("./lib/default-template-processor.js");

var _templateResult = require("./lib/template-result.js");

var _directive = require("./lib/directive.js");

var _dom = require("./lib/dom.js");

var _part = require("./lib/part.js");

var _parts = require("./lib/parts.js");

var _render = require("./lib/render.js");

var _templateFactory = require("./lib/template-factory.js");

var _templateInstance = require("./lib/template-instance.js");

var _template = require("./lib/template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// TODO(justinfagnani): remove line when we get NodePart moving methods

/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => new _templateResult.TemplateResult(strings, values, 'html', _defaultTemplateProcessor.defaultTemplateProcessor);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */


exports.html = html;

const svg = (strings, ...values) => new _templateResult.SVGTemplateResult(strings, values, 'svg', _defaultTemplateProcessor.defaultTemplateProcessor);

exports.svg = svg;
},{"./lib/default-template-processor.js":"../../../../../libs/ui/node_modules/lit-html/lib/default-template-processor.js","./lib/template-result.js":"../../../../../libs/ui/node_modules/lit-html/lib/template-result.js","./lib/directive.js":"../../../../../libs/ui/node_modules/lit-html/lib/directive.js","./lib/dom.js":"../../../../../libs/ui/node_modules/lit-html/lib/dom.js","./lib/part.js":"../../../../../libs/ui/node_modules/lit-html/lib/part.js","./lib/parts.js":"../../../../../libs/ui/node_modules/lit-html/lib/parts.js","./lib/render.js":"../../../../../libs/ui/node_modules/lit-html/lib/render.js","./lib/template-factory.js":"../../../../../libs/ui/node_modules/lit-html/lib/template-factory.js","./lib/template-instance.js":"../../../../../libs/ui/node_modules/lit-html/lib/template-instance.js","./lib/template.js":"../../../../../libs/ui/node_modules/lit-html/lib/template.js"}],"../../../../../libs/ui/node_modules/lit-html/directives/repeat.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.repeat = void 0;

var _litHtml = require("../lit-html.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// Helper functions for manipulating parts
// TODO(kschaaf): Refactor into Part API?
const createAndInsertPart = (containerPart, beforePart) => {
  const container = containerPart.startNode.parentNode;
  const beforeNode = beforePart === undefined ? containerPart.endNode : beforePart.startNode;
  const startNode = container.insertBefore((0, _litHtml.createMarker)(), beforeNode);
  container.insertBefore((0, _litHtml.createMarker)(), beforeNode);
  const newPart = new _litHtml.NodePart(containerPart.options);
  newPart.insertAfterNode(startNode);
  return newPart;
};

const updatePart = (part, value) => {
  part.setValue(value);
  part.commit();
  return part;
};

const insertPartBefore = (containerPart, part, ref) => {
  const container = containerPart.startNode.parentNode;
  const beforeNode = ref ? ref.startNode : containerPart.endNode;
  const endNode = part.endNode.nextSibling;

  if (endNode !== beforeNode) {
    (0, _litHtml.reparentNodes)(container, part.startNode, endNode, beforeNode);
  }
};

const removePart = part => {
  (0, _litHtml.removeNodes)(part.startNode.parentNode, part.startNode, part.endNode.nextSibling);
}; // Helper for generating a map of array item to its index over a subset
// of an array (used to lazily generate `newKeyToIndexMap` and
// `oldKeyToIndexMap`)


const generateMap = (list, start, end) => {
  const map = new Map();

  for (let i = start; i <= end; i++) {
    map.set(list[i], i);
  }

  return map;
}; // Stores previous ordered list of parts and map of key to index


const partListCache = new WeakMap();
const keyListCache = new WeakMap();
/**
 * A directive that repeats a series of values (usually `TemplateResults`)
 * generated from an iterable, and updates those items efficiently when the
 * iterable changes based on user-provided `keys` associated with each item.
 *
 * Note that if a `keyFn` is provided, strict key-to-DOM mapping is maintained,
 * meaning previous DOM for a given key is moved into the new position if
 * needed, and DOM will never be reused with values for different keys (new DOM
 * will always be created for new keys). This is generally the most efficient
 * way to use `repeat` since it performs minimum unnecessary work for insertions
 * amd removals.
 *
 * IMPORTANT: If providing a `keyFn`, keys *must* be unique for all items in a
 * given call to `repeat`. The behavior when two or more items have the same key
 * is undefined.
 *
 * If no `keyFn` is provided, this directive will perform similar to mapping
 * items to values, and DOM will be reused against potentially different items.
 */

const repeat = (0, _litHtml.directive)((items, keyFnOrTemplate, template) => {
  let keyFn;

  if (template === undefined) {
    template = keyFnOrTemplate;
  } else if (keyFnOrTemplate !== undefined) {
    keyFn = keyFnOrTemplate;
  }

  return containerPart => {
    if (!(containerPart instanceof _litHtml.NodePart)) {
      throw new Error('repeat can only be used in text bindings');
    } // Old part & key lists are retrieved from the last update (associated
    // with the part for this instance of the directive)


    const oldParts = partListCache.get(containerPart) || [];
    const oldKeys = keyListCache.get(containerPart) || []; // New part list will be built up as we go (either reused from old parts
    // or created for new keys in this update). This is saved in the above
    // cache at the end of the update.

    const newParts = []; // New value list is eagerly generated from items along with a parallel
    // array indicating its key.

    const newValues = [];
    const newKeys = [];
    let index = 0;

    for (const item of items) {
      newKeys[index] = keyFn ? keyFn(item, index) : index;
      newValues[index] = template(item, index);
      index++;
    } // Maps from key to index for current and previous update; these are
    // generated lazily only when needed as a performance optimization,
    // since they are only required for multiple non-contiguous changes in
    // the list, which are less common.


    let newKeyToIndexMap;
    let oldKeyToIndexMap; // Head and tail pointers to old parts and new values

    let oldHead = 0;
    let oldTail = oldParts.length - 1;
    let newHead = 0;
    let newTail = newValues.length - 1; // Overview of O(n) reconciliation algorithm (general approach based on
    // ideas found in ivi, vue, snabbdom, etc.):
    //
    // * We start with the list of old parts and new values (and arrays of
    //   their respective keys), head/tail pointers into each, and we build
    //   up the new list of parts by updating (and when needed, moving) old
    //   parts or creating new ones. The initial scenario might look like
    //   this (for brevity of the diagrams, the numbers in the array reflect
    //   keys associated with the old parts or new values, although keys and
    //   parts/values are actually stored in parallel arrays indexed using
    //   the same head/tail pointers):
    //
    //      oldHead v                 v oldTail
    //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
    //   newParts: [ ,  ,  ,  ,  ,  ,  ]
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6] <- reflects the user's new item
    //   order
    //      newHead ^                 ^ newTail
    //
    // * Iterate old & new lists from both sides, updating, swapping, or
    //   removing parts at the head/tail locations until neither head nor
    //   tail can move.
    //
    // * Example below: keys at head pointers match, so update old part 0
    // in-
    //   place (no need to move it) and record part 0 in the `newParts`
    //   list. The last thing we do is advance the `oldHead` and `newHead`
    //   pointers (will be reflected in the next diagram).
    //
    //      oldHead v                 v oldTail
    //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
    //   newParts: [0,  ,  ,  ,  ,  ,  ] <- heads matched: update 0 and
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    advance both oldHead & newHead
    //      newHead ^                 ^ newTail
    //
    // * Example below: head pointers don't match, but tail pointers do, so
    //   update part 6 in place (no need to move it), and record part 6 in
    //   the `newParts` list. Last, advance the `oldTail` and `oldHead`
    //   pointers.
    //
    //         oldHead v              v oldTail
    //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
    //   newParts: [0,  ,  ,  ,  ,  , 6] <- tails matched: update 6 and
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    advance both oldTail & newTail
    //         newHead ^              ^ newTail
    //
    // * If neither head nor tail match; next check if one of the old
    // head/tail
    //   items was removed. We first need to generate the reverse map of new
    //   keys to index (`newKeyToIndexMap`), which is done once lazily as a
    //   performance optimization, since we only hit this case if multiple
    //   non-contiguous changes were made. Note that for contiguous removal
    //   anywhere in the list, the head and tails would advance from either
    //   end and pass each other before we get to this case and removals
    //   would be handled in the final while loop without needing to
    //   generate the map.
    //
    // * Example below: The key at `oldTail` was removed (no longer in the
    //   `newKeyToIndexMap`), so remove that part from the DOM and advance
    //   just the `oldTail` pointer.
    //
    //         oldHead v           v oldTail
    //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
    //   newParts: [0,  ,  ,  ,  ,  , 6] <- 5 not in new map; remove 5 and
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    advance oldTail
    //         newHead ^           ^ newTail
    //
    // * Once head and tail cannot move, any mismatches are due to either
    // new or
    //   moved items; if a new key is in the previous "old key to old index"
    //   map, move the old part to the new location, otherwise create and
    //   insert a new part. Note that when moving an old part we null its
    //   position in the oldParts array if it lies between the head and tail
    //   so we know to skip it when the pointers get there.
    //
    // * Example below: neither head nor tail match, and neither were
    // removed;
    //   so find the `newHead` key in the `oldKeyToIndexMap`, and move that
    //   old part's DOM into the next head position (before
    //   `oldParts[oldHead]`). Last, null the part in the `oldPart` array
    //   since it was somewhere in the remaining oldParts still to be
    //   scanned (between the head and tail pointers) so that we know to
    //   skip that old part on future iterations.
    //
    //         oldHead v        v oldTail
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
    //   newParts: [0, 2,  ,  ,  ,  , 6] <- stuck; update & move 2 into
    //   place newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance newHead
    //         newHead ^           ^ newTail
    //
    // * Note that for moves/insertions like the one above, a part inserted
    // at
    //   the head pointer is inserted before the current
    //   `oldParts[oldHead]`, and a part inserted at the tail pointer is
    //   inserted before `newParts[newTail+1]`. The seeming asymmetry lies
    //   in the fact that new parts are moved into place outside in, so to
    //   the right of the head pointer are old parts, and to the right of
    //   the tail pointer are new parts.
    //
    // * We always restart back from the top of the algorithm, allowing
    // matching
    //   and simple updates in place to continue...
    //
    // * Example below: the head pointers once again match, so simply update
    //   part 1 and record it in the `newParts` array.  Last, advance both
    //   head pointers.
    //
    //         oldHead v        v oldTail
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
    //   newParts: [0, 2, 1,  ,  ,  , 6] <- heads matched; update 1 and
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    advance both oldHead & newHead
    //            newHead ^        ^ newTail
    //
    // * As mentioned above, items that were moved as a result of being
    // stuck
    //   (the final else clause in the code below) are marked with null, so
    //   we always advance old pointers over these so we're comparing the
    //   next actual old value on either end.
    //
    // * Example below: `oldHead` is null (already placed in newParts), so
    //   advance `oldHead`.
    //
    //            oldHead v     v oldTail
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6] // old head already used; advance
    //   newParts: [0, 2, 1,  ,  ,  , 6] // oldHead
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]
    //               newHead ^     ^ newTail
    //
    // * Note it's not critical to mark old parts as null when they are
    // moved
    //   from head to tail or tail to head, since they will be outside the
    //   pointer range and never visited again.
    //
    // * Example below: Here the old tail key matches the new head key, so
    //   the part at the `oldTail` position and move its DOM to the new
    //   head position (before `oldParts[oldHead]`). Last, advance `oldTail`
    //   and `newHead` pointers.
    //
    //               oldHead v  v oldTail
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
    //   newParts: [0, 2, 1, 4,  ,  , 6] <- old tail matches new head:
    //   update newKeys:  [0, 2, 1, 4, 3, 7, 6]   & move 4, advance oldTail
    //   & newHead
    //               newHead ^     ^ newTail
    //
    // * Example below: Old and new head keys match, so update the old head
    //   part in place, and advance the `oldHead` and `newHead` pointers.
    //
    //               oldHead v oldTail
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
    //   newParts: [0, 2, 1, 4, 3,   ,6] <- heads match: update 3 and
    //   advance newKeys:  [0, 2, 1, 4, 3, 7, 6]    oldHead & newHead
    //                  newHead ^  ^ newTail
    //
    // * Once the new or old pointers move past each other then all we have
    //   left is additions (if old list exhausted) or removals (if new list
    //   exhausted). Those are handled in the final while loops at the end.
    //
    // * Example below: `oldHead` exceeded `oldTail`, so we're done with the
    //   main loop.  Create the remaining part and insert it at the new head
    //   position, and the update is complete.
    //
    //                   (oldHead > oldTail)
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
    //   newParts: [0, 2, 1, 4, 3, 7 ,6] <- create and insert 7
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]
    //                     newHead ^ newTail
    //
    // * Note that the order of the if/else clauses is not important to the
    //   algorithm, as long as the null checks come first (to ensure we're
    //   always working on valid old parts) and that the final else clause
    //   comes last (since that's where the expensive moves occur). The
    //   order of remaining clauses is is just a simple guess at which cases
    //   will be most common.
    //
    // * TODO(kschaaf) Note, we could calculate the longest increasing
    //   subsequence (LIS) of old items in new position, and only move those
    //   not in the LIS set. However that costs O(nlogn) time and adds a bit
    //   more code, and only helps make rare types of mutations require
    //   fewer moves. The above handles removes, adds, reversal, swaps, and
    //   single moves of contiguous items in linear time, in the minimum
    //   number of moves. As the number of multiple moves where LIS might
    //   help approaches a random shuffle, the LIS optimization becomes less
    //   helpful, so it seems not worth the code at this point. Could
    //   reconsider if a compelling case arises.

    while (oldHead <= oldTail && newHead <= newTail) {
      if (oldParts[oldHead] === null) {
        // `null` means old part at head has already been used below; skip
        oldHead++;
      } else if (oldParts[oldTail] === null) {
        // `null` means old part at tail has already been used below; skip
        oldTail--;
      } else if (oldKeys[oldHead] === newKeys[newHead]) {
        // Old head matches new head; update in place
        newParts[newHead] = updatePart(oldParts[oldHead], newValues[newHead]);
        oldHead++;
        newHead++;
      } else if (oldKeys[oldTail] === newKeys[newTail]) {
        // Old tail matches new tail; update in place
        newParts[newTail] = updatePart(oldParts[oldTail], newValues[newTail]);
        oldTail--;
        newTail--;
      } else if (oldKeys[oldHead] === newKeys[newTail]) {
        // Old head matches new tail; update and move to new tail
        newParts[newTail] = updatePart(oldParts[oldHead], newValues[newTail]);
        insertPartBefore(containerPart, oldParts[oldHead], newParts[newTail + 1]);
        oldHead++;
        newTail--;
      } else if (oldKeys[oldTail] === newKeys[newHead]) {
        // Old tail matches new head; update and move to new head
        newParts[newHead] = updatePart(oldParts[oldTail], newValues[newHead]);
        insertPartBefore(containerPart, oldParts[oldTail], oldParts[oldHead]);
        oldTail--;
        newHead++;
      } else {
        if (newKeyToIndexMap === undefined) {
          // Lazily generate key-to-index maps, used for removals & moves
          // below
          newKeyToIndexMap = generateMap(newKeys, newHead, newTail);
          oldKeyToIndexMap = generateMap(oldKeys, oldHead, oldTail);
        }

        if (!newKeyToIndexMap.has(oldKeys[oldHead])) {
          // Old head is no longer in new list; remove
          removePart(oldParts[oldHead]);
          oldHead++;
        } else if (!newKeyToIndexMap.has(oldKeys[oldTail])) {
          // Old tail is no longer in new list; remove
          removePart(oldParts[oldTail]);
          oldTail--;
        } else {
          // Any mismatches at this point are due to additions or moves; see
          // if we have an old part we can reuse and move into place
          const oldIndex = oldKeyToIndexMap.get(newKeys[newHead]);
          const oldPart = oldIndex !== undefined ? oldParts[oldIndex] : null;

          if (oldPart === null) {
            // No old part for this value; create a new one and insert it
            const newPart = createAndInsertPart(containerPart, oldParts[oldHead]);
            updatePart(newPart, newValues[newHead]);
            newParts[newHead] = newPart;
          } else {
            // Reuse old part
            newParts[newHead] = updatePart(oldPart, newValues[newHead]);
            insertPartBefore(containerPart, oldPart, oldParts[oldHead]); // This marks the old part as having been used, so that it will
            // be skipped in the first two checks above

            oldParts[oldIndex] = null;
          }

          newHead++;
        }
      }
    } // Add parts for any remaining new values


    while (newHead <= newTail) {
      // For all remaining additions, we insert before last new tail,
      // since old pointers are no longer valid
      const newPart = createAndInsertPart(containerPart, newParts[newTail + 1]);
      updatePart(newPart, newValues[newHead]);
      newParts[newHead++] = newPart;
    } // Remove any remaining unused old parts


    while (oldHead <= oldTail) {
      const oldPart = oldParts[oldHead++];

      if (oldPart !== null) {
        removePart(oldPart);
      }
    } // Save order of new parts for next round


    partListCache.set(containerPart, newParts);
    keyListCache.set(containerPart, newKeys);
  };
});
exports.repeat = repeat;
},{"../lit-html.js":"../../../../../libs/ui/node_modules/lit-html/lit-html.js"}],"../../../../../libs/ui/node_modules/lit-html/directives/guard.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.guard = void 0;

var _litHtml = require("../lit-html.js");

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const previousValues = new WeakMap();
/**
 * Prevents re-render of a template function until a single value or an array of
 * values changes.
 *
 * Example:
 *
 * ```js
 * html`
 *   <div>
 *     ${guard([user.id, company.id], () => html`...`)}
 *   </div>
 * ```
 *
 * In this case, the template only renders if either `user.id` or `company.id`
 * changes.
 *
 * guard() is useful with immutable data patterns, by preventing expensive work
 * until data updates.
 *
 * Example:
 *
 * ```js
 * html`
 *   <div>
 *     ${guard([immutableItems], () => immutableItems.map(i => html`${i}`))}
 *   </div>
 * ```
 *
 * In this case, items are mapped over only when the array reference changes.
 *
 * @param value the value to check before re-rendering
 * @param f the template function
 */

const guard = (0, _litHtml.directive)((value, f) => part => {
  const previousValue = previousValues.get(part);

  if (Array.isArray(value)) {
    // Dirty-check arrays by item
    if (Array.isArray(previousValue) && previousValue.length === value.length && value.every((v, i) => v === previousValue[i])) {
      return;
    }
  } else if (previousValue === value && (value !== undefined || previousValues.has(part))) {
    // Dirty-check non-arrays by identity
    return;
  }

  part.setValue(f()); // Copy the value if it's an array so that if it's mutated we don't forget
  // what the previous values were.

  previousValues.set(part, Array.isArray(value) ? Array.from(value) : value);
});
exports.guard = guard;
},{"../lit-html.js":"../../../../../libs/ui/node_modules/lit-html/lit-html.js"}],"../../../../../libs/ui/node_modules/lit-html/directives/unsafe-html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeHTML = void 0;

var _litHtml = require("../lit-html.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Renders the result as HTML, rather than text.
 *
 * Note, this is unsafe to use with any user-provided input that hasn't been
 * sanitized or escaped, as it may lead to cross-site-scripting
 * vulnerabilities.
 */
const previousValues = new WeakMap();
const unsafeHTML = (0, _litHtml.directive)(value => part => {
  if (!(part instanceof _litHtml.NodePart)) {
    throw new Error('unsafeHTML can only be used in text bindings');
  } // Dirty check primitive values


  const previousValue = previousValues.get(part);

  if (previousValue === value && (0, _litHtml.isPrimitive)(value)) {
    return;
  } // Use a <template> to parse HTML into Nodes


  const tmp = document.createElement('template');
  tmp.innerHTML = value;
  part.setValue(document.importNode(tmp.content, true));
  previousValues.set(part, value);
});
exports.unsafeHTML = unsafeHTML;
},{"../lit-html.js":"../../../../../libs/ui/node_modules/lit-html/lit-html.js"}],"../../../../../libs/ui/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createHoc = require("./hoc/createHoc");

var litHtmlServer = _interopRequireWildcard(require("./lit-html-server"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var _default = function _default(isBrowser) {
  if (isBrowser) {
    return {
      html: require('lit-html').html,
      render: require('lit-html').render,
      repeat: require('lit-html/directives/repeat.js').repeat,
      guard: require('lit-html/directives/guard.js').guard,
      unsafeHTML: require('lit-html/directives/unsafe-html.js').unsafeHTML,
      createHoc: (0, _createHoc.createHoc)(true)
    };
  }

  return {
    html: litHtmlServer.html,
    render: litHtmlServer.render,
    repeat: litHtmlServer.repeat,
    guard: litHtmlServer.guard,
    unsafeHTML: litHtmlServer.unsafeHTML,
    createHoc: (0, _createHoc.createHoc)(false)
  };
};

exports.default = _default;
},{"./hoc/createHoc":"../../../../../libs/ui/src/hoc/createHoc.js","./lit-html-server":"../../../../../libs/ui/src/lit-html-server/index.js","lit-html":"../../../../../libs/ui/node_modules/lit-html/lit-html.js","lit-html/directives/repeat.js":"../../../../../libs/ui/node_modules/lit-html/directives/repeat.js","lit-html/directives/guard.js":"../../../../../libs/ui/node_modules/lit-html/directives/guard.js","lit-html/directives/unsafe-html.js":"../../../../../libs/ui/node_modules/lit-html/directives/unsafe-html.js"}],"../../../../../libs/store/src/methods/get.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;

function get(Store) {
  return function (registerNumber) {
    return function (field) {
      Store.methods.subscribe(registerNumber, field);
      return Store.objects.observables[field];
    };
  };
}
},{}],"../../../../../libs/store/src/methods/subscribe.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribe = subscribe;

function subscribe(Store) {
  return function (registerNumber, observable) {
    var findListener = Store.objects.listeners.find(function (item) {
      return item.observable === observable;
    });
    if (!findListener) return console.log("Listener not found on observable ".concat(observable));
    var currentListeners = findListener.components;
    var isSubscribed = currentListeners.find(function (item) {
      return item.registerNumber === registerNumber;
    });
    if (!isSubscribed) currentListeners.push({
      registerNumber: registerNumber
    });
  };
}
},{}],"../../../../../libs/store/src/methods/set.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = set;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isPlainValue = function isPlainValue(v) {
  return ['string', 'number', 'boolean'].includes(_typeof(v));
};

var wasChanged = function wasChanged(v1, v2) {
  return v1 !== v2;
};

function set(Store) {
  return function (object) {
    if (!object) return;
    Object.keys(object).forEach(function (key) {
      var previousValue = Store.objects.observables[key];
      var previousValueClone = Array.isArray(previousValue) ? _toConsumableArray(previousValue) : _typeof(previousValue) === 'object' ? _objectSpread({}, previousValue) : previousValue;
      var nextValue = typeof object[key] === 'function' ? object[key](previousValueClone) : object[key];

      if (_typeof(previousValue) !== _typeof(nextValue)) {
        console.warn("Type does not match previous type in ".concat(key));
      } else {
        var shouldNotify = !isPlainValue(nextValue) || isPlainValue(nextValue) && wasChanged(previousValue, nextValue);

        if (shouldNotify) {
          Store.objects.observables[key] = nextValue;
          Store.methods.notify(key);
        }
      }
    });
  };
}
},{}],"../../../../../libs/store/src/methods/setItem.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setItem = setItem;

function setItem(Store) {
  return function (observable, item) {
    var findIndex = Store.objects.observables[observable].findIndex(function (x) {
      return x.id === item.id;
    });
    Store.objects.observables[observable][findIndex] = item;
    Store.methods.notify(observable);
  };
}
},{}],"../../../../../libs/store/src/methods/toggle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggle = toggle;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function toggle(Store) {
  return function (observable, cb) {
    var currentValue = Store.objects.observables[observable];

    if (typeof currentValue === 'undefined') {
      console.warn("Observable [".concat(observable, "] does not exists."));
    } else if (typeof currentValue !== 'boolean') {
      console.warn("Observable [".concat(observable, "] is not a boolean."));
    } else {
      Store.methods.set(_defineProperty({}, observable, !currentValue));
      if (cb) cb(!currentValue);
    }
  };
}
},{}],"../../../../../libs/store/src/methods/notify.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notify = notify;

function notify(Store) {
  return function (observable) {
    // Notify computed
    if (observable) {
      Object.keys(Store.objects.computed).forEach(function (key) {
        var take = Store.objects.computed[key].take;
        if (take.includes(observable)) Store.methods.compute(key);
      });
    } // Notify components


    if (Store.flags.IS_MOUNTED) Store.methods.render(); // const findListener = Store.objects.listeners.find(item => item.observable === observable);
    // if (findListener && findListener.components) {
    //   findListener.components.forEach(item => {
    //     const { registerNumber } = item;
    //     const componentDefinition = Store.objects.components[registerNumber];
    //     componentDefinition.definition._render();
    //   });
    // }
  };
}
},{}],"../../../../../libs/store/src/methods/compute.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compute = compute;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function compute(Store) {
  return function (key) {
    var _Store$objects$comput = Store.objects.computed[key],
        take = _Store$objects$comput.take,
        calc = _Store$objects$comput.calc;
    var values = take.map(function (field) {
      return Store.objects.observables[field];
    });
    Store.objects.observables[key] = calc.apply(void 0, _toConsumableArray(values));
  };
}
},{}],"../../../../../libs/store/src/methods/computeAll.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeAll = computeAll;

function computeAll(Store) {
  return function () {
    Object.keys(Store.objects.computed).forEach(function (key) {
      Store.methods.compute(key);
    });
  };
}
},{}],"../../../../../libs/store/src/methods/emit.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emit = emit;

function emit(Store) {
  return function (eventStr, cbProps) {
    if (eventStr === 'MOUNTED') Store.flags.IS_MOUNTED = true;
    var reactions = Store.objects.reactions.filter(function (item) {
      if (item.keepAlive) return item.eventStr === eventStr;
      return item.eventStr === eventStr && !item.done;
    });
    reactions.forEach(function (reaction) {
      reaction.done = true;
      reaction.callback(cbProps);
    });
  };
}
},{}],"../../../../../libs/store/src/methods/registerComponent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerComponent = registerComponent;
var currentRegisterNumber = 1000;

function registerComponent(Store) {
  return function (componentDef) {
    currentRegisterNumber++;
    Store.objects.components[currentRegisterNumber] = {
      definition: componentDef,
      instances: {}
    };
    return currentRegisterNumber;
  };
}
},{}],"../../../../../libs/store/src/methods/on.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.on = on;

function on(Store) {
  return function (eventStr, callback) {
    Store.objects.reactions.push({
      eventStr: eventStr,
      callback: callback,
      keepAlive: true
    });
  };
}
},{}],"../../../../../libs/store/src/methods/once.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.once = once;

function once(Store) {
  return function (eventStr, callback) {
    Store.objects.reactions.push({
      eventStr: eventStr,
      callback: callback,
      done: false
    });
  };
}
},{}],"../../../../../libs/store/src/methods/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;

function render(Store, renderer) {
  return function (Comp) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var node = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'root';
    // console.log("render ------------------------------->", Comp, props, node);
    if (!Store.objects.defaultComponent) Store.objects.defaultComponent = function () {
      return Comp(props);
    };
    var isString = typeof node === 'string';
    var parentNode = isString ? document.getElementById(node) : node;
    var Component = Comp || Store.objects.defaultComponent;
    renderer(Component(props), parentNode);
  };
}
},{}],"../../../../../libs/store/src/methods/check.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.check = check;

// import _ from '/framework/belt';
function check(Store, checks) {
  return function (name, str) {
    var _checks$name = checks[name](str),
        result = _checks$name.result,
        message = _checks$name.message;

    return {
      result: result,
      message: message
    };
  };
}
},{}],"../../../../../libs/store/src/methods/alertOn.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertOn = alertOn;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function alertOn(Store, alerts) {
  return function () {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var rand1000 = Math.floor(1000 * Math.random());
    var timestamp = Date.now();

    var _id = "".concat(timestamp, "--").concat(rand1000);

    var message = obj.name ? alerts[obj.name] : obj.name;
    Store.objects.alerts.push(_objectSpread({
      _id: _id
    }, obj, {
      message: message,
      timestamp: timestamp,
      isVisible: true
    })); // Maybe later we are going to notify only the exact component using alerts

    Store.methods.notify(null);

    if (obj.timeout) {
      setTimeout(function () {
        Store.methods.alertOff({
          _id: _id
        });
      }, obj.timeout);
    }
  };
}
},{}],"../../../../../libs/store/src/methods/alertOff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertOff = alertOff;

function alertOff(Store) {
  return function (_ref) {
    var _id = _ref._id;
    var findAlert = Store.objects.alerts.find(function (item) {
      return item._id === _id;
    });

    if (findAlert) {
      findAlert.isVisible = false; // Maybe later we are going to notify only the exact component using alerts

      Store.methods.notify(null);
    }
  };
}
},{}],"../../../../../libs/store/src/methods/callServerMethod.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callServerMethod = callServerMethod;

function callServerMethod(siteUrl) {
  return function (method) {
    var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // For each query string parameter sent, add it to the path
    // const requestUrl = Object.keys(queryStringObject).reduce((acum, key, index) => {
    //   const queryStr = `${key}=${queryStringObject[key]}`;
    //   if (index === 0) return `${acum}?${queryStr}`;
    //   return `${acum}&${queryStr}`;
    // }, `${baseUrl}/${path}`);
    return new Promise(function (resolve, reject) {
      // Form the http request as a JSON type
      var xhr = new window.XMLHttpRequest();
      xhr.open('POST', "".concat(siteUrl, "/api/methods"), true);
      xhr.setRequestHeader('Content-type', 'application/json'); // For each header sent, add it to the request
      // Object.keys(headers).forEach(key => {
      //   xhr.setRequestHeader(key, headers[key]);
      // });
      // When the request comes back, handle the response

      xhr.onreadystatechange = function () {
        if (xhr.readyState === window.XMLHttpRequest.DONE) {
          var statusCode = xhr.status;
          if (![200, 201].includes(statusCode)) reject('XHR request failed');
          var responseReturned = xhr.responseText;
          resolve(JSON.parse(responseReturned));
        }
      }; // Send the payload as JSON


      var payloadString = JSON.stringify({
        method: method,
        args: args
      });
      xhr.send(payloadString);
    });
  };
}
},{}],"../../../../../libs/store/src/db/getDataFromServer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataFromServer = getDataFromServer;

function getDataFromServer(Store) {
  return function (args) {
    var _args$instance = args.instance,
        instance = _args$instance === void 0 ? null : _args$instance,
        user_id = args.user_id,
        _args$lastTimestamp = args.lastTimestamp,
        lastTimestamp = _args$lastTimestamp === void 0 ? 0 : _args$lastTimestamp,
        _args$localEntitiesId = args.localEntitiesIds,
        localEntitiesIds = _args$localEntitiesId === void 0 ? [] : _args$localEntitiesId;
    var requestArgs = {
      user_id: user_id,
      lastTimestamp: lastTimestamp,
      localEntitiesIds: localEntitiesIds
    };
    return new Promise(function (resolve, reject) {
      // Special method available ony for internal libs
      Store.methods.callServerMethod('@server-model.getData', requestArgs).then(function (items) {
        if (!items) reject('Could not get data from server');
        var newTimestamp = Date.now();
        resolve({
          instance: instance,
          items: items,
          newTimestamp: newTimestamp
        });
      }).catch(reject);
    });
  };
}
},{}],"../../../../../libs/store/src/db/syncDataToDB.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncDataToDB = syncDataToDB;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function syncDataToDB(_ref) {
  var instance = _ref.instance,
      items = _ref.items,
      newTimestamp = _ref.newTimestamp;
  var counter = 0;
  return new Promise(function (resolve) {
    if (items.length === 0) resolve({
      instance: instance,
      counter: counter,
      newTimestamp: newTimestamp
    });
    var modelStore = instance.transaction(['model'], 'readwrite').objectStore('model');
    var requestPrevRecords = modelStore.getAll();

    requestPrevRecords.onsuccess = function () {
      var previousRecords = requestPrevRecords.result;
      items.forEach(function (item) {
        if (item.attrs.length > 0) {
          var findRecord = previousRecords.find(function (rec) {
            return rec._id === item._id;
          });
          var putRequest = modelStore.put({
            _id: item._id,
            domain: item.domain,
            attrs: findRecord ? [].concat(_toConsumableArray(findRecord.attrs), _toConsumableArray(item.attrs)) : item.attrs
          });

          putRequest.onsuccess = function () {
            counter++;
            if (counter === items.length) resolve({
              instance: instance,
              counter: counter,
              newTimestamp: newTimestamp
            });
          };
        }
      });
    };
  });
}
},{}],"../../../../../libs/store/src/db/getDBMetadata.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDBMetadata = getDBMetadata;

function getDBMetadata(_ref) {
  var instance = _ref.instance,
      user_id = _ref.user_id;
  return new Promise(function (resolve, reject) {
    var controlStore = instance.transaction('control').objectStore('control');
    var requestControlRecords = controlStore.getAll();

    requestControlRecords.onsuccess = function () {
      var controlRecords = requestControlRecords.result || [];
      var lastTimestamp = controlRecords.length > 0 ? controlRecords[controlRecords.length - 1].lastTimestamp : 0;
      var modelStore = instance.transaction('model').objectStore('model');
      var requestModelKeys = modelStore.getAllKeys();

      requestModelKeys.onsuccess = function () {
        var localEntitiesIds = requestModelKeys.result || [];
        resolve({
          instance: instance,
          user_id: user_id,
          lastTimestamp: lastTimestamp,
          localEntitiesIds: localEntitiesIds
        });
      };

      requestModelKeys.onerror = function () {
        return reject('Error getting Model Keys');
      };
    };

    requestControlRecords.onerror = function () {
      return reject('Error getting Control Records');
    };
  });
}
},{}],"../../../../../libs/store/src/db/updateDBControl.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateDBControl = updateDBControl;

function updateDBControl(_ref) {
  var instance = _ref.instance,
      counter = _ref.counter,
      newTimestamp = _ref.newTimestamp;
  return new Promise(function (resolve) {
    var controlStore = instance.transaction(['control'], 'readwrite').objectStore('control');
    var putRequest = controlStore.put({
      _id: newTimestamp,
      lastTimestamp: newTimestamp,
      counter: counter
    });

    putRequest.onsuccess = function () {
      resolve({
        instance: instance
      });
    };
  });
}
},{}],"../../../../../libs/store/src/db/getModelData.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getModelData = getModelData;

function getModelData(_ref) {
  var instance = _ref.instance;
  return new Promise(function (resolve) {
    var modelStore = instance.transaction('model').objectStore('model');
    var requestRecords = modelStore.getAll();

    requestRecords.onsuccess = function () {
      return resolve(requestRecords.result);
    };
  });
}
},{}],"../../../../../libs/store/src/db/start.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;

var _getDataFromServer = require("./getDataFromServer");

var _syncDataToDB = require("./syncDataToDB");

var _getDBMetadata = require("./getDBMetadata");

var _updateDBControl = require("./updateDBControl");

var _getModelData = require("./getModelData");

function start(Store, _ref) {
  var name = _ref.name,
      version = _ref.version,
      user_id = _ref.user_id;
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB; // No indexedDB, we just request all data always

  if (!indexedDB) {
    return new Promise(function (resolve, reject) {
      (0, _getDataFromServer.getDataFromServer)({
        user_id: user_id
      }).then(function (_ref2) {
        var items = _ref2.items;
        return resolve(items);
      }).catch(reject);
    });
  }

  return new Promise(function (resolve, reject) {
    var request = indexedDB.open(name, version);

    request.onsuccess = function () {
      return resolve({
        instance: request.result,
        user_id: user_id
      });
    };

    request.onerror = function () {
      return reject(request.error);
    };

    request.onupgradeneeded = function (e) {
      var instance = e.target.result;
      instance.model = instance.createObjectStore('model', {
        keyPath: '_id'
      });
      instance.control = instance.createObjectStore('control', {
        keyPath: '_id'
      });
    };
  }).then(_getDBMetadata.getDBMetadata).then((0, _getDataFromServer.getDataFromServer)(Store)).then(_syncDataToDB.syncDataToDB).then(_updateDBControl.updateDBControl).then(_getModelData.getModelData).catch(console.log);
}
},{"./getDataFromServer":"../../../../../libs/store/src/db/getDataFromServer.js","./syncDataToDB":"../../../../../libs/store/src/db/syncDataToDB.js","./getDBMetadata":"../../../../../libs/store/src/db/getDBMetadata.js","./updateDBControl":"../../../../../libs/store/src/db/updateDBControl.js","./getModelData":"../../../../../libs/store/src/db/getModelData.js"}],"../../../../../libs/store/src/db/hydrate.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hydrate = hydrate;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getCurrentAttrs(attrs) {
  return attrs.reduce(function (acum, item) {
    var key = item.key,
        value = item.value,
        timestamp = item.timestamp;
    /*      value:        is always what is displayed at the UI, used in calculations, etc.        can be in 2 status      status:        0: value is "optimistic" and has not been validated yet by the server        1: value coherent with the server initial load,        2: optimistic value that was confirmed by the server        3: value that came from the server through web-sockets      dbValue:        is the last value that was confirmed by the server        if null indicates that the whole record is not confirmed yet      timestamp:        is the timestamp that reflects the last status coming from the server    */

    if (!acum[key]) acum[key] = {
      value: value,
      dbValue: value,
      status: 1,
      timestamp: timestamp
    };
    return _objectSpread({}, acum, _defineProperty({}, key, timestamp > acum[key].timestamp ? {
      value: value,
      dbValue: value,
      status: 1,
      timestamp: timestamp
    } : acum[key]));
  }, {});
}

function hydrate(Store) {
  return function (data) {
    if (data.length > 0) {
      Store.db.data = data.reduce(function (acum, item) {
        var _id = item._id,
            domain = item.domain,
            attrs = item.attrs;
        if (!acum[domain]) acum[domain] = [];
        return _objectSpread({}, acum, _defineProperty({}, domain, [].concat(_toConsumableArray(acum[domain]), [{
          _id: _id,
          attrs: getCurrentAttrs(attrs)
        }])));
      }, {}); // Renders the defaultComponent (Container)

      if (Store.flags.IS_MOUNTED) Store.methods.render();
    }
  };
}
},{}],"../../../../../libs/store/src/db/query.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = query;

function query(Store) {
  return function (domain) {
    if (!Store.db.data) return [];
    return Store.db.data[domain] || [];
  };
}
},{}],"../../../../../libs/store/src/db/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "start", {
  enumerable: true,
  get: function () {
    return _start.start;
  }
});
Object.defineProperty(exports, "hydrate", {
  enumerable: true,
  get: function () {
    return _hydrate.hydrate;
  }
});
Object.defineProperty(exports, "query", {
  enumerable: true,
  get: function () {
    return _query.query;
  }
});

var _start = require("./start");

var _hydrate = require("./hydrate");

var _query = require("./query");
},{"./start":"../../../../../libs/store/src/db/start.js","./hydrate":"../../../../../libs/store/src/db/hydrate.js","./query":"../../../../../libs/store/src/db/query.js"}],"../../../../../libs/store/src/sockets/initSocket.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSocket = initSocket;

function initSocket(_ref) {
  var socketUrl = _ref.socketUrl,
      user_id = _ref.user_id,
      onMessage = _ref.onMessage;

  if (!socketUrl) {
    console.log('SocketUrl not defined');
    return function () {
      return undefined;
    };
  }

  var wsSupport = 'WebSocket' in window;

  if (!wsSupport) {
    console.log('WebSocket not supported');
    return function () {
      return undefined;
    };
  }

  var ws = new window.WebSocket(socketUrl);

  var sendJSON = function sendJSON(obj) {
    return ws.send(JSON.stringify(obj));
  };

  ws.onopen = function () {
    console.log('WebSocket opened'); // tell the server user_id is connected

    if (user_id) sendJSON({
      user_id: user_id,
      isInitial: true
    });
  };

  ws.onclose = function (x) {
    return console.log('WebSocket closed', x);
  };

  ws.onmessage = function (obj) {
    onMessage(JSON.parse(obj.data));
  };

  return sendJSON;
}
},{}],"../../../../../libs/store/src/sockets/onMessage.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onMessage = onMessage;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function onMessage(Store) {
  return function (payload) {
    var data = payload.data,
        isInitial = payload.isInitial;
    if (isInitial) console.log('Socket first message --> ', payload);

    if (data) {
      var _id = data._id,
          domain = data.domain,
          attrs = data.attrs;
      if (!Store.db.data[domain]) Store.db.data[domain] = [];
      var findEntity = Store.db.data[domain].find(function (item) {
        return item._id === _id;
      });

      if (!findEntity) {
        // Create entity
        Store.db.data[domain].push({
          _id: _id,
          attrs: attrs.reduce(function (acum, item) {
            var key = item.key,
                value = item.value,
                timestamp = item.timestamp;
            return _objectSpread({}, acum, _defineProperty({}, key, {
              value: value,
              dbValue: value,
              status: 3,
              timestamp: timestamp
            }));
          }, {})
        });
      } else {
        // Update entity
        attrs.forEach(function (item) {
          var key = item.key,
              value = item.value,
              timestamp = item.timestamp;
          findEntity.attrs[key] = {
            value: value,
            dbValue: value,
            status: 3,
            timestamp: timestamp
          };
        });
      }

      Store.methods.render();
    }
  };
}
},{}],"../../../../../libs/store/src/sockets/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "initSocket", {
  enumerable: true,
  get: function () {
    return _initSocket.initSocket;
  }
});
Object.defineProperty(exports, "onMessage", {
  enumerable: true,
  get: function () {
    return _onMessage.onMessage;
  }
});

var _initSocket = require("./initSocket");

var _onMessage = require("./onMessage");
},{"./initSocket":"../../../../../libs/store/src/sockets/initSocket.js","./onMessage":"../../../../../libs/store/src/sockets/onMessage.js"}],"../../../../../../../../../../usr/local/lib/node_modules/parcel/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../../../../../libs/store/src/lifecycle/connectStoreToServer.js":[function(require,module,exports) {
var process = require("process");
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectStoreToServer = connectStoreToServer;

var db = _interopRequireWildcard(require("../db"));

var sockets = _interopRequireWildcard(require("../sockets"));

var _methods = require("../methods");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var isBrowser = process.browser;

function connectStoreToServer(Store, _ref) {
  var user_id = _ref.user_id,
      config = _ref.config;

  /* ----------------------------------------------------------------------------------------------    Initialize db && sockets  ---------------------------------------------------------------------------------------------- */
  var siteUrl = config.siteUrl,
      socketUrl = config.socketUrl;
  Store.methods.callServerMethod = (0, _methods.callServerMethod)(siteUrl);

  if (isBrowser) {
    /* ----------------------------------------------------------------------------------------------    Initialize sockets  ---------------------------------------------------------------------------------------------- */
    var sendJSON = sockets.initSocket({
      socketUrl: socketUrl,
      user_id: user_id,
      onMessage: sockets.onMessage(Store)
    });
    Store.sockets = {
      sendJSON: sendJSON
    };
    /* ----------------------------------------------------------------------------------------------    Initialize db  ---------------------------------------------------------------------------------------------- */

    Store.db = {
      data: null,
      // already transformed and living free after initialization
      query: db.query(Store)
    };
    return db.start(Store, {
      name: 'asyncDB',
      version: 1,
      user_id: user_id
    }).then(db.hydrate(Store)).catch(console.log);
  }
}
},{"../db":"../../../../../libs/store/src/db/index.js","../sockets":"../../../../../libs/store/src/sockets/index.js","../methods":"../../../../../libs/store/src/methods/index.js","process":"../../../../../../../../../../usr/local/lib/node_modules/parcel/node_modules/process/browser.js"}],"../../../../../libs/store/src/methods/startApp.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startApp = startApp;

var _connectStoreToServer = require("../lifecycle/connectStoreToServer");

function startApp(Store) {
  return function (_ref) {
    var appData = _ref.appData,
        routes = _ref.routes;
    var _appData$config = appData.config,
        config = _appData$config === void 0 ? {} : _appData$config,
        _appData$router = appData.router,
        router = _appData$router === void 0 ? {} : _appData$router,
        _appData$query = appData.query,
        query = _appData$query === void 0 ? {} : _appData$query;
    /* ------------------------------------------------------------------------------------------------  Register Service Worker------------------------------------------------------------------------------------------------ */

    if (config.useServiceWorker && 'serviceWorker' in window.navigator) {
      window.navigator.serviceWorker.register('./sw.js', {
        scope: '/'
      }).then(function () {
        console.log('Service Worker registration OK');
      }).catch(function (error) {
        console.log('Service Worker registration FAILED', error);
      });
    }
    /* ------------------------------------------------------------------------------------------------  First Render && Connect to Server data------------------------------------------------------------------------------------------------ */


    var Container = routes['_root_'];
    if (router.currentPage) Store.methods.set({
      currentPage: router.currentPage
    });
    if (query.user) Store.methods.set({
      user_id: query.user
    });
    (0, _connectStoreToServer.connectStoreToServer)(Store, {
      user_id: query.user,
      config: config
    }).then(function () {
      Store.methods.render(Container, {
        router: {
          pages: router.pages,
          currentPage: router.currentPage
        }
      }, 'root');
      Store.methods.emit('MOUNTED');
    });
  };
}
},{"../lifecycle/connectStoreToServer":"../../../../../libs/store/src/lifecycle/connectStoreToServer.js"}],"../../../../../libs/store/src/methods/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "get", {
  enumerable: true,
  get: function () {
    return _get.get;
  }
});
Object.defineProperty(exports, "subscribe", {
  enumerable: true,
  get: function () {
    return _subscribe.subscribe;
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function () {
    return _set.set;
  }
});
Object.defineProperty(exports, "setItem", {
  enumerable: true,
  get: function () {
    return _setItem.setItem;
  }
});
Object.defineProperty(exports, "toggle", {
  enumerable: true,
  get: function () {
    return _toggle.toggle;
  }
});
Object.defineProperty(exports, "notify", {
  enumerable: true,
  get: function () {
    return _notify.notify;
  }
});
Object.defineProperty(exports, "compute", {
  enumerable: true,
  get: function () {
    return _compute.compute;
  }
});
Object.defineProperty(exports, "computeAll", {
  enumerable: true,
  get: function () {
    return _computeAll.computeAll;
  }
});
Object.defineProperty(exports, "emit", {
  enumerable: true,
  get: function () {
    return _emit.emit;
  }
});
Object.defineProperty(exports, "registerComponent", {
  enumerable: true,
  get: function () {
    return _registerComponent.registerComponent;
  }
});
Object.defineProperty(exports, "on", {
  enumerable: true,
  get: function () {
    return _on.on;
  }
});
Object.defineProperty(exports, "once", {
  enumerable: true,
  get: function () {
    return _once.once;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _render.render;
  }
});
Object.defineProperty(exports, "check", {
  enumerable: true,
  get: function () {
    return _check.check;
  }
});
Object.defineProperty(exports, "alertOn", {
  enumerable: true,
  get: function () {
    return _alertOn.alertOn;
  }
});
Object.defineProperty(exports, "alertOff", {
  enumerable: true,
  get: function () {
    return _alertOff.alertOff;
  }
});
Object.defineProperty(exports, "callServerMethod", {
  enumerable: true,
  get: function () {
    return _callServerMethod.callServerMethod;
  }
});
Object.defineProperty(exports, "startApp", {
  enumerable: true,
  get: function () {
    return _startApp.startApp;
  }
});

var _get = require("./get");

var _subscribe = require("./subscribe");

var _set = require("./set");

var _setItem = require("./setItem");

var _toggle = require("./toggle");

var _notify = require("./notify");

var _compute = require("./compute");

var _computeAll = require("./computeAll");

var _emit = require("./emit");

var _registerComponent = require("./registerComponent");

var _on = require("./on");

var _once = require("./once");

var _render = require("./render");

var _check = require("./check");

var _alertOn = require("./alertOn");

var _alertOff = require("./alertOff");

var _callServerMethod = require("./callServerMethod");

var _startApp = require("./startApp");
},{"./get":"../../../../../libs/store/src/methods/get.js","./subscribe":"../../../../../libs/store/src/methods/subscribe.js","./set":"../../../../../libs/store/src/methods/set.js","./setItem":"../../../../../libs/store/src/methods/setItem.js","./toggle":"../../../../../libs/store/src/methods/toggle.js","./notify":"../../../../../libs/store/src/methods/notify.js","./compute":"../../../../../libs/store/src/methods/compute.js","./computeAll":"../../../../../libs/store/src/methods/computeAll.js","./emit":"../../../../../libs/store/src/methods/emit.js","./registerComponent":"../../../../../libs/store/src/methods/registerComponent.js","./on":"../../../../../libs/store/src/methods/on.js","./once":"../../../../../libs/store/src/methods/once.js","./render":"../../../../../libs/store/src/methods/render.js","./check":"../../../../../libs/store/src/methods/check.js","./alertOn":"../../../../../libs/store/src/methods/alertOn.js","./alertOff":"../../../../../libs/store/src/methods/alertOff.js","./callServerMethod":"../../../../../libs/store/src/methods/callServerMethod.js","./startApp":"../../../../../libs/store/src/methods/startApp.js"}],"../../../../../libs/store/src/queue/addToQueue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addToQueue = addToQueue;

function addToQueue(Store) {
  return function (_ref) {
    var name = _ref.name,
        steps = _ref.steps,
        onError = _ref.onError;

    var _id = Date.now();

    var objToQueue = {
      _id: _id,
      name: name,
      steps: steps,
      done: false
    };
    if (onError) objToQueue.onError = onError;
    Store.process.queue.splice(0, 0, objToQueue); // ads into the first element

    Store.process.runTask({
      _id: _id
    });
  };
}
},{}],"../../../../../libs/store/src/queue/createProcesses.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProcesses = createProcesses;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createProcesses(Store, actions) {
  if (!actions) return function () {
    return undefined;
  };
  var processes = Object.keys(actions).reduce(function (acum, key) {
    var singleAction = actions[key];
    /*      We dont want to pass the whole Store to the action, just observables      So, the actions consumes the Store like:      const { language } = Store.observables;    */

    var observables = Store.objects.observables;
    return _objectSpread({}, acum, _defineProperty({}, key, function (args) {
      Store.process.addToQueue(_objectSpread({
        name: key
      }, singleAction({
        observables: observables
      })(args)));
    }));
  }, {});
  return function (name, args) {
    return processes[name](args);
  };
}
},{}],"../../../../../libs/store/src/queue/processOptimistic.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processOptimistic = processOptimistic;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function processOptimistic(Store, args) {
  var _id = args._id,
      domain = args.domain,
      attrs = args.attrs;
  if (!Store.db.data[domain]) Store.db.data[domain] = [];
  var findEntity = Store.db.data[domain].find(function (item) {
    return item._id === _id;
  });
  /*
    Case 1: New Entity
  */

  if (!findEntity) {
    // Create entity
    Store.db.data[domain].push({
      _id: _id,
      attrs: Object.keys(attrs).reduce(function (acum, key) {
        return _objectSpread({}, acum, _defineProperty({}, key, {
          value: attrs[key],
          dbValue: null,
          status: 0,
          timestamp: Date.now()
        }));
      }, {})
    });
  } else {
    /*
      Case 2: Existing entity, new attrs
    */
    // Update entity
    Object.keys(attrs).forEach(function (key) {
      var dbValue = attrs[key].value;
      findEntity.attrs[key] = {
        value: attrs[key],
        dbValue: dbValue,
        status: 0,
        timestamp: Date.now()
      };
    });
  }

  Store.methods.render();
  return function (isOK) {
    if (!findEntity && !isOK) {
      // New Entity + error => Remove the entity
      Store.db.data[domain] = Store.db.data[domain].filter(function (item) {
        return item._id !== _id;
      });
    } else {
      // New Entity + ok || Existing entity => Update fields
      var entity = Store.db.data[domain].find(function (item) {
        return item._id === _id;
      });
      Object.keys(entity.attrs).forEach(function (key) {
        var field = entity.attrs[key];

        if (field.status === 0) {
          field.status = isOK ? 2 : 1;
          if (!isOK) field.value = field.dbValue;
          if (isOK) field.dbValue = field.value;
          field.timestamp = Date.now();
        }
      });
    }

    if (!isOK) Store.methods.render();
  };
}
},{}],"../../../../../libs/store/src/queue/processStep.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processStep = processStep;

var _processOptimistic = require("./processOptimistic");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function processStep(Store, step) {
  var previousArgs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _step = step(previousArgs),
      method = _step.method,
      domain = _step.domain,
      args = _step.args,
      sideEffect = _step.sideEffect,
      _step$optimistic = _step.optimistic,
      optimistic = _step$optimistic === void 0 ? true : _step$optimistic; // Backend may return something valuable for the next step


  if (domain === '_Backend_') {
    var resolveOptimistic = optimistic ? (0, _processOptimistic.processOptimistic)(Store, args) : function () {
      return undefined;
    };
    return new Promise(function (resolve, reject) {
      return Store.methods.callServerMethod(method, args).then(function (response) {
        var error = response.error;
        var data = response.data;
        resolveOptimistic(!error);
        resolve({
          error: error,
          data: _objectSpread({}, previousArgs.data, data)
        });
      }).catch(function (err) {
        resolveOptimistic(false);
        reject(err);
      });
    });
  } // Store works like simple local State


  if (domain === '_Store_') {
    Store.methods[method](args);
    if (sideEffect) sideEffect();
    return Promise.resolve(previousArgs);
  }
}
},{"./processOptimistic":"../../../../../libs/store/src/queue/processOptimistic.js"}],"../../../../../libs/store/src/queue/processor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processor = processor;

var _processStep = require("./processStep");

// import { resolveArgs } from './resolveArgs';
function processor(Store) {
  return function (steps) {
    // Promise build
    var promises = steps.map(function (step) {
      return function (previousArgs) {
        // const args = resolveArgs(step.args, prevArgs);
        // processStep(Store, step, args);
        return (0, _processStep.processStep)(Store, step, previousArgs);
      };
    }); // Promise execution

    var proceed = true;
    promises.reduce(function (p, fn) {
      return p.then(function (res) {
        if (proceed) return fn(res);
      }).catch(function (e) {
        console.log('Error in Promise chain execution', e);
        proceed = false;
      });
    }, Promise.resolve({}));
  };
}
},{"./processStep":"../../../../../libs/store/src/queue/processStep.js"}],"../../../../../libs/store/src/queue/runTask.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runTask = runTask;

// import _ from '/framework/belt';
function runTask(Store) {
  return function (_ref) {
    var _id = _ref._id;
    var task = Store.process.queue.find(function (item) {
      return item._id === _id;
    });
    Store.process.processor(task.steps);
    task.done = true;
  };
}
},{}],"../../../../../libs/store/src/queue/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "addToQueue", {
  enumerable: true,
  get: function () {
    return _addToQueue.addToQueue;
  }
});
Object.defineProperty(exports, "createProcesses", {
  enumerable: true,
  get: function () {
    return _createProcesses.createProcesses;
  }
});
Object.defineProperty(exports, "processor", {
  enumerable: true,
  get: function () {
    return _processor.processor;
  }
});
Object.defineProperty(exports, "runTask", {
  enumerable: true,
  get: function () {
    return _runTask.runTask;
  }
});

var _addToQueue = require("./addToQueue");

var _createProcesses = require("./createProcesses");

var _processor = require("./processor");

var _runTask = require("./runTask");
},{"./addToQueue":"../../../../../libs/store/src/queue/addToQueue.js","./createProcesses":"../../../../../libs/store/src/queue/createProcesses.js","./processor":"../../../../../libs/store/src/queue/processor.js","./runTask":"../../../../../libs/store/src/queue/runTask.js"}],"../../../../../libs/store/src/lifecycle/createStore.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = createStore;

var methods = _interopRequireWildcard(require("../methods"));

var queue = _interopRequireWildcard(require("../queue"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function createStore(definition, renderer) {
  var Store = {};
  var _definition$observabl = definition.observables,
      observables = _definition$observabl === void 0 ? {} : _definition$observabl,
      _definition$computed = definition.computed,
      computed = _definition$computed === void 0 ? {} : _definition$computed,
      _definition$actions = definition.actions,
      actions = _definition$actions === void 0 ? {} : _definition$actions,
      _definition$alerts = definition.alerts,
      alerts = _definition$alerts === void 0 ? {} : _definition$alerts,
      _definition$checks = definition.checks,
      checks = _definition$checks === void 0 ? {} : _definition$checks;
  /* ----------------------------------------------------------------------------------------------    Initialize flags  ---------------------------------------------------------------------------------------------- */

  Store.flags = {
    IS_MOUNTED: false
  };
  /* ----------------------------------------------------------------------------------------------    Initialize utils to the store for convenience.  ---------------------------------------------------------------------------------------------- */

  Store.utils = {
    hoc: null // will be attached after ui initialization

  };
  /* ----------------------------------------------------------------------------------------------    Initialize observables  ---------------------------------------------------------------------------------------------- */

  Store.objects = {
    defaultComponent: null,
    observables: observables,
    computed: computed,
    listeners: [],
    reactions: [],
    components: {},
    alerts: []
  };
  /* ----------------------------------------------------------------------------------------------    Initialize methods  ---------------------------------------------------------------------------------------------- */

  Store.methods = {
    check: methods.check(Store, checks),
    get: methods.get(Store),
    subscribe: methods.subscribe(Store),
    set: methods.set(Store),
    setItem: methods.setItem(Store),
    toggle: methods.toggle(Store),
    notify: methods.notify(Store),
    emit: methods.emit(Store),
    on: methods.on(Store),
    once: methods.once(Store),
    render: methods.render(Store, renderer),
    compute: methods.compute(Store),
    computeAll: methods.computeAll(Store),
    registerComponent: methods.registerComponent(Store),
    alertOn: methods.alertOn(Store, alerts),
    alertOff: methods.alertOff(Store),
    callServerMethod: function callServerMethod() {
      return undefined;
    },
    // will be initialized on 'connectStoreToServer'
    startApp: methods.startApp(Store)
  };
  /* ----------------------------------------------------------------------------------------------    Initialize queued processes  ---------------------------------------------------------------------------------------------- */

  Store.process = {
    queue: [],
    addToQueue: queue.addToQueue(Store),
    processor: queue.processor(Store),
    runTask: queue.runTask(Store),
    call: queue.createProcesses(Store, actions) // client side method call

  };
  /* ----------------------------------------------------------------------------------------------    Initialize listeners  ---------------------------------------------------------------------------------------------- */

  Object.keys(Store.objects.observables).forEach(function (observable) {
    Store.objects.listeners.push({
      observable: observable,
      components: []
    });
  });
  /* ----------------------------------------------------------------------------------------------    Start with computed values up to date  ---------------------------------------------------------------------------------------------- */

  Store.methods.computeAll();
  return Store;
}
},{"../methods":"../../../../../libs/store/src/methods/index.js","../queue":"../../../../../libs/store/src/queue/index.js"}],"../../../../../libs/store/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createStore = require("./lifecycle/createStore");

var _default = _createStore.createStore;
exports.default = _default;
},{"./lifecycle/createStore":"../../../../../libs/store/src/lifecycle/createStore.js"}],"../../src/module/store/actions/changeRoute.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default() {
  return function (args) {
    var page = args.page,
        action = args.action;
    return {
      steps: [function () {
        return {
          domain: '_Store_',
          method: 'set',
          args: {
            currentPage: page
          },
          sideEffect: function sideEffect() {
            if (action === 'replace') window.history.replaceState(null, null, page);
            if (action === 'push') window.history.pushState(null, null, page);
            if (action === 'back') window.history.back();
          }
        };
      }]
    };
  };
};

exports.default = _default;
},{}],"../../../../../libs/belt/src/compact.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compact = compact;

function compact(array) {
  return array.filter(Boolean);
}
},{}],"../../../../../libs/belt/src/get.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function get(obj, key, defaultValue) {
  // Undefined object
  if (!obj) return defaultValue;
  if (_typeof(obj) === 'object' && Object.keys(obj).length === 0) return defaultValue; // Key is number

  if (typeof key === 'number') {
    if (obj[key] === undefined) return defaultValue;
    return obj[key];
  } // Key is string


  var splittedKeys = key.split('.');
  var exit = false;
  return splittedKeys.reduce(function (acum, value) {
    if (exit) return defaultValue;

    if (!acum[value]) {
      exit = true;
      return defaultValue;
    }

    return acum[value];
  }, obj);
}
},{}],"../../../../../libs/belt/src/has.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.has = has;

function has(obj, key) {
  var splittedKeys = key.split('.');
  var hasKey = true;
  splittedKeys.reduce(function (acum, value) {
    if (!hasKey) return null;

    if (typeof acum[value] === 'undefined') {
      hasKey = false;
      return null;
    }

    return acum[value];
  }, obj);
  return hasKey;
}
},{}],"../../../../../libs/belt/src/last.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.last = last;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function last() {
  var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  if (array.length === 0) return null;
  return _toConsumableArray(array).slice(-1)[0];
}
},{}],"../../../../../libs/belt/src/omit.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.omit = omit;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function omit(obj, keys) {
  return Object.keys(obj).reduce(function (acum, key) {
    if (keys.includes(key)) return acum;
    if (typeof obj[key] === 'undefined') return acum;
    return _objectSpread({}, acum, _defineProperty({}, key, obj[key]));
  }, {});
}
},{}],"../../../../../libs/belt/src/pick.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pick = pick;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function pick(obj, keys) {
  return Object.keys(obj).reduce(function (acum, key) {
    if (!keys.includes(key)) return acum;
    if (typeof obj[key] === 'undefined') return acum;
    return _objectSpread({}, acum, _defineProperty({}, key, obj[key]));
  }, {});
}
},{}],"../../../../../libs/belt/src/random.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.random = random;

function random(low, high) {
  if (!low && !high) return Math.random();
  if (low && !high) return low * Math.random();
  if (!low && high) return Math.random(); // Include boths edges as possible numbers

  var length = high - low + 1;
  return low + Math.floor(length * Math.random());
}
},{}],"../../../../../libs/belt/src/range.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.range = range;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function range() {
  var low = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var high = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (!high && low > 0) return _toConsumableArray(Array(low).keys());
  if (high - low <= 0) return [];

  var array = _toConsumableArray(Array(high - low).keys());

  return array.map(function (elem) {
    return elem + low;
  });
}
},{}],"../../../../../libs/belt/src/sample.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sample = sample;

function sample() {
  var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  if (array.length === 0) return null;
  var rand = Math.floor(array.length * Math.random());
  return array[rand];
}
},{}],"../../../../../libs/belt/src/uid.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uid = uid;

function uid() {
  var strLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;
  var now = String(Date.now());
  var middlePos = Math.ceil(now.length / 2);
  var availableChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var availableCharsLength = availableChars.length; // Start the final string

  var str = '';

  for (var i = 1; i <= strLength; i++) {
    var randChar = availableChars.charAt(Math.floor(Math.random() * availableCharsLength)); // Append this character to the string

    str += randChar;
  }

  return "".concat(now.substr(0, middlePos), "-").concat(str, "-").concat(now.substr(middlePos));
}
},{}],"../../../../../libs/belt/src/uniq.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uniq = uniq;

function uniq(array) {
  return array.filter(function (elem, pos, arr) {
    return arr.indexOf(elem) === pos;
  });
}
},{}],"../../../../../libs/belt/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _compact = require("./compact");

var _get = require("./get");

var _has = require("./has");

var _last = require("./last");

var _omit = require("./omit");

var _pick = require("./pick");

var _random = require("./random");

var _range = require("./range");

var _sample = require("./sample");

var _uid = require("./uid");

var _uniq = require("./uniq");

var _default = {
  compact: _compact.compact,
  get: _get.get,
  has: _has.has,
  last: _last.last,
  omit: _omit.omit,
  pick: _pick.pick,
  random: _random.random,
  range: _range.range,
  sample: _sample.sample,
  uid: _uid.uid,
  uniq: _uniq.uniq
};
exports.default = _default;
},{"./compact":"../../../../../libs/belt/src/compact.js","./get":"../../../../../libs/belt/src/get.js","./has":"../../../../../libs/belt/src/has.js","./last":"../../../../../libs/belt/src/last.js","./omit":"../../../../../libs/belt/src/omit.js","./pick":"../../../../../libs/belt/src/pick.js","./random":"../../../../../libs/belt/src/random.js","./range":"../../../../../libs/belt/src/range.js","./sample":"../../../../../libs/belt/src/sample.js","./uid":"../../../../../libs/belt/src/uid.js","./uniq":"../../../../../libs/belt/src/uniq.js"}],"../../src/module/store/actions/signupEmail.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("../../../../../../../libs/belt/src/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(Store) {
  return function () {
    var name = Store.observables['signup.name'];
    var email = Store.observables['signup.email'];

    var _id = _index.default.uid();

    return {
      steps: [function () {
        return {
          domain: '_Backend_',
          method: 'signupUserWithEmail',
          optimistic: false,
          args: {
            _id: _id,
            name: name,
            email: email
          }
        };
      }, function (res) {
        return {
          domain: '_Store_',
          method: res.error ? 'alertOn' : 'set',
          args: res.error ? {
            name: res.error,
            timeout: 4000
          } : {
            user_id: res.data._id,
            'signup.currentStep': 2
          }
        };
      }, function (res) {
        return {
          domain: '_Store_',
          method: 'set',
          args: res.error ? {
            'signin.email': email,
            'forgot.email': email // if user goes to signin he has already the email typed

          } : null
        };
      }]
    };
  };
};

exports.default = _default;
},{"../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js"}],"../../src/module/store/actions/signupPassword.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(Store) {
  return function () {
    var _id = Store.observables['user_id'];
    var name = Store.observables['signup.name'];
    var email = Store.observables['signup.email'];
    var password = Store.observables['signup.password'];
    var language = Store.observables.language;
    return {
      steps: [
      /*        We go next step before setting password because there is no server validation        and email send takes time      */
      function () {
        return {
          domain: '_Store_',
          method: 'set',
          args: {
            'signup.currentStep': 3
          }
        };
      }, function () {
        return {
          domain: '_Backend_',
          method: 'signupSendTokenEmail',
          optimistic: false,
          args: {
            _id: _id,
            name: name.split(' ')[0],
            language: language,
            email: email,
            password: password
          }
        };
      }]
    };
  };
};

exports.default = _default;
},{}],"../../src/module/store/actions/signupToken.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(Store) {
  return function () {
    var _id = Store.observables['user_id'];
    var password = Store.observables['signup.password'];
    var tokenDigits = Store.observables['signup.tokenDigits'];
    return {
      steps: [function () {
        return {
          domain: '_Backend_',
          method: 'signupFinishRegistration',
          optimistic: false,
          args: {
            _id: _id,
            password: password,
            token: tokenDigits.join('')
          }
        };
      }, function (res) {
        return {
          domain: '_Store_',
          method: res.error ? 'alertOn' : 'set',
          args: res.error ? {
            name: res.error,
            timeout: 4000
          } : {
            'signup.currentStep': 0,
            'signup.name': '',
            'signup.email': '',
            'signup.password': '',
            'signup.tokenDigits': [],
            currentPage: 'welcome'
          },
          sideEffect: function sideEffect() {
            if (!res.error) {
              window.history.replaceState(null, null, '/welcome');
            }
          }
        };
      }, function (res) {
        return {
          domain: '_Store_',
          method: 'set',
          args: res.error ? {
            'signup.tokenDigits': []
          } : null
        };
      }]
    };
  };
};

exports.default = _default;
},{}],"../../src/module/store/actions/signinEmail.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// import _ from '@jmaguirrei/belt';
var _default = function _default(Store) {
  return function () {
    var email = Store.observables['signin.email'];
    return {
      steps: [function () {
        return {
          domain: '_Backend_',
          method: 'signinValidateEmail',
          optimistic: false,
          args: {
            email: email
          }
        };
      }, function (res) {
        return {
          domain: '_Store_',
          method: res.error ? 'alertOn' : 'set',
          args: res.error ? {
            name: res.error,
            timeout: 4000
          } : {
            'signin.name': res.data.name,
            'signin.currentStep': 1
          }
        };
      }, function (res) {
        return {
          domain: '_Store_',
          method: 'set',
          args: res.error ? {
            'signup.email': email
          } : null
        };
      }]
    };
  };
};

exports.default = _default;
},{}],"../../src/module/store/actions/signinPassword.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// import _ from '@jmaguirrei/belt';
var _default = function _default(Store) {
  return function () {
    var email = Store.observables['signin.email'];
    var password = Store.observables['signin.password'];
    return {
      steps: [function () {
        return {
          domain: '_Backend_',
          method: 'signinValidatePassword',
          optimistic: false,
          args: {
            email: email,
            password: password
          }
        };
      }, function (res) {
        return {
          domain: '_Store_',
          method: res.error ? 'alertOn' : 'set',
          args: res.error ? {
            name: res.error,
            timeout: 4000
          } : null,
          sideEffect: function sideEffect() {
            if (!res.error) {
              var _res$data = res.data,
                  user_id = _res$data.user_id,
                  isPasswordOK = _res$data.isPasswordOK;

              if (isPasswordOK) {
                window.location.replace("https://museeker.io/app?user=".concat(user_id));
              }
            }
          }
        };
      }]
    };
  };
};

exports.default = _default;
},{}],"../../src/module/store/actions/forgotEmail.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// import _ from '@jmaguirrei/belt';
var _default = function _default(Store) {
  return function () {
    var email = Store.observables['forgot.email'];
    return {
      steps: [function () {
        return {
          domain: '_Backend_',
          method: 'forgotValidateEmail',
          optimistic: false,
          args: {
            email: email
          }
        };
      }, function (res) {
        return {
          domain: '_Store_',
          method: res.error ? 'alertOn' : 'set',
          args: res.error ? {
            name: res.error,
            timeout: 4000
          } : {
            user_id: res.data.user_id,
            'forgot.name': res.data.name,
            'forgot.currentStep': 1
          }
        };
      }, function (res) {
        return {
          domain: '_Store_',
          method: 'set',
          args: res.error ? {
            'signup.email': email
          } : null
        };
      }]
    };
  };
};

exports.default = _default;
},{}],"../../src/module/store/actions/forgotPassword.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(Store) {
  return function () {
    var _id = Store.observables['user_id'];
    var name = Store.observables['forgot.name'];
    var email = Store.observables['forgot.email'];
    var password = Store.observables['forgot.password'];
    var language = Store.observables.language;
    return {
      steps: [
      /*        We go next step before setting password because there is no server validation        and email send takes time      */
      function () {
        return {
          domain: '_Store_',
          method: 'set',
          args: {
            'forgot.currentStep': 2
          }
        };
      }, function () {
        return {
          domain: '_Backend_',
          method: 'forgotSendTokenEmail',
          optimistic: false,
          args: {
            _id: _id,
            name: name.split(' ')[0],
            language: language,
            email: email,
            password: password
          }
        };
      }]
    };
  };
};

exports.default = _default;
},{}],"../../src/module/store/actions/forgotToken.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(Store) {
  return function () {
    var email = Store.observables['signin.email'];
    var password = Store.observables['forgot.password'];
    var tokenDigits = Store.observables['forgot.tokenDigits'];
    return {
      steps: [function () {
        return {
          domain: '_Backend_',
          method: 'forgotSetNewPassword',
          optimistic: false,
          args: {
            email: email,
            password: password,
            token: tokenDigits.join('')
          }
        };
      }, function (res) {
        return {
          domain: '_Store_',
          method: res.error ? 'alertOn' : 'set',
          args: res.error ? {
            name: res.error,
            timeout: 4000
          } : {
            'forgot.password': '',
            'forgot.tokenDigits': []
          },
          sideEffect: function sideEffect() {
            if (!res.error) {
              var user_id = res.data.user_id;
              window.location.replace("https://app.museeker.io?user=".concat(user_id));
            }
          }
        };
      }, function (res) {
        return {
          domain: '_Store_',
          method: 'set',
          args: res.error ? {
            'forgot.tokenDigits': []
          } : null
        };
      }]
    };
  };
};

exports.default = _default;
},{}],"../../src/module/store/actions/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "changeRoute", {
  enumerable: true,
  get: function () {
    return _changeRoute.default;
  }
});
Object.defineProperty(exports, "signupEmail", {
  enumerable: true,
  get: function () {
    return _signupEmail.default;
  }
});
Object.defineProperty(exports, "signupPassword", {
  enumerable: true,
  get: function () {
    return _signupPassword.default;
  }
});
Object.defineProperty(exports, "signupToken", {
  enumerable: true,
  get: function () {
    return _signupToken.default;
  }
});
Object.defineProperty(exports, "signinEmail", {
  enumerable: true,
  get: function () {
    return _signinEmail.default;
  }
});
Object.defineProperty(exports, "signinPassword", {
  enumerable: true,
  get: function () {
    return _signinPassword.default;
  }
});
Object.defineProperty(exports, "forgotEmail", {
  enumerable: true,
  get: function () {
    return _forgotEmail.default;
  }
});
Object.defineProperty(exports, "forgotPassword", {
  enumerable: true,
  get: function () {
    return _forgotPassword.default;
  }
});
Object.defineProperty(exports, "forgotToken", {
  enumerable: true,
  get: function () {
    return _forgotToken.default;
  }
});

var _changeRoute = _interopRequireDefault(require("./changeRoute"));

var _signupEmail = _interopRequireDefault(require("./signupEmail"));

var _signupPassword = _interopRequireDefault(require("./signupPassword"));

var _signupToken = _interopRequireDefault(require("./signupToken"));

var _signinEmail = _interopRequireDefault(require("./signinEmail"));

var _signinPassword = _interopRequireDefault(require("./signinPassword"));

var _forgotEmail = _interopRequireDefault(require("./forgotEmail"));

var _forgotPassword = _interopRequireDefault(require("./forgotPassword"));

var _forgotToken = _interopRequireDefault(require("./forgotToken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./changeRoute":"../../src/module/store/actions/changeRoute.js","./signupEmail":"../../src/module/store/actions/signupEmail.js","./signupPassword":"../../src/module/store/actions/signupPassword.js","./signupToken":"../../src/module/store/actions/signupToken.js","./signinEmail":"../../src/module/store/actions/signinEmail.js","./signinPassword":"../../src/module/store/actions/signinPassword.js","./forgotEmail":"../../src/module/store/actions/forgotEmail.js","./forgotPassword":"../../src/module/store/actions/forgotPassword.js","./forgotToken":"../../src/module/store/actions/forgotToken.js"}],"../../src/module/store/checks/name.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.name = void 0;
var MIN_LENGTH = 5;

var name = function name(str) {
  var result = str.trim().length >= MIN_LENGTH;
  return {
    result: result,
    message: result ? null : {
      en: "At least ".concat(MIN_LENGTH, " characters"),
      es: "M\xEDnimo ".concat(MIN_LENGTH, " caracteres")
    }
  };
};

exports.name = name;
},{}],"../../src/module/store/checks/email.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.email = void 0;
var REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var email = function email(str) {
  var result = REGEX.test(str);
  return {
    result: result,
    message: null
  };
};

exports.email = email;
},{}],"../../src/module/store/checks/password.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.password = void 0;
var MIN_LENGTH = 8;

var password = function password(str) {
  var noSpaces = /^\S+$/.test(str);

  if (!noSpaces && str.length > 0) {
    return {
      result: false,
      message: {
        en: 'Password can\'t contain white spaces',
        es: 'La contraseña no puede contener espacios'
      }
    };
  }

  var result = str.length >= MIN_LENGTH;
  return {
    result: result,
    message: result ? null : {
      en: "At least ".concat(MIN_LENGTH, " characters"),
      es: "M\xEDnimo ".concat(MIN_LENGTH, " caracteres")
    }
  };
};

exports.password = password;
},{}],"../../src/module/store/checks/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "name", {
  enumerable: true,
  get: function () {
    return _name.name;
  }
});
Object.defineProperty(exports, "email", {
  enumerable: true,
  get: function () {
    return _email.email;
  }
});
Object.defineProperty(exports, "password", {
  enumerable: true,
  get: function () {
    return _password.password;
  }
});

var _name = require("./name");

var _email = require("./email");

var _password = require("./password");
},{"./name":"../../src/module/store/checks/name.js","./email":"../../src/module/store/checks/email.js","./password":"../../src/module/store/checks/password.js"}],"../../src/module/store/alerts/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PASSWORD_IS_NOT_CORRECT = exports.EMAIL_IS_NOT_REGISTERED = exports.INVALID_FORGOT_TOKEN = exports.INVALID_SIGNUP_TOKEN = exports.EMAIL_ALREADY_REGISTERED = void 0;
var EMAIL_ALREADY_REGISTERED = {
  en: 'Email is already registered',
  es: 'Este email ya está registrado'
};
exports.EMAIL_ALREADY_REGISTERED = EMAIL_ALREADY_REGISTERED;
var INVALID_SIGNUP_TOKEN = {
  en: 'Code is not correct',
  es: 'Código incorrecto'
};
exports.INVALID_SIGNUP_TOKEN = INVALID_SIGNUP_TOKEN;
var INVALID_FORGOT_TOKEN = {
  en: 'Code is not correct',
  es: 'Código incorrecto'
};
exports.INVALID_FORGOT_TOKEN = INVALID_FORGOT_TOKEN;
var EMAIL_IS_NOT_REGISTERED = {
  en: 'This email is not registered',
  es: 'Este email no está registrado'
};
exports.EMAIL_IS_NOT_REGISTERED = EMAIL_IS_NOT_REGISTERED;
var PASSWORD_IS_NOT_CORRECT = {
  en: 'Password is not correct',
  es: 'Contraseña incorrecta'
};
exports.PASSWORD_IS_NOT_CORRECT = PASSWORD_IS_NOT_CORRECT;
},{}],"../../src/module/store/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var actions = _interopRequireWildcard(require("./actions"));

var checks = _interopRequireWildcard(require("./checks"));

var alerts = _interopRequireWildcard(require("./alerts"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var _default = {
  actions: actions,
  checks: checks,
  alerts: alerts,
  observables: {
    // Domain properties
    user_id: '',
    language: 'en',
    // pages
    currentPage: '',
    // welcome, signin, signup, forgot
    // signup
    'signup.currentStep': 0,
    // Name, Email, Password, Token
    'signup.name': '',
    'signup.email': '',
    'signup.password': '',
    'signup.password.isVisible': false,
    'signup.tokenDigits': [],
    // 6 position numeric array
    // signin
    'signin.currentStep': 0,
    // Email, Password
    'signin.name': '',
    // setted after email is checked to be registered
    'signin.email': '',
    'signin.password': '',
    'signin.password.isVisible': false,
    // forgot
    'forgot.currentStep': 0,
    // Password, Token
    'forgot.name': '',
    // setted after email is checked to be registered
    'forgot.email': '',
    'forgot.password': '',
    'forgot.password.isVisible': false,
    'forgot.tokenDigits': [] // 6 position numeric array

  }
};
exports.default = _default;
},{"./actions":"../../src/module/store/actions/index.js","./checks":"../../src/module/store/checks/index.js","./alerts":"../../src/module/store/alerts/index.js"}],"../../src/module/ui/components/Button.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = void 0;

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div\n          @click=", "\n          class=", "\n          style=", "\n        >\n          ", "\n        </div>\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Button = function Button(ui) {
  return ui.hoc({
    classes: {
      div: "\n        cursor: pointer;\n        text-align: center;\n        transition: all .6s ease;\n        user-select: none;\n        width: 100%;\n        box-shadow: inset 0px 0px 200px hsla(0, 0%, 0%, 0), 0px 1px 3px -1px black;\n        &:hover {\n          box-shadow: inset 0px 0px 200px hsla(0, 0%, 0%, 0.3), 0px 1px 3px -1px black;\n        }\n      ",
      a: "\n        text-decoration: none;\n        color: inherit;\n      "
    },
    styles: {
      div: function div(color, bgColor, height) {
        return "\n        background-color: ".concat(bgColor, ";\n        border-radius: ").concat(height, "px;\n        color: ").concat(color, ";\n        height: ").concat(height, "px;\n        line-height: ").concat(height, "px;\n      ");
      }
    },
    render: function render(_ref) {
      var props = _ref.props,
          classes = _ref.classes,
          styles = _ref.styles;
      var text = props.text,
          color = props.color,
          bgColor = props.bgColor,
          height = props.height,
          href = props.href,
          onClick = props.onClick;
      return ui.html(_templateObject(), onClick, classes.div, styles.div(color, bgColor, height), href ? ui.unsafeHTML("<a href=".concat(href, " class=").concat(classes.a, ">").concat(text, "</a>")) : text);
    }
  });
};

exports.Button = Button;
},{}],"../../src/module/ui/components/Carrousel.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Carrousel = void 0;

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n              <div style=", ">\n                ", "\n              </div>\n            "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div id='carrousel' style=", ">\n          <div style=", ">\n            ", "\n          </div>\n        </div>\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Carrousel = function Carrousel(ui) {
  return ui.hoc({
    styles: {
      container: "\n        width: 100%;\n        height: 100%;\n        overflow: hidden;\n        padding: 10px 20px;\n      ",
      inner: function inner(currentStep) {
        return "\n        display: flex;\n        transition: transform .4s ease;\n        transform: translate3d(".concat(-100 * currentStep, "%, 0, 0);\n      ");
      },
      screen: "\n        min-width: 100%;\n        padding: 20px 20px 40px;\n      "
    },
    render: function render(_ref) {
      var props = _ref.props,
          styles = _ref.styles;
      var screens = props.screens,
          currentStep = props.currentStep;
      return ui.html(_templateObject(), styles.container, styles.inner(currentStep), screens.map(function (screen) {
        return ui.html(_templateObject2(), styles.screen, screen());
      }));
    }
  });
};

exports.Carrousel = Carrousel;
},{}],"../../src/module/ui/components/Icons.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Icons = void 0;

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div\n          class=", "\n          style=", "\n          @click=", "\n        >\n          ", "\n        </div>\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Icons = function Icons(ui) {
  var IconsSVGs = ui.lib.IconsSVGs;
  return ui.hoc({
    styles: {
      div: function div(size, enabled) {
        var inStyle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        return "\n        transition: all .6s ease;\n        width: ".concat(size, "px;\n        height: ").concat(size, "px;\n        cursor: ").concat(enabled ? 'pointer' : 'auto', ";\n        opacity: ").concat(enabled ? 1 : 0.5, ";\n        ").concat(inStyle, "\n      ");
      }
    },
    render: function render(_ref) {
      var props = _ref.props,
          styles = _ref.styles;
      var icon = props.icon,
          size = props.size,
          _props$enabled = props.enabled,
          enabled = _props$enabled === void 0 ? true : _props$enabled,
          inStyle = props.inStyle,
          _props$className = props.className,
          className = _props$className === void 0 ? '' : _props$className;
      if (!IconsSVGs[icon]) return '<>';

      var onClick = function onClick() {
        return enabled ? props.onClick() : undefined;
      };

      return ui.html(_templateObject(), className, styles.div(size, enabled, inStyle), onClick, ui.unsafeHTML(IconsSVGs[icon]));
    }
  });
};

exports.Icons = Icons;
},{}],"../../src/module/ui/components/Input.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Input = void 0;

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <input\n          type=", "\n          placeholder=", "\n          value=", "\n          style=", "\n          @input=", "\n          @keydown=", "\n        />\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Input = function Input(ui) {
  return ui.hoc({
    styles: {
      input: "\n        font-size: 18px;\n        border: none;\n        outline: none;\n        padding: 20px;\n        background: hsl(0, 0%, 98%);\n        border-radius: 5px;\n        margin-bottom: 30px;\n      "
    },
    actions: function actions(props)
    /* store */
    {
      return {
        onKeyDown: function onKeyDown(e) {
          // Tab pressed
          if (e.keyCode === 9) {
            e.preventDefault();
            props.onClickRight();
          }
        }
      };
    },
    render: function render(_ref) {
      var props = _ref.props,
          styles = _ref.styles,
          actions = _ref.actions;
      var type = props.type,
          placeholder = props.placeholder,
          value = props.value,
          onInput = props.onInput;
      return ui.html(_templateObject(), type, placeholder, value, styles.input, onInput, actions.onKeyDown);
    }
  });
};

exports.Input = Input;
},{}],"../../src/module/ui/components/Modal.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Modal = void 0;

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n                <div style=", ">\n                  ", "\n                </div>\n              "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div id='modal' class=", ">\n          <div class=", ">\n            ", "\n          </div>\n        </div>\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var breakpoint = '768px';

var Modal = function Modal(ui) {
  return ui.hoc({
    styles: {
      subcomponent: function subcomponent(isSelected) {
        return "\n        position: absolute;\n        width: 100%;\n        height: 100%;\n        transition: opacity .3s ease;\n        opacity: ".concat(isSelected ? 1 : 0, ";\n        pointer-events: ").concat(isSelected ? 'auto' : 'none', ";\n      ");
      }
    },
    classes: {
      container: "\n        display: flex;\n        align-items: center;\n        justify-content:center;\n        background: hsl(0, 0%, 20%);\n        position: fixed;\n        top: 0; bottom: 0; left: 0; right: 0;\n      ",
      modal: "\n        position: relative;\n        background: white;\n        min-width: 500px;\n        width: 40%;\n        max-width: 500px;\n        min-height: 90%;\n        max-height: 90%;\n        border-radius: 10px;\n        overflow: hidden;\n        @media (max-width: ".concat(breakpoint, ") {\n          & {\n            min-height: 100%;\n            min-width: 100%;\n            max-width: 100%;\n            width: 100%;\n            border-radius: 0;\n          }\n        }\n      ")
    },
    render: function render(_ref) {
      var props = _ref.props,
          styles = _ref.styles,
          classes = _ref.classes;
      // return ui.html`<div>Modal</div>`;
      var pages = props.pages,
          currentPage = props.currentPage;
      return ui.html(_templateObject(), classes.container, classes.modal, Object.keys(pages).map(function (key) {
        var component = pages[key];
        return ui.html(_templateObject2(), styles.subcomponent(key === currentPage), component());
      }));
    }
  });
};

exports.Modal = Modal;
},{}],"../../src/module/ui/components/Navigation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Navigation = void 0;

var _Icons = require("./Icons");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div id='navigation' style=", ">\n          ", "\n          <div style=", ">\n            ", "\n          </div>\n          ", "\n        </div>\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var size = 50;

var Navigation = function Navigation(ui) {
  var IconsComp = (0, _Icons.Icons)(ui);
  return ui.hoc({
    styles: {
      container: "\n        display: flex;\n        align-items: center;\n        margin: 50px 30px;\n      ",
      text: function text(_text, color) {
        return "\n        flex: 1;\n        text-align: center;\n        opacity: ".concat(_text ? 1 : 0, ";\n        transition: opacity .6s ease;\n        color: ").concat(color || 'initial', ";\n      ");
      }
    },
    classes: {
      'signup-right-enabled': "\n        background-position: center;\n        transition: background 0.3s;\n        background: ".concat(ui.lib.Colors.GREEN_SIGNUP, ";\n        border-radius: 50%;\n        fill: white;\n        box-shadow: -1px 1px 3px -1px black;\n        &:active {\n          background-color: hsla(0, 0%, 0%, 0.8);\n          background-size: 100%;\n          transition: background 0s;\n        }\n      "),
      'signin-right-enabled': "\n        background-position: center;\n        transition: background 0.3s;\n        background: ".concat(ui.lib.Colors.BLUE_SIGNIN, ";\n        border-radius: 50%;\n        fill: white;\n        box-shadow: -1px 1px 3px -1px black;\n        &:active {\n          background-color: hsla(0, 0%, 0%, 0.8);\n          background-size: 100%;\n          transition: background 0s;\n        }\n      ")
    },
    render: function render(_ref) {
      var props = _ref.props,
          styles = _ref.styles,
          classes = _ref.classes;
      var currentPage = props.currentPage,
          onClickLeft = props.onClickLeft,
          onClickRight = props.onClickRight,
          leftEnabled = props.leftEnabled,
          rightEnabled = props.rightEnabled,
          text = props.text,
          color = props.color;
      return ui.html(_templateObject(), styles.container, IconsComp({
        icon: 'chevron-left',
        onClick: onClickLeft,
        size: size,
        enabled: leftEnabled
      }), styles.text(text, color), text || '', IconsComp({
        icon: 'chevron-right',
        onClick: onClickRight,
        size: size,
        enabled: rightEnabled,
        className: !rightEnabled ? '' : currentPage === 'signup' ? classes['signup-right-enabled'] : classes['signin-right-enabled'] // forgot also uses signin styles

      }));
    }
  });
};

exports.Navigation = Navigation;
},{"./Icons":"../../src/module/ui/components/Icons.js"}],"../../src/module/ui/components/NotFound.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotFound = void 0;

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div>\n          NOT FOUND\n        </div>\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var NotFound = function NotFound(ui) {
  return ui.hoc({
    render: function render() {
      return ui.html(_templateObject());
    }
  });
};

exports.NotFound = NotFound;
},{}],"../../src/module/ui/components/NumKeyboard.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NumKeyboard = void 0;

var _Icons = require("./Icons");

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n                <div style=", " @click=", ">\n                  <span class=", ">", "</span>\n                </div>\n              "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n                <div style=", " @click=", ">\n                  <span class=", ">", "</span>\n                </div>\n              "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div id='keyboard' class=", ">\n          <div class=", ">\n            ", "\n          </div>\n          <div class=", ">\n            ", "\n            <div style=", ">\n              ", "\n            </div>\n          </div>\n\n        </div>\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var NumKeyboard = function NumKeyboard(ui) {
  var IconsComp = (0, _Icons.Icons)(ui);
  return ui.hoc({
    classes: {
      container: "\n        padding: 20px;\n      ",
      range: "\n        display: flex;\n        justify-content:center;\n      ",
      digitspan: "\n        user-select: none;\n      "
    },
    styles: {
      digit: function digit(isSvg) {
        return "\n        cursor: pointer;\n        background: hsl(0, 0%, 80%);\n        font-size: 24px;\n        font-family: sans-serif;\n        border-radius: 10px;\n        margin: 10px 5px;\n        min-width: 40px;\n        height: 40px;\n        text-align: center;\n        line-height: 40px;\n        box-shadow: 0px 1px 3px -1px black;\n        padding: ".concat(isSvg ? '6px' : '0px', ";\n      ");
      }
    },
    render: function render(_ref) {
      var props = _ref.props,
          classes = _ref.classes,
          styles = _ref.styles;
      var onPressNum = props.onPressNum,
          onPressDel = props.onPressDel;
      var ranges = [[1, 2, 3, 4, 5, 6], [7, 8, 9, 0]];
      return ui.html(_templateObject(), classes.container, classes.range, ranges[0].map(function (i) {
        return ui.html(_templateObject2(), styles.digit(false), function () {
          return onPressNum(i);
        }, classes.digitspan, i);
      }), classes.range, ranges[1].map(function (i) {
        return ui.html(_templateObject3(), styles.digit(false), function () {
          return onPressNum(i);
        }, classes.digitspan, i);
      }), styles.digit(true), IconsComp({
        icon: 'backspace',
        onClick: onPressDel,
        size: 30
      }));
    }
  });
};

exports.NumKeyboard = NumKeyboard;
},{"./Icons":"../../src/module/ui/components/Icons.js"}],"../../src/module/ui/components/Progress.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Progress = void 0;

var _index = _interopRequireDefault(require("../../../../../../../libs/belt/src/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n              <div style=", "></div>\n            "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div id='progress' style=", ">\n          ", "\n        </div>\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Progress = function Progress(ui) {
  return ui.hoc({
    styles: {
      container: "\n        display: flex;\n        justify-content: center;\n        margin-top: 8px;\n      ",
      item: function item(isSelected) {
        return "\n        background: ".concat(isSelected ? 'hsl(0, 0%, 80%)' : 'hsl(0, 0%, 90%)', ";\n        width: 12px;\n        height: 12px;\n        border-radius: 50%;\n        margin: 0 5px;\n      ");
      }
    },
    render: function render(_ref) {
      var props = _ref.props,
          styles = _ref.styles;
      var numSteps = props.numSteps,
          currentStep = props.currentStep;
      return ui.html(_templateObject(), styles.container, _index.default.range(numSteps).map(function (item) {
        var isSelected = item === currentStep;
        return ui.html(_templateObject2(), styles.item(isSelected));
      }));
    }
  });
};

exports.Progress = Progress;
},{"../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js"}],"../../src/module/ui/components/Token.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Token = void 0;

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n              <div class=", ">\n                ", "\n              </div>\n            "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div id='token' class=", ">\n          ", "\n        </div>\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Token = function Token(ui) {
  return ui.hoc({
    classes: {
      container: "\n        display: flex;\n        margin: 10px 20px;\n        justify-content: space-between;\n      ",
      digit: "\n        font-size: 34px;\n        flex: 1;\n        height: 50px;\n        line-height:50px;\n        text-align: center;\n        max-width: 50px;\n        background: hsl(0, 0%, 95%);\n        border: 1px solid hsl(0,0%,90%);\n        border-radius: 5px;\n        user-select: none;\n      "
    },
    render: function render(_ref) {
      var props = _ref.props,
          classes = _ref.classes;
      var tokenDigits = props.tokenDigits;
      var range = [0, 1, 2, 3, 4, 5];
      return ui.html(_templateObject(), classes.container, range.map(function (i) {
        return ui.html(_templateObject2(), classes.digit, tokenDigits[i] || '');
      }));
    }
  });
};

exports.Token = Token;
},{}],"../../src/module/ui/components/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Button = require("./Button");

var _Carrousel = require("./Carrousel");

var _Icons = require("./Icons");

var _Input = require("./Input");

var _Modal = require("./Modal");

var _Navigation = require("./Navigation");

var _NotFound = require("./NotFound");

var _NumKeyboard = require("./NumKeyboard");

var _Progress = require("./Progress");

var _Token = require("./Token");

var _default = function _default(ui) {
  return {
    Button: (0, _Button.Button)(ui),
    Carrousel: (0, _Carrousel.Carrousel)(ui),
    Icons: (0, _Icons.Icons)(ui),
    Input: (0, _Input.Input)(ui),
    Modal: (0, _Modal.Modal)(ui),
    Navigation: (0, _Navigation.Navigation)(ui),
    NotFound: (0, _NotFound.NotFound)(ui),
    NumKeyboard: (0, _NumKeyboard.NumKeyboard)(ui),
    Progress: (0, _Progress.Progress)(ui),
    Token: (0, _Token.Token)(ui)
  };
};

exports.default = _default;
},{"./Button":"../../src/module/ui/components/Button.js","./Carrousel":"../../src/module/ui/components/Carrousel.js","./Icons":"../../src/module/ui/components/Icons.js","./Input":"../../src/module/ui/components/Input.js","./Modal":"../../src/module/ui/components/Modal.js","./Navigation":"../../src/module/ui/components/Navigation.js","./NotFound":"../../src/module/ui/components/NotFound.js","./NumKeyboard":"../../src/module/ui/components/NumKeyboard.js","./Progress":"../../src/module/ui/components/Progress.js","./Token":"../../src/module/ui/components/Token.js"}],"../../src/module/ui/fragments/Header.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Header = void 0;

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div\n          id='header'\n          class=", "\n          style=", "\n        >\n          <img src=", " alt='company-name' class=", " />\n          ", "\n        </div>\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Header = function Header(ui) {
  var size = ui.lib.Sizes.HEADER_HEIGHT;
  var Progress = ui.components.Progress;
  return ui.hoc({
    actions: function actions(props, store) {
      return {
        onNavigateBack: function onNavigateBack() {
          return store.call('changeRoute', {
            page: '',
            action: 'back'
          });
        }
      };
    },
    classes: {
      container: "\n        min-height: ".concat(size, ";\n        max-height: ").concat(size, ";\n        width: 100%;\n        display: flex;\n        align-items: center;\n        padding: 0 30px;\n        border-bottom: 1px solid hsl(0, 0%, 95%);\n      "),
      image: "\n        max-height: 32px;\n      "
    },
    styles: {
      container: function container(numSteps) {
        return "\n        justify-content: ".concat(numSteps > 0 ? 'space-between' : 'center', ";\n      ");
      }
    },
    render: function render(_ref) {
      var props = _ref.props,
          classes = _ref.classes,
          styles = _ref.styles;
      var _props$numSteps = props.numSteps,
          numSteps = _props$numSteps === void 0 ? 0 : _props$numSteps,
          currentStep = props.currentStep;
      var src = ui.lib.Assets.COMPANY_LOGO;
      return ui.html(_templateObject(), classes.container, styles.container(numSteps), src, classes.image, numSteps > 0 ? Progress({
        numSteps: numSteps,
        currentStep: currentStep
      }) : '');
    }
  });
};

exports.Header = Header;
},{}],"../../src/module/ui/fragments/Tabs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tabs = void 0;

var _index = _interopRequireDefault(require("../../../../../../../libs/belt/src/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div\n          id='tabs'\n          class=", "\n        >\n          <div\n            style=", "\n            @click=", "\n          >\n            ", "\n          </div>\n          <div\n            style=", "\n            @click=", "\n          >\n            ", "\n          </div>\n        </div>\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Tabs = function Tabs(ui) {
  var size = ui.lib.Sizes.TABS_HEIGHT;
  var _ui$lib$Colors = ui.lib.Colors,
      GREEN_SIGNUP = _ui$lib$Colors.GREEN_SIGNUP,
      BLUE_SIGNIN = _ui$lib$Colors.BLUE_SIGNIN;
  return ui.hoc({
    state: function state(props, store) {
      return {
        language: store.get('language'),
        currentPage: store.get('currentPage')
      };
    },
    actions: function actions(props, store) {
      return {
        onSelectSignUp: function onSelectSignUp() {
          return store.call('changeRoute', {
            page: 'signup',
            action: 'replace'
          });
        },
        onSelectSignIn: function onSelectSignIn() {
          return store.call('changeRoute', {
            page: 'signin',
            action: 'replace'
          });
        }
      };
    },
    classes: {
      container: "\n        display: flex;\n        width: 100%;\n        align-items: center;\n        min-height: ".concat(size, ";\n        max-height: ").concat(size, ";\n      ")
    },
    styles: {
      tab: function tab(i, color, isSelected) {
        return "\n        height: ".concat(size, ";\n        padding: 8px 0px;\n        flex: 1;\n        font-size: 20px;\n        text-align: center;\n        cursor: pointer;\n        user-select: none;\n        color: ").concat(isSelected ? color : 'hsl(0, 0%, 55%)', ";\n        background: ").concat(isSelected ? 'white' : 'hsl(0, 0%, 92%)', ";\n        border-top: 1px solid hsl(0, 0%, ").concat(isSelected ? 100 : 80, "%);\n        border-right: ").concat(isSelected && i === 0 ? '1px solid hsl(0, 0%, 80%)' : '1px solid transparent', ";\n        border-left: ").concat(isSelected && i === 1 ? '1px solid hsl(0, 0%, 80%)' : '1px solid transparent', ";\n      ");
      }
    },
    render: function render(_ref) {
      var styles = _ref.styles,
          actions = _ref.actions,
          state = _ref.state,
          classes = _ref.classes;
      var language = state.language,
          currentPage = state.currentPage;
      var onSelectSignUp = actions.onSelectSignUp,
          onSelectSignIn = actions.onSelectSignIn;
      var isSignupSelected = currentPage === 'signup';
      return ui.html(_templateObject(), classes.container, styles.tab(0, GREEN_SIGNUP, isSignupSelected), onSelectSignUp, _index.default.get({
        en: 'Sign Up',
        es: 'Registro'
      }, language), styles.tab(1, BLUE_SIGNIN, !isSignupSelected), onSelectSignIn, _index.default.get({
        en: 'Sign In',
        es: 'Acceso'
      }, language));
    }
  });
};

exports.Tabs = Tabs;
},{"../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js"}],"../../src/module/ui/fragments/PasswordOptions.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PasswordOptions = void 0;

var _index = _interopRequireDefault(require("../../../../../../../libs/belt/src/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div\n          id='password-options'\n          class=", "\n        >\n          <div style=", " @click=", ">\n            ", "\n          </div>\n          ", "\n        </div>\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var PasswordOptions = function PasswordOptions(ui) {
  var Icons = ui.components.Icons;
  return ui.hoc({
    actions: function actions(props, store) {
      return {
        onClickEye: function onClickEye() {
          return store.toggle("".concat(props.page, ".password.isVisible"));
        },
        onClickForgot: function onClickForgot() {
          return store.set({
            currentPage: 'forgot'
          });
        }
      };
    },
    state: function state(props, store) {
      return {
        language: store.get('language'),
        isPasswordVisible: store.get("".concat(props.page, ".password.isVisible")),
        isIconVisible: store.get("".concat(props.page, ".password")).length > 0
      };
    },
    classes: {
      container: "\n        width: 100%;\n        display: flex;\n        align-items: center;\n        padding: 10px;\n        margin-bottom: 30px;\n      "
    },
    styles: {
      forgot: function forgot(_forgot) {
        return "\n        font-size: 14px;\n        user-select: none;\n        flex: 1;\n        opacity: ".concat(_forgot ? 1 : 0, ";\n        pointer-events: ").concat(_forgot ? 'auto' : 'none', ";\n        cursor: pointer;\n      ");
      },
      icon: function icon(isVisible) {
        return "\n        opacity: ".concat(isVisible ? 1 : 0, ";\n        pointer-events: ").concat(isVisible ? 'auto' : 'none', ";\n      ");
      }
    },
    render: function render(_ref) {
      var props = _ref.props,
          classes = _ref.classes,
          state = _ref.state,
          actions = _ref.actions,
          styles = _ref.styles;
      var isPasswordVisible = state.isPasswordVisible,
          isIconVisible = state.isIconVisible,
          language = state.language;
      var _props$forgot = props.forgot,
          forgot = _props$forgot === void 0 ? false : _props$forgot;
      return ui.html(_templateObject(), classes.container, styles.forgot(forgot), actions.onClickForgot, _index.default.get({
        en: 'Forgot password?',
        es: '¿Olvidaste tu contraseña?'
      }, language), Icons({
        icon: isPasswordVisible ? 'eye-off' : 'eye-on',
        size: 20,
        onClick: isIconVisible ? actions.onClickEye : function () {
          return undefined;
        },
        inStyle: styles.icon(isIconVisible)
      }));
    }
  });
};

exports.PasswordOptions = PasswordOptions;
},{"../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js"}],"../../src/module/ui/fragments/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Header = require("./Header");

var _Tabs = require("./Tabs");

var _PasswordOptions = require("./PasswordOptions");

var _default = function _default(ui) {
  return {
    Header: (0, _Header.Header)(ui),
    Tabs: (0, _Tabs.Tabs)(ui),
    PasswordOptions: (0, _PasswordOptions.PasswordOptions)(ui)
  };
};

exports.default = _default;
},{"./Header":"../../src/module/ui/fragments/Header.js","./Tabs":"../../src/module/ui/fragments/Tabs.js","./PasswordOptions":"../../src/module/ui/fragments/PasswordOptions.js"}],"../../src/module/ui/lib/Assets.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Assets = void 0;
var IMAGES_BASE_PATH = 'https://res.cloudinary.com/jmaguirrei/image/upload';
var Assets = {
  IMAGES_BASE_PATH: IMAGES_BASE_PATH,
  COMPANY_LOGO: "".concat(IMAGES_BASE_PATH, "/company/internal/company.jpg")
};
exports.Assets = Assets;
},{}],"../../src/module/ui/lib/Colors.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Colors = void 0;
var Colors = {
  GREEN_SIGNUP: 'hsl(147, 50%, 47%)',
  BLUE_SIGNIN: 'hsl(219, 79%, 58%)',
  RED_WARNING: 'hsl(0, 65%, 60%)'
};
exports.Colors = Colors;
},{}],"../../src/module/ui/lib/IconsSVGs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IconsSVGs = void 0;
var backspace = "\n  <svg viewBox=\"0 0 24 24\">\n    <path fill=\"none\" d=\"M0 0h24v24H0V0z\"/>\n    <path d=\"M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21v-2z\"/>\n  </svg>\n";
var eyeOn = "\n  <svg viewbox=\"0 0 24 24\">\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\">\n    </path>\n    <path d=\"M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z\">\n    </path>\n  </svg>\n";
var eyeOff = "\n  <svg viewbox=\"0 0 24 24\">\n    <path d=\"M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z\" fill=\"none\">\n    </path>\n    <path d=\"M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z\">\n    </path>\n  </svg>\n";
var email = "\n  <svg viewbox=\"0 0 24 24\">\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\">\n    </path>\n    <path d=\"M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z\">\n    </path>\n  </svg>\n";
var close = "\n  <svg viewbox=\"0 0 24 24\">\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\">\n    </path>\n    <path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z\">\n    </path>\n  </svg>\n";
var chevronLeft = "\n  <svg viewbox=\"0 0 24 24\">\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\">\n    </path>\n    <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z\">\n    </path>\n  </svg>\n";
var chevronRight = "\n  <svg viewbox=\"0 0 24 24\">\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\">\n    </path>\n    <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z\">\n    </path>\n  </svg>\n";
var linkedin = "\n  <svg viewbox=\"0 0 24 24\">\n    <path fill=\"#0077B5\" d=\"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z\">\n    </path>\n  </svg>\n";
var google = "\n  <svg viewBox=\"0 0 48 48\">\n    <defs>\n      <path id=\"a\" d=\"M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z\"/>\n    </defs>\n    <clipPath id=\"b\">\n      <use xlink:href=\"#a\" overflow=\"visible\"/>\n    </clipPath>\n    <path clip-path=\"url(#b)\" fill=\"#FBBC05\" d=\"M0 37V11l17 13z\"/>\n    <path clip-path=\"url(#b)\" fill=\"#EA4335\" d=\"M0 11l17 13 7-6.1L48 14V0H0z\"/>\n    <path clip-path=\"url(#b)\" fill=\"#34A853\" d=\"M0 37l30-23 7.9 1L48 0v48H0z\"/>\n    <path clip-path=\"url(#b)\" fill=\"#4285F4\" d=\"M48 48L17 24l-4-3 35-10z\"/>\n  </svg>\n";
var facebook = "\n  <svg viewbox=\"0 0 24 24\">\n    <path fill=\"#3B5998\" d=\"M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796.141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c.733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0\">\n    </path>\n  </svg>\n";
/* --------------------------------------------------------------------------------------------- */

var IconsSVGs = {
  // Keyboard
  backspace: backspace,
  // Forms
  'eye-on': eyeOn,
  'eye-off': eyeOff,
  email: email,
  // Navigation
  close: close,
  'chevron-left': chevronLeft,
  'chevron-right': chevronRight,
  // Social
  facebook: facebook,
  linkedin: linkedin,
  google: google
};
exports.IconsSVGs = IconsSVGs;
},{}],"../../src/module/ui/lib/Sizes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sizes = void 0;
var Sizes = {
  HEADER_HEIGHT: '55px',
  TABS_HEIGHT: '50px'
};
exports.Sizes = Sizes;
},{}],"../../src/module/ui/lib/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Assets", {
  enumerable: true,
  get: function () {
    return _Assets.Assets;
  }
});
Object.defineProperty(exports, "Colors", {
  enumerable: true,
  get: function () {
    return _Colors.Colors;
  }
});
Object.defineProperty(exports, "IconsSVGs", {
  enumerable: true,
  get: function () {
    return _IconsSVGs.IconsSVGs;
  }
});
Object.defineProperty(exports, "Sizes", {
  enumerable: true,
  get: function () {
    return _Sizes.Sizes;
  }
});

var _Assets = require("./Assets");

var _Colors = require("./Colors");

var _IconsSVGs = require("./IconsSVGs");

var _Sizes = require("./Sizes");
},{"./Assets":"../../src/module/ui/lib/Assets.js","./Colors":"../../src/module/ui/lib/Colors.js","./IconsSVGs":"../../src/module/ui/lib/IconsSVGs.js","./Sizes":"../../src/module/ui/lib/Sizes.js"}],"../../src/module/ui/pages/<SignIn>/<>/Email.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("../../../../../../../../../libs/belt/src/index.js"));

var _context = require("../../../../context");

var _SignIn = require("../SignIn");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <div style=", ">\n        <div>\n          <div style=", ">\n            ", "\n          </div>\n          <div style=", ">\n            ", "\n          </div>\n        </div>\n        ", "\n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Input = _context.ui.components.Input;

var _default = _context.ui.hoc({
  state: function state(props, store) {
    return {
      language: store.get('language'),
      email: store.get('signin.email')
    };
  },
  actions: function actions(props, store) {
    return {
      onInput: function onInput(e) {
        var email = e.target.value;
        store.set({
          'signin.email': email,
          'forgot.email': email
        });
      },
      onClickRight: function onClickRight() {
        var _SigninControl = (0, _SignIn.SigninControl)(store),
            state = _SigninControl.state,
            actions = _SigninControl.actions;

        var enabled = state.rightEnabled;
        if (enabled) actions.onClickRight();
      }
    };
  },
  styles: {
    wrapper: "\n      display: flex;\n      flex-flow: column;\n      height: 100%;\n      justify-content: space-around;\n    ",
    title: "\n      font-size: 28px;\n      padding: 20px 20px 10px 20px;\n    ",
    subtitle: "\n      font-size: 24px;\n      padding: 10px 20px 20px 20px;\n    "
  },
  render: function render(_ref) {
    var state = _ref.state,
        styles = _ref.styles,
        actions = _ref.actions;
    var language = state.language,
        email = state.email;
    return _context.ui.html(_templateObject(), styles.wrapper, styles.title, _index.default.get({
      en: 'Welcome back!',
      es: '¡Bienvenid@ de nuevo!'
    }, language), styles.subtitle, _index.default.get({
      en: 'Enter your email',
      es: 'Ingresa tu email'
    }, language), Input({
      type: 'text',
      placeholder: _index.default.get({
        en: 'Your email',
        es: 'Tu email'
      }, language),
      value: email,
      onInput: actions.onInput,
      onClickRight: actions.onClickRight
    }));
  }
});

exports.default = _default;
},{"../../../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js","../../../../context":"../../src/module/context.js","../SignIn":"../../src/module/ui/pages/<SignIn>/SignIn.js"}],"../../src/module/ui/pages/<SignIn>/<>/Password.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("../../../../../../../../../libs/belt/src/index.js"));

var _context = require("../../../../context");

var _SignIn = require("../SignIn");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <div style=", ">\n        <div>\n          <div style=", ">\n            ", "\n          </div>\n          <div style=", ">\n            ", "\n          </div>\n        </div>\n        <div style=", ">\n          ", "\n          ", "\n        </div>\n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Input = _context.ui.components.Input;
var PasswordOptions = _context.ui.fragments.PasswordOptions;

var _default = _context.ui.hoc({
  state: function state(props, store) {
    return {
      language: store.get('language'),
      name: store.get('signin.name').split(' ')[0],
      password: store.get('signin.password'),
      isPasswordVisible: store.get('signin.password.isVisible')
    };
  },
  actions: function actions(props, store) {
    return {
      onInput: function onInput(e) {
        store.set({
          'signin.password': e.target.value
        });
      },
      onClickRight: function onClickRight() {
        var _SigninControl = (0, _SignIn.SigninControl)(store),
            state = _SigninControl.state,
            actions = _SigninControl.actions;

        var enabled = state.rightEnabled;
        if (enabled) actions.onClickRight();
      }
    };
  },
  styles: {
    wrapper: "\n      display: flex;\n      flex-flow: column;\n      height: 100%;\n      justify-content: space-around;\n    ",
    title: "\n      font-size: 28px;\n      padding: 20px 20px 10px 20px;\n    ",
    subtitle: "\n      font-size: 24px;\n      padding: 10px 20px 20px 20px;\n    ",
    'input-wrapper': "\n      display: flex;\n      flex-flow: column;\n    "
  },
  render: function render(_ref) {
    var state = _ref.state,
        styles = _ref.styles,
        actions = _ref.actions;
    var language = state.language,
        name = state.name,
        password = state.password,
        isPasswordVisible = state.isPasswordVisible;
    return _context.ui.html(_templateObject(), styles.wrapper, styles.title, _index.default.get({
      en: "Hello ".concat(name, "!"),
      es: "\xA1Hola ".concat(name, "!")
    }, language), styles.subtitle, _index.default.get({
      en: 'Enter your password',
      es: 'Ingresa tu contraseña'
    }, language), styles['input-wrapper'], Input({
      type: isPasswordVisible ? 'text' : 'password',
      placeholder: '********',
      value: password,
      onInput: actions.onInput,
      onClickRight: actions.onClickRight
    }), PasswordOptions({
      forgot: true,
      page: 'signin'
    }));
  }
});

exports.default = _default;
},{"../../../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js","../../../../context":"../../src/module/context.js","../SignIn":"../../src/module/ui/pages/<SignIn>/SignIn.js"}],"../../src/module/ui/pages/<SignIn>/SignIn.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SigninControl = void 0;

var _index = _interopRequireDefault(require("../../../../../../../../libs/belt/src/index.js"));

var _context = require("../../../context");

var _Email = _interopRequireDefault(require("./<>/Email"));

var _Password = _interopRequireDefault(require("./<>/Password"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <div id='sign-in' class=", ">\n        ", "\n        ", "\n        ", "\n        ", "\n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/* --------------------------------------------------------------------------------------------- */
var _ui$components = _context.ui.components,
    Carrousel = _ui$components.Carrousel,
    Navigation = _ui$components.Navigation;
var _ui$fragments = _context.ui.fragments,
    Header = _ui$fragments.Header,
    Tabs = _ui$fragments.Tabs;
var screens = [_Email.default, _Password.default];
var numSteps = screens.length;
/* --------------------------------------------------------------------------------------------- */

var SigninControl = function SigninControl(store) {
  var language = store.get('language');
  var currentStep = store.get('signin.currentStep');

  var currentCheck = _index.default.get({
    0: store.check('email', store.get('signin.email')),
    1: store.check('password', store.get('signin.password'))
  }, currentStep, {});

  var checkResult = _index.default.get(currentCheck, 'result', false);

  var alert = store.alerts.find(function (item) {
    return item.isVisible;
  });
  return {
    state: {
      currentStep: currentStep,
      leftEnabled: currentStep > 0,
      rightEnabled: checkResult,
      checkText: _index.default.get(currentCheck, "message.".concat(language), ''),
      alertText: _index.default.get(alert, "message.".concat(language), '')
    },
    actions: {
      onClickLeft: function onClickLeft() {
        // const currentStep = store.get('signin.currentStep');
        if (currentStep > 0) store.set({
          'signin.currentStep': currentStep - 1
        });
      },
      onClickRight: function onClickRight() {
        // const currentStep = store.get('signin.currentStep');
        if (currentStep === 0) store.call('signinEmail');
        if (currentStep === 1) store.call('signinPassword');
      }
    }
  };
};
/* --------------------------------------------------------------------------------------------- */


exports.SigninControl = SigninControl;

var _default = _context.ui.hoc({
  state: function state(props, store) {
    return SigninControl(store).state;
  },
  actions: function actions(props, store) {
    return SigninControl(store).actions;
  },
  classes: {
    container: "\n      display: flex;\n      flex-flow: column;\n      justify-content: space-around;\n      height: 100%;\n      position: relative;\n    "
  },
  render: function render(_ref) {
    var state = _ref.state,
        actions = _ref.actions,
        classes = _ref.classes;
    var currentStep = state.currentStep,
        leftEnabled = state.leftEnabled,
        rightEnabled = state.rightEnabled,
        checkText = state.checkText,
        alertText = state.alertText;
    var onClickLeft = actions.onClickLeft,
        onClickRight = actions.onClickRight;
    return _context.ui.html(_templateObject(), classes.container, Header({
      numSteps: numSteps,
      currentStep: currentStep
    }), Carrousel({
      currentStep: currentStep,
      screens: screens
    }), Navigation({
      currentPage: 'signin',
      onClickLeft: onClickLeft,
      onClickRight: onClickRight,
      leftEnabled: leftEnabled,
      rightEnabled: rightEnabled,
      text: alertText || checkText,
      color: alertText ? _context.ui.lib.Colors.RED_WARNING : ''
    }), Tabs());
  }
});

exports.default = _default;
},{"../../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js","../../../context":"../../src/module/context.js","./<>/Email":"../../src/module/ui/pages/<SignIn>/<>/Email.js","./<>/Password":"../../src/module/ui/pages/<SignIn>/<>/Password.js"}],"../../src/module/ui/pages/<SignUp>/<>/Name.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("../../../../../../../../../libs/belt/src/index.js"));

var _context = require("../../../../context");

var _SignUp = require("../SignUp");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <div style=", ">\n        <div>\n          <div style=", ">\n            ", "\n          </div>\n          <div style=", ">\n            ", "\n          </div>\n        </div>\n        ", "\n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Input = _context.ui.components.Input;

var _default = _context.ui.hoc({
  state: function state(props, store) {
    return {
      language: store.get('language'),
      name: store.get('signup.name')
    };
  },
  actions: function actions(props, store) {
    return {
      onInput: function onInput(e) {
        store.set({
          'signup.name': e.target.value
        });
      },
      onClickRight: function onClickRight() {
        var _SignupControl = (0, _SignUp.SignupControl)(store),
            state = _SignupControl.state,
            actions = _SignupControl.actions;

        var enabled = state.rightEnabled;
        if (enabled) actions.onClickRight();
      }
    };
  },
  styles: {
    wrapper: "\n      display: flex;\n      flex-flow: column;\n      height: 100%;\n      justify-content: space-around;\n    ",
    title: "\n      font-size: 28px;\n      padding: 20px 20px 10px 20px;\n    ",
    subtitle: "\n      font-size: 24px;\n      padding: 10px 20px 20px 20px;\n    "
  },
  render: function render(_ref) {
    var state = _ref.state,
        styles = _ref.styles,
        actions = _ref.actions;
    var language = state.language,
        name = state.name;
    return _context.ui.html(_templateObject(), styles.wrapper, styles.title, _index.default.get({
      en: 'Welcome!',
      es: '¡Bienvenid@!'
    }, language), styles.subtitle, _index.default.get({
      en: 'What\'s your name?',
      es: '¿Cuál es tu nombre?'
    }, language), Input({
      type: 'text',
      placeholder: _index.default.get({
        en: 'Your name',
        es: 'Tu nombre'
      }, language),
      value: name,
      onInput: actions.onInput,
      onClickRight: actions.onClickRight
    }));
  }
});

exports.default = _default;
},{"../../../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js","../../../../context":"../../src/module/context.js","../SignUp":"../../src/module/ui/pages/<SignUp>/SignUp.js"}],"../../src/module/ui/pages/<SignUp>/<>/Email.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("../../../../../../../../../libs/belt/src/index.js"));

var _context = require("../../../../context");

var _SignUp = require("../SignUp");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <div style=", ">\n        <div>\n          <div style=", ">\n            ", "\n          </div>\n          <div style=", ">\n            ", "\n          </div>\n        </div>\n        ", "\n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Input = _context.ui.components.Input;

var _default = _context.ui.hoc({
  state: function state(props, store) {
    return {
      language: store.get('language'),
      name: store.get('signup.name').split(' ')[0],
      email: store.get('signup.email')
    };
  },
  actions: function actions(props, store) {
    return {
      onInput: function onInput(e) {
        store.set({
          'signup.email': e.target.value
        });
      },
      onClickRight: function onClickRight() {
        var _SignupControl = (0, _SignUp.SignupControl)(store),
            state = _SignupControl.state,
            actions = _SignupControl.actions;

        var enabled = state.rightEnabled;
        if (enabled) actions.onClickRight();
      }
    };
  },
  styles: {
    wrapper: "\n      display: flex;\n      flex-flow: column;\n      height: 100%;\n      justify-content: space-around;\n    ",
    title: "\n      font-size: 28px;\n      padding: 20px 20px 10px 20px;\n    ",
    subtitle: "\n      font-size: 24px;\n      padding: 10px 20px 20px 20px;\n    "
  },
  render: function render(_ref) {
    var state = _ref.state,
        styles = _ref.styles,
        actions = _ref.actions;
    var language = state.language,
        name = state.name,
        email = state.email;
    return _context.ui.html(_templateObject(), styles.wrapper, styles.title, _index.default.get({
      en: "Hello ".concat(name, "!"),
      es: "\xA1Hola ".concat(name, "!")
    }, language), styles.subtitle, _index.default.get({
      en: 'What email do you want to use?',
      es: '¿Qué email deseas usar?'
    }, language), Input({
      type: 'text',
      placeholder: _index.default.get({
        en: 'Your email',
        es: 'Tu email'
      }, language),
      value: email,
      onInput: actions.onInput,
      onClickRight: actions.onClickRight
    }));
  }
});

exports.default = _default;
},{"../../../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js","../../../../context":"../../src/module/context.js","../SignUp":"../../src/module/ui/pages/<SignUp>/SignUp.js"}],"../../src/module/ui/pages/<SignUp>/<>/Password.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("../../../../../../../../../libs/belt/src/index.js"));

var _context = require("../../../../context");

var _SignUp = require("../SignUp");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <div style=", ">\n        <div>\n          <div style=", ">\n            ", "\n          </div>\n          <div style=", ">\n            ", "\n          </div>\n        </div>\n        <div style=", ">\n          ", "\n          ", "\n        </div>\n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Input = _context.ui.components.Input;
var PasswordOptions = _context.ui.fragments.PasswordOptions;

var _default = _context.ui.hoc({
  state: function state(props, store) {
    return {
      language: store.get('language'),
      password: store.get('signup.password'),
      isPasswordVisible: store.get('signup.password.isVisible')
    };
  },
  actions: function actions(props, store) {
    return {
      onInput: function onInput(e) {
        store.set({
          'signup.password': e.target.value
        });
      },
      onClickRight: function onClickRight() {
        var _SignupControl = (0, _SignUp.SignupControl)(store),
            state = _SignupControl.state,
            actions = _SignupControl.actions;

        var enabled = state.rightEnabled;
        if (enabled) actions.onClickRight();
      }
    };
  },
  styles: {
    wrapper: "\n      display: flex;\n      flex-flow: column;\n      height: 100%;\n      justify-content: space-around;\n    ",
    title: "\n      font-size: 28px;\n      padding: 20px 20px 10px 20px;\n    ",
    subtitle: "\n      font-size: 24px;\n      padding: 10px 20px 20px 20px;\n    ",
    'input-wrapper': "\n      display: flex;\n      flex-flow: column;\n    "
  },
  render: function render(_ref) {
    var state = _ref.state,
        styles = _ref.styles,
        actions = _ref.actions;
    var language = state.language,
        isPasswordVisible = state.isPasswordVisible,
        password = state.password;
    return _context.ui.html(_templateObject(), styles.wrapper, styles.title, _index.default.get({
      en: 'Perfect, now:',
      es: 'Perfecto, ahora:'
    }, language), styles.subtitle, _index.default.get({
      en: 'Choose a password',
      es: 'Elige una contraseña'
    }, language), styles['input-wrapper'], Input({
      type: isPasswordVisible ? 'text' : 'password',
      placeholder: '********',
      value: password,
      onInput: actions.onInput,
      onClickRight: actions.onClickRight
    }), PasswordOptions({
      page: 'signup'
    }));
  }
});

exports.default = _default;
},{"../../../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js","../../../../context":"../../src/module/context.js","../SignUp":"../../src/module/ui/pages/<SignUp>/SignUp.js"}],"../../src/module/ui/pages/<SignUp>/<>/Token.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("../../../../../../../../../libs/belt/src/index.js"));

var _context = require("../../../../context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <div style=", ">\n        <div>\n          <div style=", ">\n            ", "\n          </div>\n          <div style=", ">\n            ", "\n          </div>\n        </div>\n        ", "\n        ", "\n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _ui$components = _context.ui.components,
    Token = _ui$components.Token,
    NumKeyboard = _ui$components.NumKeyboard;

var _default = _context.ui.hoc({
  state: function state(props, store) {
    return {
      language: store.get('language'),
      tokenDigits: store.get('signup.tokenDigits')
    };
  },
  actions: function actions(props, store) {
    return {
      onPressNum: function onPressNum(digit) {
        if (store.get('signup.tokenDigits').length < 6) {
          store.set({
            'signup.tokenDigits': function signupTokenDigits(value) {
              return value.concat(String(digit));
            }
          });
        }
      },
      onPressDel: function onPressDel() {
        if (store.get('signup.tokenDigits').length > 0) {
          store.set({
            'signup.tokenDigits': function signupTokenDigits(value) {
              return value.slice(0, -1);
            }
          });
        }
      }
    };
  },
  styles: {
    wrapper: "\n      display: flex;\n      flex-flow: column;\n      height: 100%;\n      justify-content: space-around;\n    ",
    title: "\n      font-size: 28px;\n      padding: 20px 20px 10px 20px;\n    ",
    subtitle: "\n      font-size: 24px;\n      padding: 10px 20px 20px 20px;\n    "
  },
  render: function render(_ref) {
    var state = _ref.state,
        styles = _ref.styles,
        actions = _ref.actions;
    var language = state.language,
        tokenDigits = state.tokenDigits;
    var onPressNum = actions.onPressNum,
        onPressDel = actions.onPressDel;
    return _context.ui.html(_templateObject(), styles.wrapper, styles.title, _index.default.get({
      en: 'Excelent! Last step:',
      es: '¡Excelente! Último paso:'
    }, language), styles.subtitle, _index.default.get({
      en: 'Enter the code received by email',
      es: 'Ingresa el código recibido por email'
    }, language), Token({
      tokenDigits: tokenDigits
    }), NumKeyboard({
      onPressNum: onPressNum,
      onPressDel: onPressDel
    }));
  }
});

exports.default = _default;
},{"../../../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js","../../../../context":"../../src/module/context.js"}],"../../src/module/ui/pages/<SignUp>/SignUp.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SignupControl = void 0;

var _index = _interopRequireDefault(require("../../../../../../../../libs/belt/src/index.js"));

var _context = require("../../../context");

var _Name = _interopRequireDefault(require("./<>/Name"));

var _Email = _interopRequireDefault(require("./<>/Email"));

var _Password = _interopRequireDefault(require("./<>/Password"));

var _Token = _interopRequireDefault(require("./<>/Token"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <div id='sign-up' class=", ">\n        ", "\n        ", "\n        ", "\n        ", "\n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/* --------------------------------------------------------------------------------------------- */
var _ui$components = _context.ui.components,
    Navigation = _ui$components.Navigation,
    Carrousel = _ui$components.Carrousel;
var _ui$fragments = _context.ui.fragments,
    Header = _ui$fragments.Header,
    Tabs = _ui$fragments.Tabs;
var screens = [_Name.default, _Email.default, _Password.default, _Token.default];
var numSteps = screens.length;
/* --------------------------------------------------------------------------------------------- */

var SignupControl = function SignupControl(store) {
  var language = store.get('language');
  var currentStep = store.get('signup.currentStep');

  var currentCheck = _index.default.get({
    0: store.check('name', store.get('signup.name')),
    1: store.check('email', store.get('signup.email')),
    2: store.check('password', store.get('signup.password')),
    3: {
      result: store.get('signup.tokenDigits').length === 6
    }
  }, currentStep, {});

  var checkResult = _index.default.get(currentCheck, 'result', false);

  var alert = store.alerts.find(function (item) {
    return item.isVisible;
  });
  return {
    state: {
      currentStep: currentStep,
      leftEnabled: currentStep > 0,
      rightEnabled: checkResult,
      checkText: _index.default.get(currentCheck, "message.".concat(language), ''),
      alertText: _index.default.get(alert, "message.".concat(language), '')
    },
    actions: {
      onClickLeft: function onClickLeft() {
        // const currentStep = store.get('signup.currentStep');
        if (currentStep > 0) store.set({
          'signup.currentStep': currentStep - 1
        });
      },
      onClickRight: function onClickRight() {
        // const currentStep = store.get('signup.currentStep');
        if (currentStep === 0) store.set({
          'signup.currentStep': 1
        });
        if (currentStep === 1) store.call('signupEmail');
        if (currentStep === 2) store.call('signupPassword');
        if (currentStep === 3) store.call('signupToken');
      }
    }
  };
};
/* --------------------------------------------------------------------------------------------- */


exports.SignupControl = SignupControl;

var _default = _context.ui.hoc({
  state: function state(props, store) {
    return SignupControl(store).state;
  },
  actions: function actions(props, store) {
    return SignupControl(store).actions;
  },
  classes: {
    container: "\n      display: flex;\n      flex-flow: column;\n      justify-content: space-around;\n      height: 100%;\n      position: relative;\n    "
  },
  render: function render(_ref) {
    var state = _ref.state,
        actions = _ref.actions,
        classes = _ref.classes;
    var currentStep = state.currentStep,
        leftEnabled = state.leftEnabled,
        rightEnabled = state.rightEnabled,
        checkText = state.checkText,
        alertText = state.alertText;
    var onClickLeft = actions.onClickLeft,
        onClickRight = actions.onClickRight;
    return _context.ui.html(_templateObject(), classes.container, Header({
      numSteps: numSteps,
      currentStep: currentStep
    }), Carrousel({
      currentStep: currentStep,
      screens: screens
    }), Navigation({
      currentPage: 'signup',
      onClickLeft: onClickLeft,
      onClickRight: onClickRight,
      leftEnabled: leftEnabled,
      rightEnabled: rightEnabled,
      text: alertText || checkText,
      color: alertText ? _context.ui.lib.Colors.RED_WARNING : ''
    }), Tabs());
  }
});

exports.default = _default;
},{"../../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js","../../../context":"../../src/module/context.js","./<>/Name":"../../src/module/ui/pages/<SignUp>/<>/Name.js","./<>/Email":"../../src/module/ui/pages/<SignUp>/<>/Email.js","./<>/Password":"../../src/module/ui/pages/<SignUp>/<>/Password.js","./<>/Token":"../../src/module/ui/pages/<SignUp>/<>/Token.js"}],"../../src/module/ui/pages/<Welcome>/Welcome.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("../../../../../../../../libs/belt/src/index.js"));

var _context = require("../../../context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <div id='welcome' style=", ">\n        ", "\n        <div style=", ">\n          ", "\n        </div>\n        <div style=", ">\n          ", "\n        </div>\n        <div style=", ">\n          ", "\n        </div>\n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/* --------------------------------------------------------------------------------------------- */
var Button = _context.ui.components.Button;
var Header = _context.ui.fragments.Header;
/* --------------------------------------------------------------------------------------------- */

var _default = _context.ui.hoc({
  state: function state(props, store) {
    return {
      language: store.get('language')
    };
  },
  styles: {
    wrapper: "\n      display: flex;\n      flex-flow: column;\n      height: 100%;\n      justify-content: space-between;\n      align-items: center;\n      padding-bottom: 20%;\n    ",
    title: "\n      font-size: 28px;\n      padding: 20px 20px 10px 20px;\n    ",
    subtitle: "\n      font-size: 22px;\n      padding: 10px 20px 20px 20px;\n      color: hsl(0, 0%, 35%);\n    ",
    button: "\n      padding: 60px;\n      width: 100%;\n      font-size: 20px;\n    "
  },
  render: function render(_ref) {
    var state = _ref.state,
        styles = _ref.styles;
    var language = state.language;
    return _context.ui.html(_templateObject(), styles.wrapper, Header(), styles.title, _index.default.get({
      en: 'Welcome!',
      es: '¡Bienvenid@!'
    }, language), styles.subtitle, _index.default.get({
      en: 'You successfully registered your account',
      es: 'Has registrado exitosamente tu cuenta'
    }, language), styles.button, Button({
      text: _index.default.get({
        en: 'Go to my Dashboard',
        es: 'Ir a mi Dashboard'
      }, language),
      color: 'white',
      bgColor: 'mediumseagreen',
      height: 44,
      href: 'https://www.google.com'
    }));
  }
});

exports.default = _default;
},{"../../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js","../../../context":"../../src/module/context.js"}],"../../src/module/ui/pages/<Forgot>/<>/Email.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("../../../../../../../../../libs/belt/src/index.js"));

var _context = require("../../../../context");

var _Forgot = require("../Forgot");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <div style=", ">\n        <div>\n          <div style=", ">\n            ", "\n          </div>\n          <div style=", ">\n            ", "\n          </div>\n        </div>\n        ", "\n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Input = _context.ui.components.Input;

var _default = _context.ui.hoc({
  state: function state(props, store) {
    return {
      language: store.get('language'),
      email: store.get('forgot.email')
    };
  },
  actions: function actions(props, store) {
    return {
      onInput: function onInput(e) {
        var email = e.target.value;
        store.set({
          'signin.email': email,
          'forgot.email': email
        });
      },
      onClickRight: function onClickRight() {
        var _ForgotControl = (0, _Forgot.ForgotControl)(store),
            state = _ForgotControl.state,
            actions = _ForgotControl.actions;

        var enabled = state.rightEnabled;
        if (enabled) actions.onClickRight();
      }
    };
  },
  styles: {
    wrapper: "\n      display: flex;\n      flex-flow: column;\n      height: 100%;\n      justify-content: space-around;\n    ",
    title: "\n      font-size: 28px;\n      padding: 20px 20px 10px 20px;\n    ",
    subtitle: "\n      font-size: 24px;\n      padding: 10px 20px 20px 20px;\n    "
  },
  render: function render(_ref) {
    var actions = _ref.actions,
        state = _ref.state,
        styles = _ref.styles;
    var language = state.language;
    return _context.ui.html(_templateObject(), styles.wrapper, styles.title, _index.default.get({
      en: 'Password recovery',
      es: 'Recuperación de contraseña'
    }, language), styles.subtitle, _index.default.get({
      en: 'Enter your email',
      es: 'Ingresa tu email'
    }, language), Input({
      type: 'text',
      placeholder: _index.default.get({
        en: 'Your email',
        es: 'Tu email'
      }, language),
      value: state.email,
      onInput: actions.onInput,
      onClickRight: actions.onClickRight
    }));
  }
});

exports.default = _default;
},{"../../../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js","../../../../context":"../../src/module/context.js","../Forgot":"../../src/module/ui/pages/<Forgot>/Forgot.js"}],"../../src/module/ui/pages/<Forgot>/<>/Password.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("../../../../../../../../../libs/belt/src/index.js"));

var _context = require("../../../../context");

var _Forgot = require("../Forgot");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <div style=", ">\n        <div>\n          <div style=", ">\n            ", "\n          </div>\n          <div style=", ">\n            ", "\n          </div>\n        </div>\n        <div style=", ">\n          ", "\n          ", "\n        </div>\n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Input = _context.ui.components.Input;
var PasswordOptions = _context.ui.fragments.PasswordOptions;

var _default = _context.ui.hoc({
  state: function state(props, store) {
    return {
      language: store.get('language'),
      name: store.get('forgot.name').split(' ')[0],
      password: store.get('forgot.password'),
      isPasswordVisible: store.get('forgot.password.isVisible')
    };
  },
  actions: function actions(props, store) {
    return {
      onInput: function onInput(e) {
        store.set({
          'forgot.password': e.target.value
        });
      },
      onClickRight: function onClickRight() {
        var _ForgotControl = (0, _Forgot.ForgotControl)(store),
            state = _ForgotControl.state,
            actions = _ForgotControl.actions;

        var enabled = state.rightEnabled;
        if (enabled) actions.onClickRight();
      }
    };
  },
  styles: {
    wrapper: "\n      display: flex;\n      flex-flow: column;\n      height: 100%;\n      justify-content: space-around;\n    ",
    title: "\n      font-size: 28px;\n      padding: 20px 20px 10px 20px;\n    ",
    subtitle: "\n      font-size: 24px;\n      padding: 10px 20px 20px 20px;\n    ",
    'input-wrapper': "\n      display: flex;\n      flex-flow: column;\n    "
  },
  render: function render(_ref) {
    var state = _ref.state,
        styles = _ref.styles,
        actions = _ref.actions;
    var language = state.language,
        name = state.name,
        password = state.password;
    return _context.ui.html(_templateObject(), styles.wrapper, styles.title, _index.default.get({
      en: "Don't worry ".concat(name, "!"),
      es: "\xA1No te preocupes ".concat(name, "!")
    }, language), styles.subtitle, _index.default.get({
      en: 'Just type a new password',
      es: 'Sólo ingresa una nueva contraseña'
    }, language), styles['input-wrapper'], Input({
      type: state.isPasswordVisible ? 'text' : 'password',
      placeholder: '********',
      value: password,
      onInput: actions.onInput,
      onClickRight: actions.onClickRight
    }), PasswordOptions({
      page: 'forgot'
    }));
  }
});

exports.default = _default;
},{"../../../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js","../../../../context":"../../src/module/context.js","../Forgot":"../../src/module/ui/pages/<Forgot>/Forgot.js"}],"../../src/module/ui/pages/<Forgot>/<>/Token.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("../../../../../../../../../libs/belt/src/index.js"));

var _context = require("../../../../context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <div style=", ">\n        <div>\n          <div style=", ">\n            ", "\n          </div>\n          <div style=", ">\n            ", "\n          </div>\n        </div>\n        ", "\n        ", "\n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _ui$components = _context.ui.components,
    Token = _ui$components.Token,
    NumKeyboard = _ui$components.NumKeyboard;

var _default = _context.ui.hoc({
  state: function state(props, store) {
    return {
      language: store.get('language'),
      tokenDigits: store.get('forgot.tokenDigits')
    };
  },
  actions: function actions(props, store) {
    return {
      onPressNum: function onPressNum(digit) {
        if (store.get('forgot.tokenDigits').length < 6) {
          store.set({
            'forgot.tokenDigits': function forgotTokenDigits(value) {
              return value.concat(String(digit));
            }
          });
        }
      },
      onPressDel: function onPressDel() {
        if (store.get('forgot.tokenDigits').length > 0) {
          store.set({
            'forgot.tokenDigits': function forgotTokenDigits(value) {
              return value.slice(0, -1);
            }
          });
        }
      }
    };
  },
  styles: {
    wrapper: "\n      display: flex;\n      flex-flow: column;\n      height: 100%;\n      justify-content: space-around;\n    ",
    title: "\n      font-size: 28px;\n      padding: 20px 20px 10px 20px;\n    ",
    subtitle: "\n      font-size: 24px;\n      padding: 10px 20px 20px 20px;\n    "
  },
  render: function render(_ref) {
    var state = _ref.state,
        styles = _ref.styles,
        actions = _ref.actions;
    var language = state.language,
        tokenDigits = state.tokenDigits;
    var onPressNum = actions.onPressNum,
        onPressDel = actions.onPressDel;
    return _context.ui.html(_templateObject(), styles.wrapper, styles.title, _index.default.get({
      en: 'Let\'s change your password:',
      es: 'Vamos a cambiar tu contraseña:'
    }, language), styles.subtitle, _index.default.get({
      en: 'Enter the code received by email',
      es: 'Ingresa el código recibido por email'
    }, language), Token({
      tokenDigits: tokenDigits
    }), NumKeyboard({
      onPressNum: onPressNum,
      onPressDel: onPressDel
    }));
  }
});

exports.default = _default;
},{"../../../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js","../../../../context":"../../src/module/context.js"}],"../../src/module/ui/pages/<Forgot>/Forgot.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ForgotControl = void 0;

var _index = _interopRequireDefault(require("../../../../../../../../libs/belt/src/index.js"));

var _context = require("../../../context");

var _Email = _interopRequireDefault(require("./<>/Email"));

var _Password = _interopRequireDefault(require("./<>/Password"));

var _Token = _interopRequireDefault(require("./<>/Token"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <div id='sign-in' class=", ">\n        ", "\n        ", "\n        ", "\n        ", "\n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/* --------------------------------------------------------------------------------------------- */
var _ui$components = _context.ui.components,
    Carrousel = _ui$components.Carrousel,
    Navigation = _ui$components.Navigation;
var _ui$fragments = _context.ui.fragments,
    Header = _ui$fragments.Header,
    Tabs = _ui$fragments.Tabs;
var screens = [_Email.default, _Password.default, _Token.default];
var numSteps = screens.length;
/* --------------------------------------------------------------------------------------------- */

var ForgotControl = function ForgotControl(store) {
  var language = store.get('language');
  var currentStep = store.get('forgot.currentStep');

  var currentCheck = _index.default.get({
    0: store.check('email', store.get('signin.email')),
    1: store.check('password', store.get('forgot.password')),
    2: {
      result: store.get('forgot.tokenDigits').length === 6
    }
  }, currentStep, {});

  var checkResult = _index.default.get(currentCheck, 'result', false);

  var alert = store.alerts.find(function (item) {
    return item.isVisible;
  });
  return {
    state: {
      currentStep: currentStep,
      leftEnabled: currentStep > 0,
      rightEnabled: checkResult,
      checkText: _index.default.get(currentCheck, "message.".concat(language), ''),
      alertText: _index.default.get(alert, "message.".concat(language), '')
    },
    actions: {
      onClickLeft: function onClickLeft() {
        // const currentStep = store.get('forgot.currentStep');
        if (currentStep > 0) store.set({
          'forgot.currentStep': currentStep - 1
        });
      },
      onClickRight: function onClickRight() {
        // const currentStep = store.get('forgot.currentStep');
        if (currentStep === 0) store.call('forgotEmail');
        if (currentStep === 1) store.call('forgotPassword');
        if (currentStep === 2) store.call('forgotToken');
      }
    }
  };
};
/* --------------------------------------------------------------------------------------------- */


exports.ForgotControl = ForgotControl;

var _default = _context.ui.hoc({
  state: function state(props, store) {
    return ForgotControl(store).state;
  },
  actions: function actions(props, store) {
    return ForgotControl(store).actions;
  },
  classes: {
    container: "\n      display: flex;\n      flex-flow: column;\n      justify-content: space-around;\n      height: 100%;\n      position: relative;\n    "
  },
  render: function render(_ref) {
    var state = _ref.state,
        actions = _ref.actions,
        classes = _ref.classes;
    var currentStep = state.currentStep,
        leftEnabled = state.leftEnabled,
        rightEnabled = state.rightEnabled,
        checkText = state.checkText,
        alertText = state.alertText;
    var onClickLeft = actions.onClickLeft,
        onClickRight = actions.onClickRight;
    return _context.ui.html(_templateObject(), classes.container, Header({
      numSteps: numSteps,
      currentStep: currentStep
    }), Carrousel({
      currentStep: currentStep,
      screens: screens
    }), Navigation({
      currentPage: 'forgot',
      onClickLeft: onClickLeft,
      onClickRight: onClickRight,
      leftEnabled: leftEnabled,
      rightEnabled: rightEnabled,
      text: alertText || checkText,
      color: alertText ? _context.ui.lib.Colors.RED_WARNING : ''
    }), Tabs());
  }
});

exports.default = _default;
},{"../../../../../../../../libs/belt/src/index.js":"../../../../../libs/belt/src/index.js","../../../context":"../../src/module/context.js","./<>/Email":"../../src/module/ui/pages/<Forgot>/<>/Email.js","./<>/Password":"../../src/module/ui/pages/<Forgot>/<>/Password.js","./<>/Token":"../../src/module/ui/pages/<Forgot>/<>/Token.js"}],"../../src/module/ui/Container.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _context = require("../context");

var _SignIn = _interopRequireDefault(require("./pages/<SignIn>/SignIn"));

var _SignUp = _interopRequireDefault(require("./pages/<SignUp>/SignUp"));

var _Welcome = _interopRequireDefault(require("./pages/<Welcome>/Welcome"));

var _Forgot = _interopRequireDefault(require("./pages/<Forgot>/Forgot"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n      <div id='page-wrapper'>\n        ", "\n      </div>\n    "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/* --------------------------------------------------------------------------------------------- */
var _ui$components = _context.ui.components,
    Modal = _ui$components.Modal,
    NotFound = _ui$components.NotFound;

var _default = _context.ui.hoc({
  state: function state(props, store) {
    return {
      currentPage: store.get('currentPage') || props.router.currentPage
    };
  },
  render: function render(_ref) {
    var props = _ref.props,
        state = _ref.state;
    var pages = props.router.pages;
    var currentPage = state.currentPage;
    var findRoute = pages.includes(currentPage);
    if (!findRoute) return _context.ui.html(_templateObject(), NotFound());
    return _context.ui.html(_templateObject2(), Modal({
      currentPage: currentPage,
      pages: {
        signin: _SignIn.default,
        signup: _SignUp.default,
        welcome: _Welcome.default,
        forgot: _Forgot.default
      }
    }));
  }
});

exports.default = _default;
},{"../context":"../../src/module/context.js","./pages/<SignIn>/SignIn":"../../src/module/ui/pages/<SignIn>/SignIn.js","./pages/<SignUp>/SignUp":"../../src/module/ui/pages/<SignUp>/SignUp.js","./pages/<Welcome>/Welcome":"../../src/module/ui/pages/<Welcome>/Welcome.js","./pages/<Forgot>/Forgot":"../../src/module/ui/pages/<Forgot>/Forgot.js"}],"../../src/module/routes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = void 0;
var routes = {
  _root_: function _root_(props) {
    return require("./ui/Container").default(props);
  },
  signin: function signin(props) {
    return require("./ui/pages/<SignIn>/SignIn").default(props);
  },
  signup: function signup(props) {
    return require("./ui/pages/<SignUp>/SignUp").default(props);
  },
  welcome: function welcome(props) {
    return require("./ui/pages/<Welcome>/Welcome").default(props);
  },
  forgot: function forgot(props) {
    return require("./ui/pages/<Forgot>/Forgot").default(props);
  }
};
exports.routes = routes;
},{"./ui/Container":"../../src/module/ui/Container.js","./ui/pages/<SignIn>/SignIn":"../../src/module/ui/pages/<SignIn>/SignIn.js","./ui/pages/<SignUp>/SignUp":"../../src/module/ui/pages/<SignUp>/SignUp.js","./ui/pages/<Welcome>/Welcome":"../../src/module/ui/pages/<Welcome>/Welcome.js","./ui/pages/<Forgot>/Forgot":"../../src/module/ui/pages/<Forgot>/Forgot.js"}],"../../src/module/context.js":[function(require,module,exports) {
var process = require("process");
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ui = exports.Store = void 0;

var _index = _interopRequireDefault(require("../../../../../libs/ui/src/index.js"));

var _index2 = _interopRequireDefault(require("../../../../../libs/store/src/index.js"));

var _store = _interopRequireDefault(require("./store"));

var _components = _interopRequireDefault(require("./ui/components"));

var _fragments = _interopRequireDefault(require("./ui/fragments"));

var uiLib = _interopRequireWildcard(require("./ui/lib"));

var _routes = require("./routes");

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isBrowser = process.browser;
var isProduction = "development" === 'production'; // Framework

// Initialization
var uiFramework = (0, _index.default)(isBrowser); // Store is created and used to create hoc afterwards

var Store = (0, _index2.default)(_store.default, uiFramework.render);
exports.Store = Store;
if (isBrowser && !isProduction) window.Store = Store;
/*  ui is an object that has:  hoc, framework (html, repeat...) and lib for all kind of components  + (standard) components for fragments components  + (also) fragments components for pages components*/

var hoc = uiFramework.createHoc(Store);
var components = (0, _components.default)(_extends({
  hoc: hoc
}, uiFramework, {
  lib: uiLib
}));
var fragments = (0, _fragments.default)(_extends({
  hoc: hoc
}, uiFramework, {
  lib: uiLib,
  components: components
})); // Main (pages) hierarchy

var ui = {
  hoc: hoc,
  html: uiFramework.html,
  // for convenience can be accessed directly
  framework: uiFramework,
  lib: uiLib,
  components: components,
  fragments: fragments
}; // Start application: ConnectToServer, First Render, Service workers, ...

exports.ui = ui;
var _default = {
  start: function start() {
    window.onload = function () {
      Store.methods.startApp({
        appData: window.__APP_DATA__,
        routes: _routes.routes
      });
    };
  }
};
exports.default = _default;
},{"../../../../../libs/ui/src/index.js":"../../../../../libs/ui/src/index.js","../../../../../libs/store/src/index.js":"../../../../../libs/store/src/index.js","./store":"../../src/module/store/index.js","./ui/components":"../../src/module/ui/components/index.js","./ui/fragments":"../../src/module/ui/fragments/index.js","./ui/lib":"../../src/module/ui/lib/index.js","./routes":"../../src/module/routes.js","process":"../../../../../../../../../../usr/local/lib/node_modules/parcel/node_modules/process/browser.js"}],"app.js":[function(require,module,exports) {
"use strict";

var _context = _interopRequireDefault(require("../../src/module/context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_context.default.start();
},{"../../src/module/context":"../../src/module/context.js"}],"../../../../../../../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58201" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../../../../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.map