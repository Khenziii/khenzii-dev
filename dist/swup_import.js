// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
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

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
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
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"lK3q":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/** Keeps track of raw listeners added to the base elements to avoid duplication */
const ledger = new WeakMap();
function editLedger(wanted, baseElement, callback, setup) {
  if (!wanted && !ledger.has(baseElement)) {
    return false;
  }
  const elementMap = ledger.get(baseElement) ?? new WeakMap();
  ledger.set(baseElement, elementMap);
  const setups = elementMap.get(callback) ?? new Set();
  elementMap.set(callback, setups);
  const existed = setups.has(setup);
  if (wanted) {
    setups.add(setup);
  } else {
    setups.delete(setup);
  }
  return existed && wanted;
}
function safeClosest(event, selector) {
  let target = event.target;
  if (target instanceof Text) {
    target = target.parentElement;
  }
  if (target instanceof Element && event.currentTarget instanceof Element) {
    // `.closest()` may match ancestors of `currentTarget` but we only need its children
    const closest = target.closest(selector);
    if (closest && event.currentTarget.contains(closest)) {
      return closest;
    }
  }
}
// This type isn't exported as a declaration, so it needs to be duplicated above
function delegate(selector, type, callback, options = {}) {
  const {
    signal,
    base = document
  } = options;
  if (signal?.aborted) {
    return;
  }
  // Don't pass `once` to `addEventListener` because it needs to be handled in `delegate-it`
  const {
    once,
    ...nativeListenerOptions
  } = options;
  // `document` should never be the base, it's just an easy way to define "global event listeners"
  const baseElement = base instanceof Document ? base.documentElement : base;
  // Handle the regular Element usage
  const capture = Boolean(typeof options === 'object' ? options.capture : options);
  const listenerFn = event => {
    const delegateTarget = safeClosest(event, selector);
    if (delegateTarget) {
      const delegateEvent = Object.assign(event, {
        delegateTarget
      });
      callback.call(baseElement, delegateEvent);
      if (once) {
        baseElement.removeEventListener(type, listenerFn, nativeListenerOptions);
        editLedger(false, baseElement, callback, setup);
      }
    }
  };
  const setup = JSON.stringify({
    selector,
    type,
    capture
  });
  const isAlreadyListening = editLedger(true, baseElement, callback, setup);
  if (!isAlreadyListening) {
    baseElement.addEventListener(type, listenerFn, nativeListenerOptions);
  }
  signal?.addEventListener('abort', () => {
    editLedger(false, baseElement, callback, setup);
  });
}
var _default = delegate;
exports.default = _default;
},{}],"QQ46":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _delegate = _interopRequireDefault(require("./delegate.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// This type isn't exported as a declaration, so it needs to be duplicated above
async function oneEvent(selector, type, options = {}) {
  return new Promise(resolve => {
    options.once = true;
    if (options.signal?.aborted) {
      resolve(undefined);
    }
    options.signal?.addEventListener('abort', () => {
      resolve(undefined);
    });
    (0, _delegate.default)(selector, type,
    // @ts-expect-error Seems to work fine
    resolve, options);
  });
}
var _default = oneEvent;
exports.default = _default;
},{"./delegate.js":"lK3q"}],"Bnny":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  oneEvent: true
};
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _delegate.default;
  }
});
Object.defineProperty(exports, "oneEvent", {
  enumerable: true,
  get: function () {
    return _oneEvent.default;
  }
});
var _delegate = _interopRequireWildcard(require("./delegate.js"));
Object.keys(_delegate).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _delegate[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _delegate[key];
    }
  });
});
var _oneEvent = _interopRequireDefault(require("./one-event.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
},{"./delegate.js":"lK3q","./one-event.js":"QQ46"}],"bJP7":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compile = compile;
exports.match = match;
exports.parse = parse;
exports.pathToRegexp = pathToRegexp;
exports.regexpToFunction = regexpToFunction;
exports.tokensToFunction = tokensToFunction;
exports.tokensToRegexp = tokensToRegexp;
/**
 * Tokenize input string.
 */
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({
        type: "MODIFIER",
        index: i,
        value: str[i++]
      });
      continue;
    }
    if (char === "\\") {
      tokens.push({
        type: "ESCAPED_CHAR",
        index: i++,
        value: str[i++]
      });
      continue;
    }
    if (char === "{") {
      tokens.push({
        type: "OPEN",
        index: i,
        value: str[i++]
      });
      continue;
    }
    if (char === "}") {
      tokens.push({
        type: "CLOSE",
        index: i,
        value: str[i++]
      });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
        // `0-9`
        code >= 48 && code <= 57 ||
        // `A-Z`
        code >= 65 && code <= 90 ||
        // `a-z`
        code >= 97 && code <= 122 ||
        // `_`
        code === 95) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name) throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({
        type: "NAME",
        index: i,
        value: name
      });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError("Pattern cannot start with \"?\" at ".concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count) throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern) throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({
        type: "PATTERN",
        index: i,
        value: pattern
      });
      i = j;
      continue;
    }
    tokens.push({
      type: "CHAR",
      index: i,
      value: str[i++]
    });
  }
  tokens.push({
    type: "END",
    index: i,
    value: ""
  });
  return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes,
    prefixes = _a === void 0 ? "./" : _a;
  var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = function (type) {
    if (i < tokens.length && tokens[i].type === type) return tokens[i++].value;
  };
  var mustConsume = function (type) {
    var value = tryConsume(type);
    if (value !== undefined) return value;
    var _a = tokens[i],
      nextType = _a.type,
      index = _a.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function () {
    var result = "";
    var value;
    while (value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result += value;
    }
    return result;
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix: prefix,
        suffix: "",
        pattern: pattern || defaultPattern,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
        prefix: prefix,
        suffix: suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
/**
 * Compile a string to a template function for the path.
 */
function compile(str, options) {
  return tokensToFunction(parse(str, options), options);
}
/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode,
    encode = _a === void 0 ? function (x) {
      return x;
    } : _a,
    _b = options.validate,
    validate = _b === void 0 ? true : _b;
  // Compile all the tokens into regexps.
  var matches = tokens.map(function (token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function (data) {
    var path = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path += token;
        continue;
      }
      var value = data ? data[token.name] : undefined;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError("Expected \"".concat(token.name, "\" to not repeat, but got an array"));
        }
        if (value.length === 0) {
          if (optional) continue;
          throw new TypeError("Expected \"".concat(token.name, "\" to not be empty"));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError("Expected all \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
          }
          path += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError("Expected \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
        }
        path += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional) continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError("Expected \"".concat(token.name, "\" to be ").concat(typeOfMessage));
    }
    return path;
  };
}
/**
 * Create path match function from `path-to-regexp` spec.
 */
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
/**
 * Create a path match function from `path-to-regexp` output.
 */
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode,
    decode = _a === void 0 ? function (x) {
      return x;
    } : _a;
  return function (pathname) {
    var m = re.exec(pathname);
    if (!m) return false;
    var path = m[0],
      index = m.index;
    var params = Object.create(null);
    var _loop_1 = function (i) {
      if (m[i] === undefined) return "continue";
      var key = keys[i - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i].split(key.prefix + key.suffix).map(function (value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return {
      path: path,
      index: index,
      params: params
    };
  };
}
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
/**
 * Pull out keys from a regexp.
 */
function regexpToRegexp(path, keys) {
  if (!keys) return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
/**
 * Transform an array into a regexp.
 */
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function (path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
/**
 * Create a path regexp from string input.
 */
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
/**
 * Expose a function for taking tokens and returning a RegExp.
 */
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict,
    strict = _a === void 0 ? false : _a,
    _b = options.start,
    start = _b === void 0 ? true : _b,
    _c = options.end,
    end = _c === void 0 ? true : _c,
    _d = options.encode,
    encode = _d === void 0 ? function (x) {
      return x;
    } : _d,
    _e = options.delimiter,
    delimiter = _e === void 0 ? "/#?" : _e,
    _f = options.endsWith,
    endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  // Iterate over the tokens and create our regexp string.
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys) keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            route += "((?:".concat(token.pattern, ")").concat(token.modifier, ")");
          } else {
            route += "(".concat(token.pattern, ")").concat(token.modifier);
          }
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict) route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === undefined;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 */
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp) return regexpToRegexp(path, keys);
  if (Array.isArray(path)) return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
},{}],"Gk8X":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escapeCssIdentifier = exports.delegateEvent = exports.default = exports.createHistoryRecord = exports.classify = exports.Location = void 0;
exports.forceReflow = f;
exports.getCurrentUrl = void 0;
exports.isPromise = m;
exports.queryAll = exports.query = exports.nextTick = exports.matchPath = void 0;
exports.runAsPromise = p;
exports.updateHistoryRecord = exports.toMs = void 0;
var _delegateIt = _interopRequireDefault(require("delegate-it"));
var _pathToRegexp = require("path-to-regexp");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e7) { throw _e7; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e8) { didErr = true; err = _e8; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var n = function n(t, e) {
    return String(t).toLowerCase().replace(/[\s/_.]+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+|-+$/g, "") || e || "";
  },
  r = function r(t) {
    var _ref = void 0 === t ? {} : t,
      e = _ref.hash;
    return location.pathname + location.search + (e ? location.hash : "");
  },
  o = function o(t, e) {
    void 0 === e && (e = {});
    var n = _objectSpread({
      url: t = t || r({
        hash: !0
      }),
      random: Math.random(),
      source: "swup"
    }, e);
    history.pushState(n, "", t);
  },
  i = function i(t, e) {
    void 0 === t && (t = null), void 0 === e && (e = {}), t = t || r({
      hash: !0
    });
    var n = _objectSpread(_objectSpread({}, history.state || {}), {}, {
      url: t,
      random: Math.random(),
      source: "swup"
    }, e);
    history.replaceState(n, "", t);
  },
  s = function s(e, n, r, o) {
    var i = new AbortController();
    return o = _objectSpread(_objectSpread({}, o), {}, {
      signal: i.signal
    }), (0, _delegateIt.default)(e, n, r, o), {
      destroy: function destroy() {
        return i.abort();
      }
    };
  };
exports.delegateEvent = s;
exports.updateHistoryRecord = i;
exports.createHistoryRecord = o;
exports.getCurrentUrl = r;
exports.classify = n;
var a = /*#__PURE__*/function (_URL) {
  _inherits(a, _URL);
  var _super = _createSuper(a);
  function a(t, e) {
    var _this;
    _classCallCheck(this, a);
    void 0 === e && (e = document.baseURI), _this = _super.call(this, t.toString(), e);
    return _this;
  }
  _createClass(a, [{
    key: "url",
    get: function get() {
      return this.pathname + this.search;
    }
  }], [{
    key: "fromElement",
    value: function fromElement(t) {
      var e = t.getAttribute("href") || t.getAttribute("xlink:href") || "";
      return new a(e);
    }
  }, {
    key: "fromUrl",
    value: function fromUrl(t) {
      return new a(t);
    }
  }]);
  return a;
}( /*#__PURE__*/_wrapNativeSuper(URL));
exports.Location = a;
var c = function c(t, n) {
  try {
    return (0, _pathToRegexp.match)(t, n);
  } catch (e) {
    throw new Error("[swup] Error parsing path \"".concat(String(t), "\":\n").concat(String(e)));
  }
};
exports.matchPath = c;
var l = /*#__PURE__*/function () {
  function l(t) {
    _classCallCheck(this, l);
    this.swup = void 0, this.pages = new Map(), this.swup = t;
  }
  _createClass(l, [{
    key: "size",
    get: function get() {
      return this.pages.size;
    }
  }, {
    key: "all",
    get: function get() {
      var t = new Map();
      return this.pages.forEach(function (e, n) {
        t.set(n, _objectSpread({}, e));
      }), t;
    }
  }, {
    key: "has",
    value: function has(t) {
      return this.pages.has(this.resolve(t));
    }
  }, {
    key: "get",
    value: function get(t) {
      var e = this.pages.get(this.resolve(t));
      return e ? _objectSpread({}, e) : e;
    }
  }, {
    key: "set",
    value: function set(t, e) {
      t = this.resolve(t), e = _objectSpread(_objectSpread({}, e), {}, {
        url: t
      }), this.pages.set(t, e), this.swup.hooks.callSync("cache:set", {
        page: e
      });
    }
  }, {
    key: "update",
    value: function update(t, e) {
      t = this.resolve(t);
      var n = _objectSpread(_objectSpread(_objectSpread({}, this.get(t)), e), {}, {
        url: t
      });
      this.pages.set(t, n);
    }
  }, {
    key: "delete",
    value: function _delete(t) {
      this.pages.delete(this.resolve(t));
    }
  }, {
    key: "clear",
    value: function clear() {
      this.pages.clear(), this.swup.hooks.callSync("cache:clear", void 0);
    }
  }, {
    key: "prune",
    value: function prune(t) {
      var _this2 = this;
      this.pages.forEach(function (e, n) {
        t(n, e) && _this2.delete(n);
      });
    }
  }, {
    key: "resolve",
    value: function resolve(t) {
      var _a$fromUrl = a.fromUrl(t),
        e = _a$fromUrl.url;
      return this.swup.resolveUrl(e);
    }
  }]);
  return l;
}();
var h = function h(t, e) {
    return void 0 === e && (e = document), e.querySelector(t);
  },
  u = function u(t, e) {
    return void 0 === e && (e = document), Array.from(e.querySelectorAll(t));
  },
  d = function d() {
    return new Promise(function (t) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          t();
        });
      });
    });
  };
exports.nextTick = d;
exports.queryAll = u;
exports.query = h;
function m(t) {
  return !!t && ("object" == _typeof(t) || "function" == typeof t) && "function" == typeof t.then;
}
function p(t, e) {
  return void 0 === e && (e = []), new Promise(function (n, r) {
    var o = t.apply(void 0, _toConsumableArray(e));
    m(o) ? o.then(n, r) : n(o);
  });
}
function f(t) {
  var _t;
  return t = t || document.body, (_t = t) === null || _t === void 0 ? void 0 : _t.offsetHeight;
}
var v = function v(t) {
    return window.CSS && window.CSS.escape ? CSS.escape(t) : t;
  },
  g = function g(t) {
    return 1e3 * Number(t.slice(0, -1).replace(",", "."));
  };
exports.toMs = g;
exports.escapeCssIdentifier = v;
var w = /*#__PURE__*/function () {
  function w(t) {
    _classCallCheck(this, w);
    this.swup = void 0, this.swupClasses = ["to-", "is-changing", "is-rendering", "is-popstate", "is-animating"], this.swup = t;
  }
  _createClass(w, [{
    key: "selectors",
    get: function get() {
      var t = this.swup.visit.animation.scope;
      return "containers" === t ? this.swup.visit.containers : "html" === t ? ["html"] : Array.isArray(t) ? t : [];
    }
  }, {
    key: "selector",
    get: function get() {
      return this.selectors.join(",");
    }
  }, {
    key: "targets",
    get: function get() {
      return this.selector.trim() ? u(this.selector) : [];
    }
  }, {
    key: "add",
    value: function add() {
      var _arguments = arguments;
      this.targets.forEach(function (t) {
        var _t$classList;
        return (_t$classList = t.classList).add.apply(_t$classList, _toConsumableArray([].slice.call(_arguments)));
      });
    }
  }, {
    key: "remove",
    value: function remove() {
      var _arguments2 = arguments;
      this.targets.forEach(function (t) {
        var _t$classList2;
        return (_t$classList2 = t.classList).remove.apply(_t$classList2, _toConsumableArray([].slice.call(_arguments2)));
      });
    }
  }, {
    key: "clear",
    value: function clear() {
      var _this3 = this;
      this.targets.forEach(function (t) {
        var _t$classList3;
        var e = t.className.split(" ").filter(function (t) {
          return _this3.isSwupClass(t);
        });
        (_t$classList3 = t.classList).remove.apply(_t$classList3, _toConsumableArray(e));
      });
    }
  }, {
    key: "isSwupClass",
    value: function isSwupClass(t) {
      return this.swupClasses.some(function (e) {
        return t.startsWith(e);
      });
    }
  }]);
  return w;
}();
function y(t) {
  var e = t.to,
    _t$from = t.from,
    n = _t$from === void 0 ? this.currentPageUrl : _t$from,
    r = t.hash,
    o = t.el,
    i = t.event;
  return {
    id: Math.random(),
    from: {
      url: n
    },
    to: {
      url: e,
      hash: r
    },
    containers: this.options.containers,
    animation: {
      animate: !0,
      wait: !1,
      name: void 0,
      scope: this.options.animationScope,
      selector: this.options.animationSelector
    },
    trigger: {
      el: o,
      event: i
    },
    cache: {
      read: this.options.cache,
      write: this.options.cache
    },
    history: {
      action: "push",
      popstate: !1,
      direction: void 0
    },
    scroll: {
      reset: !0,
      target: void 0
    }
  };
}
var P = "undefined" != typeof Symbol ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
function k(t, e, n) {
  if (!t.s) {
    if (n instanceof S) {
      if (!n.s) return void (n.o = k.bind(null, t, e));
      1 & e && (e = n.s), n = n.v;
    }
    if (n && n.then) return void n.then(k.bind(null, t, e), k.bind(null, t, 2));
    t.s = e, t.v = n;
    var _r = t.o;
    _r && _r(t);
  }
}
var S = /*#__PURE__*/function () {
  function t() {}
  return t.prototype.then = function (e, n) {
    var r = new t(),
      o = this.s;
    if (o) {
      var _t2 = 1 & o ? e : n;
      if (_t2) {
        try {
          k(r, 1, _t2(this.v));
        } catch (t) {
          k(r, 2, t);
        }
        return r;
      }
      return this;
    }
    return this.o = function (t) {
      try {
        var _o = t.v;
        1 & t.s ? k(r, 1, e ? e(_o) : _o) : n ? k(r, 1, n(_o)) : k(r, 2, _o);
      } catch (t) {
        k(r, 2, t);
      }
    }, r;
  }, t;
}();
function b(t) {
  return t instanceof S && 1 & t.s;
}
var E = /*#__PURE__*/function () {
  function E(t) {
    _classCallCheck(this, E);
    this.swup = void 0, this.registry = new Map(), this.hooks = ["animation:out:start", "animation:out:await", "animation:out:end", "animation:in:start", "animation:in:await", "animation:in:end", "animation:skip", "cache:clear", "cache:set", "content:replace", "content:scroll", "enable", "disable", "fetch:request", "fetch:error", "history:popstate", "link:click", "link:self", "link:anchor", "link:newtab", "page:load", "page:view", "scroll:top", "scroll:anchor", "visit:start", "visit:end"], this.swup = t, this.init();
  }
  _createClass(E, [{
    key: "init",
    value: function init() {
      var _this4 = this;
      this.hooks.forEach(function (t) {
        return _this4.create(t);
      });
    }
  }, {
    key: "create",
    value: function create(t) {
      this.registry.has(t) || this.registry.set(t, new Map());
    }
  }, {
    key: "exists",
    value: function exists(t) {
      return this.registry.has(t);
    }
  }, {
    key: "get",
    value: function get(t) {
      var e = this.registry.get(t);
      if (e) return e;
      console.error("Unknown hook '".concat(t, "'"));
    }
  }, {
    key: "clear",
    value: function clear() {
      this.registry.forEach(function (t) {
        return t.clear();
      });
    }
  }, {
    key: "on",
    value: function on(t, e, n) {
      var _this5 = this;
      void 0 === n && (n = {});
      var r = this.get(t);
      if (!r) return console.warn("Hook '".concat(t, "' not found.")), function () {};
      var o = r.size + 1,
        i = _objectSpread(_objectSpread({}, n), {}, {
          id: o,
          hook: t,
          handler: e
        });
      return r.set(e, i), function () {
        return _this5.off(t, e);
      };
    }
  }, {
    key: "before",
    value: function before(t, e, n) {
      return void 0 === n && (n = {}), this.on(t, e, _objectSpread(_objectSpread({}, n), {}, {
        before: !0
      }));
    }
  }, {
    key: "replace",
    value: function replace(t, e, n) {
      return void 0 === n && (n = {}), this.on(t, e, _objectSpread(_objectSpread({}, n), {}, {
        replace: !0
      }));
    }
  }, {
    key: "once",
    value: function once(t, e, n) {
      return void 0 === n && (n = {}), this.on(t, e, _objectSpread(_objectSpread({}, n), {}, {
        once: !0
      }));
    }
  }, {
    key: "off",
    value: function off(t, e) {
      var n = this.get(t);
      n && e ? n.delete(e) || console.warn("Handler for hook '".concat(t, "' not found.")) : n && n.clear();
    }
  }, {
    key: "call",
    value: function call(t, e, n) {
      try {
        var _r2 = this,
          _r$getHandlers = _r2.getHandlers(t, n),
          _o2 = _r$getHandlers.before,
          _i = _r$getHandlers.handler,
          _s = _r$getHandlers.after;
        return Promise.resolve(_r2.run(_o2, e)).then(function () {
          return Promise.resolve(_r2.run(_i, e)).then(function (n) {
            var _n = _slicedToArray(n, 1),
              o = _n[0];
            return Promise.resolve(_r2.run(_s, e)).then(function () {
              return _r2.dispatchDomEvent(t, e), o;
            });
          });
        });
      } catch (t) {
        return Promise.reject(t);
      }
    }
  }, {
    key: "callSync",
    value: function callSync(t, e, n) {
      var _this$getHandlers = this.getHandlers(t, n),
        r = _this$getHandlers.before,
        o = _this$getHandlers.handler,
        i = _this$getHandlers.after;
      this.runSync(r, e);
      var _this$runSync = this.runSync(o, e),
        _this$runSync2 = _slicedToArray(_this$runSync, 1),
        s = _this$runSync2[0];
      return this.runSync(i, e), this.dispatchDomEvent(t, e), s;
    }
  }, {
    key: "run",
    value: function run(t, e) {
      try {
        var _n2 = this,
          _r3 = [],
          _o3 = function (t, e, n) {
            if ("function" == typeof t[P]) {
              var r,
                o,
                i,
                s = t[P]();
              if (function t(n) {
                try {
                  for (; !(r = s.next()).done;) if ((n = e(r.value)) && n.then) {
                    if (!b(n)) return void n.then(t, i || (i = k.bind(null, o = new S(), 2)));
                    n = n.v;
                  }
                  o ? k(o, 1, n) : o = n;
                } catch (t) {
                  k(o || (o = new S()), 2, t);
                }
              }(), s.return) {
                var a = function a(t) {
                  try {
                    r.done || s.return();
                  } catch (t) {}
                  return t;
                };
                if (o && o.then) return o.then(a, function (t) {
                  throw a(t);
                });
                a();
              }
              return o;
            }
            if (!("length" in t)) throw new TypeError("Object is not iterable");
            for (var c = [], l = 0; l < t.length; l++) c.push(t[l]);
            return function (t, e, n) {
              var r,
                o,
                i = -1;
              return function n(s) {
                try {
                  for (; ++i < t.length;) if ((s = e(i)) && s.then) {
                    if (!b(s)) return void s.then(n, o || (o = k.bind(null, r = new S(), 2)));
                    s = s.v;
                  }
                  r ? k(r, 1, s) : r = s;
                } catch (t) {
                  k(r || (r = new S()), 2, t);
                }
              }(), r;
            }(c, function (t) {
              return e(c[t]);
            });
          }(t, function (t) {
            var o = t.hook,
              i = t.handler,
              s = t.defaultHandler,
              a = t.once;
            return Promise.resolve(p(i, [_n2.swup.visit, e, s])).then(function (t) {
              _r3.push(t), a && _n2.off(o, i);
            });
          });
        return Promise.resolve(_o3 && _o3.then ? _o3.then(function () {
          return _r3;
        }) : _r3);
      } catch (t) {
        return Promise.reject(t);
      }
    }
  }, {
    key: "runSync",
    value: function runSync(t, e) {
      var n = [];
      var _iterator = _createForOfIteratorHelper(t),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _step.value,
            _r4 = _step$value.hook,
            _o4 = _step$value.handler,
            _i2 = _step$value.defaultHandler,
            _s2 = _step$value.once;
          var _t3 = _o4(this.swup.visit, e, _i2);
          n.push(_t3), m(_t3) && console.warn("Promise returned from handler for synchronous hook '".concat(_r4, "'.Swup will not wait for it to resolve.")), _s2 && this.off(_r4, _o4);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return n;
    }
  }, {
    key: "getHandlers",
    value: function getHandlers(t, e) {
      var n = this.get(t);
      if (!n) return {
        found: !1,
        before: [],
        handler: [],
        after: [],
        replaced: !1
      };
      var r = Array.from(n.values()),
        o = this.sortRegistrations,
        i = r.filter(function (t) {
          var e = t.before,
            n = t.replace;
          return e && !n;
        }).sort(o),
        s = r.filter(function (t) {
          var e = t.replace;
          return e;
        }).filter(function (t) {
          return !0;
        }).sort(o),
        a = r.filter(function (t) {
          var e = t.before,
            n = t.replace;
          return !e && !n;
        }).sort(o),
        c = s.length > 0;
      var l = [];
      if (e && (l = [{
        id: 0,
        hook: t,
        handler: e
      }], c)) {
        var _n3 = s.length - 1,
          _r5 = function _r5(t) {
            var n = s[t - 1];
            return n ? function (e, o) {
              return n.handler(e, o, _r5(t - 1));
            } : e;
          };
        l = [{
          id: 0,
          hook: t,
          handler: s[_n3].handler,
          defaultHandler: _r5(_n3)
        }];
      }
      return {
        found: !0,
        before: i,
        handler: l,
        after: a,
        replaced: c
      };
    }
  }, {
    key: "sortRegistrations",
    value: function sortRegistrations(t, e) {
      var _t$priority, _e$priority;
      return ((_t$priority = t.priority) !== null && _t$priority !== void 0 ? _t$priority : 0) - ((_e$priority = e.priority) !== null && _e$priority !== void 0 ? _e$priority : 0) || t.id - e.id || 0;
    }
  }, {
    key: "dispatchDomEvent",
    value: function dispatchDomEvent(t, e) {
      document.dispatchEvent(new CustomEvent("swup:".concat(t), {
        detail: {
          hook: t,
          args: e,
          visit: this.swup.visit
        }
      }));
    }
  }]);
  return E;
}();
var U = function U(t) {
    if (t && "#" === t.charAt(0) && (t = t.substring(1)), !t) return null;
    var e = decodeURIComponent(t);
    var n = document.getElementById(t) || document.getElementById(e) || h("a[name='".concat(v(t), "']")) || h("a[name='".concat(v(e), "']"));
    return n || "top" !== t || (n = document.body), n;
  },
  C = function C(t) {
    var e = t.elements,
      n = t.selector;
    try {
      if (!1 === n && !e) return Promise.resolve();
      var _t4 = [];
      if (e) _t4 = Array.from(e);else if (n && (_t4 = u(n, document.body), !_t4.length)) return console.warn("[swup] No elements found matching animationSelector `".concat(n, "`")), Promise.resolve();
      var _r6 = _t4.map(function (t) {
        return function (t) {
          var _ref2 = function (t, e) {
              var n = window.getComputedStyle(t),
                r = H(n, "".concat(x, "Delay")),
                o = H(n, "".concat(x, "Duration")),
                i = A(r, o),
                s = H(n, "".concat($, "Delay")),
                a = H(n, "".concat($, "Duration")),
                c = A(s, a);
              var l = null,
                h = 0,
                u = 0;
              return e === x ? i > 0 && (l = x, h = i, u = o.length) : e === $ ? c > 0 && (l = $, h = c, u = a.length) : (h = Math.max(i, c), l = h > 0 ? i > c ? x : $ : null, u = l ? l === x ? o.length : a.length : 0), {
                type: l,
                timeout: h,
                propCount: u
              };
            }(t),
            e = _ref2.type,
            n = _ref2.timeout,
            r = _ref2.propCount;
          return !(!e || !n) && new Promise(function (o) {
            var i = "".concat(e, "end"),
              s = performance.now();
            var a = 0;
            var c = function c() {
                t.removeEventListener(i, l), o();
              },
              l = function l(e) {
                if (e.target === t) {
                  if (!function (t) {
                    return ["".concat(x, "end"), "".concat($, "end")].includes(t.type);
                  }(e)) throw new Error("Not a transition or animation event.");
                  (performance.now() - s) / 1e3 < e.elapsedTime || ++a >= r && c();
                }
              };
            setTimeout(function () {
              a < r && c();
            }, n + 1), t.addEventListener(i, l);
          });
        }(t);
      });
      return _r6.filter(Boolean).length > 0 ? Promise.resolve(Promise.all(_r6)).then(function () {}) : (n && console.warn("[swup] No CSS animation duration defined on elements matching `".concat(n, "`")), Promise.resolve());
    } catch (t) {
      return Promise.reject(t);
    }
  },
  x = "transition",
  $ = "animation";
function H(t, e) {
  return (t[e] || "").split(", ");
}
function A(t, e) {
  for (; t.length < e.length;) t = t.concat(t);
  return Math.max.apply(Math, _toConsumableArray(e.map(function (e, n) {
    return g(e) + g(t[n]);
  })));
}
var I = function I(t) {
  void 0 === t && (t = {});
  try {
    var _t$cache$read, _t$cache$write;
    var _e = this,
      _n4 = _e.visit,
      _s3 = _n4.trigger.el;
    t.referrer = t.referrer || _e.currentPageUrl, !1 === t.animate && (_n4.animation.animate = !1), _n4.animation.animate || _e.classes.clear();
    var _a = t.history || (_s3 === null || _s3 === void 0 ? void 0 : _s3.getAttribute("data-swup-history")) || void 0;
    _a && ["push", "replace"].includes(_a) && (_n4.history.action = _a);
    var _c = t.animation || (_s3 === null || _s3 === void 0 ? void 0 : _s3.getAttribute("data-swup-animation")) || void 0;
    return _c && (_n4.animation.name = _c), "object" == _typeof(t.cache) ? (_n4.cache.read = (_t$cache$read = t.cache.read) !== null && _t$cache$read !== void 0 ? _t$cache$read : _n4.cache.read, _n4.cache.write = (_t$cache$write = t.cache.write) !== null && _t$cache$write !== void 0 ? _t$cache$write : _n4.cache.write) : void 0 !== t.cache && (_n4.cache = {
      read: !!t.cache,
      write: !!t.cache
    }), delete t.cache, Promise.resolve(function (s, a) {
      try {
        var c = Promise.resolve(_e.hooks.call("visit:start", void 0)).then(function () {
          function s() {
            var t = _e.animatePageOut();
            return Promise.resolve(Promise.all([a, t])).then(function (t) {
              var _t5 = _slicedToArray(t, 1),
                r = _t5[0];
              if (_n4.id === _e.visit.id) return Promise.resolve(_e.renderPage(r)).then(function () {
                return Promise.resolve(_e.animatePageIn()).then(function () {
                  return Promise.resolve(_e.hooks.call("visit:end", void 0, function () {
                    return _e.classes.clear();
                  })).then(function () {});
                });
              });
            });
          }
          var a = _e.hooks.call("page:load", {
            options: t
          }, function (t, n) {
            try {
              function r(t) {
                return n.page = t, n.cache = !!_o5, n.page;
              }
              var _o5;
              return t.cache.read && (_o5 = _e.cache.get(t.to.url)), Promise.resolve(_o5 ? r(_o5) : Promise.resolve(_e.fetchPage(t.to.url, n.options)).then(r));
            } catch (i) {
              return Promise.reject(i);
            }
          });
          if (!_n4.history.popstate) {
            var _t6 = _n4.to.url + _n4.to.hash;
            "replace" === _n4.history.action || _n4.to.url === _e.currentPageUrl ? i(_t6) : (_e.currentHistoryIndex++, o(_t6, {
              index: _e.currentHistoryIndex
            }));
          }
          _e.currentPageUrl = r();
          var c = function () {
            if (_n4.animation.wait) return Promise.resolve(a).then(function (t) {
              var e = t.html;
              _n4.to.html = e;
            });
          }();
          return c && c.then ? c.then(s) : s();
        });
      } catch (t) {
        return a(t);
      }
      return c && c.then ? c.then(void 0, a) : c;
    }(0, function (t) {
      t && (console.error(t), _e.options.skipPopStateHandling = function () {
        return window.location.href = _n4.to.url + _n4.to.hash, !0;
      }, window.history.go(-1));
    }));
  } catch (t) {
    return Promise.reject(t);
  }
};
function j(t, e, n) {
  if (void 0 === e && (e = {}), void 0 === n && (n = {}), "string" != typeof t) throw new Error("swup.navigate() requires a URL parameter");
  if (this.shouldIgnoreVisit(t, {
    el: n.el,
    event: n.event
  })) return void (window.location.href = t);
  var _a$fromUrl2 = a.fromUrl(t),
    r = _a$fromUrl2.url,
    o = _a$fromUrl2.hash;
  this.visit = this.createVisit(_objectSpread(_objectSpread({}, n), {}, {
    to: r,
    hash: o
  })), this.performNavigation(e);
}
var q = function q(t, e) {
  void 0 === e && (e = {});
  try {
    var _n5 = this;
    t = a.fromUrl(t).url;
    var _r7 = _objectSpread(_objectSpread({}, _n5.options.requestHeaders), e.headers);
    return e = _objectSpread(_objectSpread({}, e), {}, {
      headers: _r7
    }), Promise.resolve(_n5.hooks.call("fetch:request", {
      url: t,
      options: e
    }, function (t, e) {
      var n = e.url,
        r = e.options;
      return fetch(n, r);
    })).then(function (r) {
      var o = r.status,
        i = r.url;
      return Promise.resolve(r.text()).then(function (s) {
        if (500 === o) throw _n5.hooks.call("fetch:error", {
          status: o,
          response: r,
          url: i
        }), new L("Server error: ".concat(i), {
          status: o,
          url: i
        });
        if (!s) throw new L("Empty response: ".concat(i), {
          status: o,
          url: i
        });
        var _a$fromUrl3 = a.fromUrl(i),
          c = _a$fromUrl3.url,
          l = {
            url: c,
            html: s
          };
        return !_n5.visit.cache.write || e.method && "GET" !== e.method || t !== c || _n5.cache.set(l.url, l), l;
      });
    });
  } catch (t) {
    return Promise.reject(t);
  }
};
var L = /*#__PURE__*/function (_Error) {
  _inherits(L, _Error);
  var _super2 = _createSuper(L);
  function L(t, e) {
    var _this6;
    _classCallCheck(this, L);
    _this6 = _super2.call(this, t), _this6.url = void 0, _this6.status = void 0, _this6.name = "FetchError", _this6.url = e.url, _this6.status = e.status;
    return _this6;
  }
  return _createClass(L);
}( /*#__PURE__*/_wrapNativeSuper(Error));
var R = function R() {
    try {
      var _e2;
      var _r8 = this;
      function t(t) {
        return _e2 ? t : Promise.resolve(_r8.hooks.call("animation:out:start", void 0, function (t) {
          _r8.classes.add("is-changing", "is-leaving", "is-animating"), t.history.popstate && _r8.classes.add("is-popstate"), t.animation.name && _r8.classes.add("to-".concat(n(t.animation.name)));
        })).then(function () {
          return Promise.resolve(_r8.hooks.call("animation:out:await", {
            skip: !1
          }, function (t, e) {
            var n = e.skip;
            try {
              return n ? Promise.resolve() : Promise.resolve(_r8.awaitAnimations({
                selector: t.animation.selector
              })).then(function () {});
            } catch (t) {
              return Promise.reject(t);
            }
          })).then(function () {
            return Promise.resolve(_r8.hooks.call("animation:out:end", void 0)).then(function () {});
          });
        });
      }
      var _o6 = function () {
        if (!_r8.visit.animation.animate) return Promise.resolve(_r8.hooks.call("animation:skip", void 0)).then(function () {
          _e2 = 1;
        });
      }();
      return Promise.resolve(_o6 && _o6.then ? _o6.then(t) : t(_o6));
    } catch (i) {
      return Promise.reject(i);
    }
  },
  N = function N(t, e) {
    var _o$querySelector;
    var n = t.html,
      _ref3 = void 0 === e ? this.options : e,
      r = _ref3.containers;
    var o = new DOMParser().parseFromString(n, "text/html"),
      i = ((_o$querySelector = o.querySelector("title")) === null || _o$querySelector === void 0 ? void 0 : _o$querySelector.innerText) || "";
    document.title = i;
    var s = u('[data-swup-persist]:not([data-swup-persist=""])'),
      a = r.map(function (t) {
        var e = document.querySelector(t),
          n = o.querySelector(t);
        return e && n ? (e.replaceWith(n), !0) : (e || console.warn("[swup] Container missing in current document: ".concat(t)), n || console.warn("[swup] Container missing in incoming document: ".concat(t)), !1);
      }).filter(Boolean);
    return s.forEach(function (t) {
      var e = t.getAttribute("data-swup-persist"),
        n = h("[data-swup-persist=\"".concat(e, "\"]"));
      n && n !== t && n.replaceWith(t);
    }), a.length === r.length;
  },
  T = function T() {
    var _this7 = this;
    var t = {
        behavior: "auto"
      },
      _this$visit$scroll = this.visit.scroll,
      e = _this$visit$scroll.target,
      n = _this$visit$scroll.reset,
      r = e !== null && e !== void 0 ? e : this.visit.to.hash;
    var o = !1;
    return r && (o = this.hooks.callSync("scroll:anchor", {
      hash: r,
      options: t
    }, function (t, e) {
      var n = e.hash,
        r = e.options;
      var o = _this7.getAnchorElement(n);
      return o && o.scrollIntoView(r), !!o;
    })), n && !o && (o = this.hooks.callSync("scroll:top", {
      options: t
    }, function (t, e) {
      var n = e.options;
      return window.scrollTo(_objectSpread({
        top: 0,
        left: 0
      }, n)), !0;
    })), o;
  },
  D = function D() {
    try {
      var _t7 = this;
      if (!_t7.visit.animation.animate) return Promise.resolve();
      var _e3 = _t7.hooks.call("animation:in:await", {
        skip: !1
      }, function (e, n) {
        var r = n.skip;
        try {
          return r ? Promise.resolve() : Promise.resolve(_t7.awaitAnimations({
            selector: e.animation.selector
          })).then(function () {});
        } catch (t) {
          return Promise.reject(t);
        }
      });
      return Promise.resolve(d()).then(function () {
        return Promise.resolve(_t7.hooks.call("animation:in:start", void 0, function () {
          _t7.classes.remove("is-animating");
        })).then(function () {
          return Promise.resolve(_e3).then(function () {
            return Promise.resolve(_t7.hooks.call("animation:in:end", void 0)).then(function () {});
          });
        });
      });
    } catch (t) {
      return Promise.reject(t);
    }
  },
  M = function M(t) {
    try {
      var _e4 = this,
        _o7 = t.url,
        _s4 = t.html;
      return _e4.classes.remove("is-leaving"), _e4.isSameResolvedUrl(r(), _o7) || (i(_o7), _e4.currentPageUrl = r(), _e4.visit.to.url = _e4.currentPageUrl), _e4.visit.animation.animate && _e4.classes.add("is-rendering"), _e4.visit.to.html = _s4, Promise.resolve(_e4.hooks.call("content:replace", {
        page: t
      }, function (t, r) {
        var o = r.page;
        if (!_e4.replaceContent(o, {
          containers: t.containers
        })) throw new Error("[swup] Container mismatch, aborting");
        t.animation.animate && (_e4.classes.add("is-animating", "is-changing", "is-rendering"), t.animation.name && _e4.classes.add("to-".concat(n(t.animation.name))));
      })).then(function () {
        return Promise.resolve(_e4.hooks.call("content:scroll", void 0, function () {
          return _e4.scrollToContent();
        })).then(function () {
          return Promise.resolve(_e4.hooks.call("page:view", {
            url: _e4.currentPageUrl,
            title: document.title
          })).then(function () {});
        });
      });
    } catch (t) {
      return Promise.reject(t);
    }
  },
  V = function V(t) {
    var _e5;
    var e;
    if (e = t, Boolean((_e5 = e) === null || _e5 === void 0 ? void 0 : _e5.isSwupPlugin)) {
      if (t.swup = this, !t._checkRequirements || t._checkRequirements()) return t._beforeMount && t._beforeMount(), t.mount(), this.plugins.push(t), this.plugins;
    } else console.error("Not a swup plugin instance", t);
  };
function W(t) {
  var e = this.findPlugin(t);
  if (e) return e.unmount(), e._afterUnmount && e._afterUnmount(), this.plugins = this.plugins.filter(function (t) {
    return t !== e;
  }), this.plugins;
  console.error("No such plugin", e);
}
function B(t) {
  return this.plugins.find(function (e) {
    return e === t || e.name === t || e.name === "Swup".concat(String(t));
  });
}
function _(t) {
  if ("function" != typeof this.options.resolveUrl) return console.warn("[swup] options.resolveUrl expects a callback function."), t;
  var e = this.options.resolveUrl(t);
  return e && "string" == typeof e ? e.startsWith("//") || e.startsWith("http") ? (console.warn("[swup] options.resolveUrl needs to return a relative url"), t) : e : (console.warn("[swup] options.resolveUrl needs to return a url"), t);
}
function O(t, e) {
  return this.resolveUrl(t) === this.resolveUrl(e);
}
var F = {
  animateHistoryBrowsing: !1,
  animationSelector: '[class*="transition-"]',
  animationScope: "html",
  cache: !0,
  containers: ["#swup"],
  ignoreVisit: function ignoreVisit(t, e) {
    var _ref4 = void 0 === e ? {} : e,
      n = _ref4.el;
    return !!(n !== null && n !== void 0 && n.closest("[data-no-swup]"));
  },
  linkSelector: "a[href]",
  linkToSelf: "scroll",
  plugins: [],
  resolveUrl: function resolveUrl(t) {
    return t;
  },
  requestHeaders: {
    "X-Requested-With": "swup",
    Accept: "text/html, application/xhtml+xml"
  },
  skipPopStateHandling: function skipPopStateHandling(t) {
    var _t$state;
    return "swup" !== ((_t$state = t.state) === null || _t$state === void 0 ? void 0 : _t$state.source);
  }
};
var K = /*#__PURE__*/function () {
  function K(t) {
    var _history$state$index, _history$state;
    _classCallCheck(this, K);
    void 0 === t && (t = {}), this.version = "4.3.4", this.options = void 0, this.defaults = F, this.plugins = [], this.visit = void 0, this.cache = void 0, this.hooks = void 0, this.classes = void 0, this.currentPageUrl = r(), this.currentHistoryIndex = void 0, this.clickDelegate = void 0, this.use = V, this.unuse = W, this.findPlugin = B, this.log = function () {}, this.navigate = j, this.performNavigation = I, this.createVisit = y, this.delegateEvent = s, this.fetchPage = q, this.awaitAnimations = C, this.renderPage = M, this.replaceContent = N, this.animatePageIn = D, this.animatePageOut = R, this.scrollToContent = T, this.getAnchorElement = U, this.getCurrentUrl = r, this.resolveUrl = _, this.isSameResolvedUrl = O, this.options = _objectSpread(_objectSpread({}, this.defaults), t), this.handleLinkClick = this.handleLinkClick.bind(this), this.handlePopState = this.handlePopState.bind(this), this.cache = new l(this), this.classes = new w(this), this.hooks = new E(this), this.visit = this.createVisit({
      to: ""
    }), this.currentHistoryIndex = (_history$state$index = (_history$state = history.state) === null || _history$state === void 0 ? void 0 : _history$state.index) !== null && _history$state$index !== void 0 ? _history$state$index : 1, this.checkRequirements() && this.enable();
  }
  _createClass(K, [{
    key: "checkRequirements",
    value: function checkRequirements() {
      return "undefined" != typeof Promise || (console.warn("Promise is not supported"), !1);
    }
  }, {
    key: "enable",
    value: function enable() {
      try {
        var _history$state2;
        var _t8 = this,
          _e6 = _t8.options.linkSelector;
        return _t8.clickDelegate = _t8.delegateEvent(_e6, "click", _t8.handleLinkClick), window.addEventListener("popstate", _t8.handlePopState), _t8.options.animateHistoryBrowsing && (window.history.scrollRestoration = "manual"), _t8.options.plugins.forEach(function (e) {
          return _t8.use(e);
        }), "swup" !== ((_history$state2 = history.state) === null || _history$state2 === void 0 ? void 0 : _history$state2.source) && i(null, {
          index: _t8.currentHistoryIndex
        }), Promise.resolve(d()).then(function () {
          return Promise.resolve(_t8.hooks.call("enable", void 0, function () {
            document.documentElement.classList.add("swup-enabled");
          })).then(function () {});
        });
      } catch (t) {
        return Promise.reject(t);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      try {
        var _t9 = this;
        return _t9.clickDelegate.destroy(), window.removeEventListener("popstate", _t9.handlePopState), _t9.cache.clear(), _t9.options.plugins.forEach(function (e) {
          return _t9.unuse(e);
        }), Promise.resolve(_t9.hooks.call("disable", void 0, function () {
          document.documentElement.classList.remove("swup-enabled");
        })).then(function () {
          _t9.hooks.clear();
        });
      } catch (t) {
        return Promise.reject(t);
      }
    }
  }, {
    key: "shouldIgnoreVisit",
    value: function shouldIgnoreVisit(t, e) {
      var _ref5 = void 0 === e ? {} : e,
        n = _ref5.el,
        r = _ref5.event;
      var _a$fromUrl4 = a.fromUrl(t),
        o = _a$fromUrl4.origin,
        i = _a$fromUrl4.url,
        s = _a$fromUrl4.hash;
      return o !== window.location.origin || !(!n || !this.triggerWillOpenNewWindow(n)) || !!this.options.ignoreVisit(i + s, {
        el: n,
        event: r
      });
    }
  }, {
    key: "handleLinkClick",
    value: function handleLinkClick(t) {
      var _this8 = this;
      var e = t.delegateTarget,
        _a$fromElement = a.fromElement(e),
        n = _a$fromElement.href,
        r = _a$fromElement.url,
        o = _a$fromElement.hash;
      this.shouldIgnoreVisit(n, {
        el: e,
        event: t
      }) || (this.visit = this.createVisit({
        to: r,
        hash: o,
        el: e,
        event: t
      }), t.metaKey || t.ctrlKey || t.shiftKey || t.altKey ? this.hooks.call("link:newtab", {
        href: n
      }) : 0 === t.button && this.hooks.callSync("link:click", {
        el: e,
        event: t
      }, function () {
        var _this8$visit$from$url;
        var e = (_this8$visit$from$url = _this8.visit.from.url) !== null && _this8$visit$from$url !== void 0 ? _this8$visit$from$url : "";
        t.preventDefault(), r && r !== e ? _this8.isSameResolvedUrl(r, e) || _this8.performNavigation() : o ? _this8.hooks.callSync("link:anchor", {
          hash: o
        }, function () {
          i(r + o), _this8.scrollToContent();
        }) : _this8.hooks.callSync("link:self", void 0, function () {
          return "navigate" === _this8.options.linkToSelf ? _this8.performNavigation() : (i(r), _this8.scrollToContent());
        });
      }));
    }
  }, {
    key: "handlePopState",
    value: function handlePopState(t) {
      var _t$state$url,
        _t$state2,
        _t$state$index,
        _t$state3,
        _this9 = this;
      var e = (_t$state$url = (_t$state2 = t.state) === null || _t$state2 === void 0 ? void 0 : _t$state2.url) !== null && _t$state$url !== void 0 ? _t$state$url : location.href;
      if (this.options.skipPopStateHandling(t)) return;
      if (this.isSameResolvedUrl(r(), this.currentPageUrl)) return;
      var _a$fromUrl5 = a.fromUrl(e),
        n = _a$fromUrl5.url,
        o = _a$fromUrl5.hash;
      this.visit = this.createVisit({
        to: n,
        hash: o,
        event: t
      }), this.visit.history.popstate = !0;
      var i = (_t$state$index = (_t$state3 = t.state) === null || _t$state3 === void 0 ? void 0 : _t$state3.index) !== null && _t$state$index !== void 0 ? _t$state$index : 0;
      i && i !== this.currentHistoryIndex && (this.visit.history.direction = i - this.currentHistoryIndex > 0 ? "forwards" : "backwards", this.currentHistoryIndex = i), this.visit.animation.animate = !1, this.visit.scroll.reset = !1, this.visit.scroll.target = !1, this.options.animateHistoryBrowsing && (this.visit.animation.animate = !0, this.visit.scroll.reset = !0), this.hooks.callSync("history:popstate", {
        event: t
      }, function () {
        _this9.performNavigation();
      });
    }
  }, {
    key: "triggerWillOpenNewWindow",
    value: function triggerWillOpenNewWindow(t) {
      return !!t.matches('[download], [target="_blank"]');
    }
  }]);
  return K;
}();
exports.default = K;
},{"delegate-it":"Bnny","path-to-regexp":"bJP7"}],"oGbA":[function(require,module,exports) {
"use strict";

var _swup = _interopRequireDefault(require("swup"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var swup = new _swup.default();
},{"swup":"Gk8X"}]},{},["oGbA"], null)
//# sourceMappingURL=/swup_import.js.map