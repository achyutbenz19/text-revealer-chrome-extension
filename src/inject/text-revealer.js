/**
 *
 *  Text Revealer JS v1.0.0-beta-200125
 *  @author	jamigibbs | <jami0821@gmail.com>
 *  @url https://github.com/jamigibbs/text-revealer-js#readme
 *  @license MIT
 */

var TextRevealer = (function () {
  "use strict";

  var commonjsGlobal =
    typeof globalThis !== "undefined"
      ? globalThis
      : typeof window !== "undefined"
        ? window
        : typeof global !== "undefined"
          ? global
          : typeof self !== "undefined"
            ? self
            : {};

  function unwrapExports(x) {
    return x &&
      x.__esModule &&
      Object.prototype.hasOwnProperty.call(x, "default")
      ? x["default"]
      : x;
  }

  function createCommonjsModule(fn, module) {
    return (
      (module = { exports: {} }), fn(module, module.exports), module.exports
    );
  }

  var utils = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    exports.extend = extend;
    exports.indexOf = indexOf;
    exports.escapeExpression = escapeExpression;
    exports.isEmpty = isEmpty;
    exports.createFrame = createFrame;
    exports.blockParams = blockParams;
    exports.appendContextPath = appendContextPath;
    var escape = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "`": "&#x60;",
      "=": "&#x3D;",
    };

    var badChars = /[&<>"'`=]/g,
      possible = /[&<>"'`=]/;

    function escapeChar(chr) {
      return escape[chr];
    }

    function extend(obj /* , ...source */) {
      for (var i = 1; i < arguments.length; i++) {
        for (var key in arguments[i]) {
          if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
            obj[key] = arguments[i][key];
          }
        }
      }

      return obj;
    }

    var toString = Object.prototype.toString;

    exports.toString = toString;
    // Sourced from lodash
    // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
    /* eslint-disable func-style */
    var isFunction = function isFunction(value) {
      return typeof value === "function";
    };
    // fallback for older versions of Chrome and Safari
    /* istanbul ignore next */
    if (isFunction(/x/)) {
      exports.isFunction = isFunction = function (value) {
        return (
          typeof value === "function" &&
          toString.call(value) === "[object Function]"
        );
      };
    }
    exports.isFunction = isFunction;

    /* eslint-enable func-style */

    /* istanbul ignore next */
    var isArray =
      Array.isArray ||
      function (value) {
        return value && typeof value === "object"
          ? toString.call(value) === "[object Array]"
          : false;
      };

    exports.isArray = isArray;
    // Older IE versions do not directly support indexOf so we must implement our own, sadly.

    function indexOf(array, value) {
      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] === value) {
          return i;
        }
      }
      return -1;
    }

    function escapeExpression(string) {
      if (typeof string !== "string") {
        // don't escape SafeStrings, since they're already safe
        if (string && string.toHTML) {
          return string.toHTML();
        } else if (string == null) {
          return "";
        } else if (!string) {
          return string + "";
        }

        // Force a string conversion as this will be done by the append regardless and
        // the regex test will do this transparently behind the scenes, causing issues if
        // an object's to string has escaped characters in it.
        string = "" + string;
      }

      if (!possible.test(string)) {
        return string;
      }
      return string.replace(badChars, escapeChar);
    }

    function isEmpty(value) {
      if (!value && value !== 0) {
        return true;
      } else if (isArray(value) && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }

    function createFrame(object) {
      var frame = extend({}, object);
      frame._parent = object;
      return frame;
    }

    function blockParams(params, ids) {
      params.path = ids;
      return params;
    }

    function appendContextPath(contextPath, id) {
      return (contextPath ? contextPath + "." : "") + id;
    }
  });

  unwrapExports(utils);
  var utils_1 = utils.extend;
  var utils_2 = utils.indexOf;
  var utils_3 = utils.escapeExpression;
  var utils_4 = utils.isEmpty;
  var utils_5 = utils.createFrame;
  var utils_6 = utils.blockParams;
  var utils_7 = utils.appendContextPath;
  var utils_8 = utils.isFunction;
  var utils_9 = utils.isArray;

  var exception = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    var errorProps = [
      "description",
      "fileName",
      "lineNumber",
      "endLineNumber",
      "message",
      "name",
      "number",
      "stack",
    ];

    function Exception(message, node) {
      var loc = node && node.loc,
        line = undefined,
        endLineNumber = undefined,
        column = undefined,
        endColumn = undefined;

      if (loc) {
        line = loc.start.line;
        endLineNumber = loc.end.line;
        column = loc.start.column;
        endColumn = loc.end.column;

        message += " - " + line + ":" + column;
      }

      var tmp = Error.prototype.constructor.call(this, message);

      // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
      for (var idx = 0; idx < errorProps.length; idx++) {
        this[errorProps[idx]] = tmp[errorProps[idx]];
      }

      /* istanbul ignore else */
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, Exception);
      }

      try {
        if (loc) {
          this.lineNumber = line;
          this.endLineNumber = endLineNumber;

          // Work around issue under safari where we can't directly set the column value
          /* istanbul ignore next */
          if (Object.defineProperty) {
            Object.defineProperty(this, "column", {
              value: column,
              enumerable: true,
            });
            Object.defineProperty(this, "endColumn", {
              value: endColumn,
              enumerable: true,
            });
          } else {
            this.column = column;
            this.endColumn = endColumn;
          }
        }
      } catch (nop) {
        /* Ignore if the browser is very particular */
      }
    }

    Exception.prototype = new Error();

    exports["default"] = Exception;
    module.exports = exports["default"];
  });

  unwrapExports(exception);

  var blockHelperMissing = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;

    exports["default"] = function (instance) {
      instance.registerHelper(
        "blockHelperMissing",
        function (context, options) {
          var inverse = options.inverse,
            fn = options.fn;

          if (context === true) {
            return fn(this);
          } else if (context === false || context == null) {
            return inverse(this);
          } else if (utils.isArray(context)) {
            if (context.length > 0) {
              if (options.ids) {
                options.ids = [options.name];
              }

              return instance.helpers.each(context, options);
            } else {
              return inverse(this);
            }
          } else {
            if (options.data && options.ids) {
              var data = utils.createFrame(options.data);
              data.contextPath = utils.appendContextPath(
                options.data.contextPath,
                options.name,
              );
              options = { data: data };
            }

            return fn(context, options);
          }
        },
      );
    };

    module.exports = exports["default"];
  });

  unwrapExports(blockHelperMissing);

  var each = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    // istanbul ignore next

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }

    var _exception2 = _interopRequireDefault(exception);

    exports["default"] = function (instance) {
      instance.registerHelper("each", function (context, options) {
        if (!options) {
          throw new _exception2["default"]("Must pass iterator to #each");
        }

        var fn = options.fn,
          inverse = options.inverse,
          i = 0,
          ret = "",
          data = undefined,
          contextPath = undefined;

        if (options.data && options.ids) {
          contextPath =
            utils.appendContextPath(options.data.contextPath, options.ids[0]) +
            ".";
        }

        if (utils.isFunction(context)) {
          context = context.call(this);
        }

        if (options.data) {
          data = utils.createFrame(options.data);
        }

        function execIteration(field, index, last) {
          if (data) {
            data.key = field;
            data.index = index;
            data.first = index === 0;
            data.last = !!last;

            if (contextPath) {
              data.contextPath = contextPath + field;
            }
          }

          ret =
            ret +
            fn(context[field], {
              data: data,
              blockParams: utils.blockParams(
                [context[field], field],
                [contextPath + field, null],
              ),
            });
        }

        if (context && typeof context === "object") {
          if (utils.isArray(context)) {
            for (var j = context.length; i < j; i++) {
              if (i in context) {
                execIteration(i, i, i === context.length - 1);
              }
            }
          } else if (
            commonjsGlobal.Symbol &&
            context[commonjsGlobal.Symbol.iterator]
          ) {
            var newContext = [];
            var iterator = context[commonjsGlobal.Symbol.iterator]();
            for (var it = iterator.next(); !it.done; it = iterator.next()) {
              newContext.push(it.value);
            }
            context = newContext;
            for (var j = context.length; i < j; i++) {
              execIteration(i, i, i === context.length - 1);
            }
          } else {
            (function () {
              var priorKey = undefined;

              Object.keys(context).forEach(function (key) {
                // We're running the iterations one step out of sync so we can detect
                // the last iteration without have to scan the object twice and create
                // an itermediate keys array.
                if (priorKey !== undefined) {
                  execIteration(priorKey, i - 1);
                }
                priorKey = key;
                i++;
              });
              if (priorKey !== undefined) {
                execIteration(priorKey, i - 1, true);
              }
            })();
          }
        }

        if (i === 0) {
          ret = inverse(this);
        }

        return ret;
      });
    };

    module.exports = exports["default"];
  });

  unwrapExports(each);

  var helperMissing = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    // istanbul ignore next

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }

    var _exception2 = _interopRequireDefault(exception);

    exports["default"] = function (instance) {
      instance.registerHelper(
        "helperMissing",
        function () /* [args, ]options */ {
          if (arguments.length === 1) {
            // A missing field in a {{foo}} construct.
            return undefined;
          } else {
            // Someone is actually trying to call something, blow up.
            throw new _exception2["default"](
              'Missing helper: "' + arguments[arguments.length - 1].name + '"',
            );
          }
        },
      );
    };

    module.exports = exports["default"];
  });

  unwrapExports(helperMissing);

  var _if = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    // istanbul ignore next

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }

    var _exception2 = _interopRequireDefault(exception);

    exports["default"] = function (instance) {
      instance.registerHelper("if", function (conditional, options) {
        if (arguments.length != 2) {
          throw new _exception2["default"]("#if requires exactly one argument");
        }
        if (utils.isFunction(conditional)) {
          conditional = conditional.call(this);
        }

        // Default behavior is to render the positive path if the value is truthy and not empty.
        // The `includeZero` option may be set to treat the condtional as purely not empty based on the
        // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
        if (
          (!options.hash.includeZero && !conditional) ||
          utils.isEmpty(conditional)
        ) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      });

      instance.registerHelper("unless", function (conditional, options) {
        if (arguments.length != 2) {
          throw new _exception2["default"](
            "#unless requires exactly one argument",
          );
        }
        return instance.helpers["if"].call(this, conditional, {
          fn: options.inverse,
          inverse: options.fn,
          hash: options.hash,
        });
      });
    };

    module.exports = exports["default"];
  });

  unwrapExports(_if);

  var log = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;

    exports["default"] = function (instance) {
      instance.registerHelper("log", function () /* message, options */ {
        var args = [undefined],
          options = arguments[arguments.length - 1];
        for (var i = 0; i < arguments.length - 1; i++) {
          args.push(arguments[i]);
        }

        var level = 1;
        if (options.hash.level != null) {
          level = options.hash.level;
        } else if (options.data && options.data.level != null) {
          level = options.data.level;
        }
        args[0] = level;

        instance.log.apply(instance, args);
      });
    };

    module.exports = exports["default"];
  });

  unwrapExports(log);

  var lookup = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;

    exports["default"] = function (instance) {
      instance.registerHelper("lookup", function (obj, field, options) {
        if (!obj) {
          // Note for 5.0: Change to "obj == null" in 5.0
          return obj;
        }
        return options.lookupProperty(obj, field);
      });
    };

    module.exports = exports["default"];
  });

  unwrapExports(lookup);

  var _with = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    // istanbul ignore next

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }

    var _exception2 = _interopRequireDefault(exception);

    exports["default"] = function (instance) {
      instance.registerHelper("with", function (context, options) {
        if (arguments.length != 2) {
          throw new _exception2["default"](
            "#with requires exactly one argument",
          );
        }
        if (utils.isFunction(context)) {
          context = context.call(this);
        }

        var fn = options.fn;

        if (!utils.isEmpty(context)) {
          var data = options.data;
          if (options.data && options.ids) {
            data = utils.createFrame(options.data);
            data.contextPath = utils.appendContextPath(
              options.data.contextPath,
              options.ids[0],
            );
          }

          return fn(context, {
            data: data,
            blockParams: utils.blockParams(
              [context],
              [data && data.contextPath],
            ),
          });
        } else {
          return options.inverse(this);
        }
      });
    };

    module.exports = exports["default"];
  });

  unwrapExports(_with);

  var helpers = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    exports.registerDefaultHelpers = registerDefaultHelpers;
    exports.moveHelperToHooks = moveHelperToHooks;
    // istanbul ignore next

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }

    var _helpersBlockHelperMissing2 =
      _interopRequireDefault(blockHelperMissing);

    var _helpersEach2 = _interopRequireDefault(each);

    var _helpersHelperMissing2 = _interopRequireDefault(helperMissing);

    var _helpersIf2 = _interopRequireDefault(_if);

    var _helpersLog2 = _interopRequireDefault(log);

    var _helpersLookup2 = _interopRequireDefault(lookup);

    var _helpersWith2 = _interopRequireDefault(_with);

    function registerDefaultHelpers(instance) {
      _helpersBlockHelperMissing2["default"](instance);
      _helpersEach2["default"](instance);
      _helpersHelperMissing2["default"](instance);
      _helpersIf2["default"](instance);
      _helpersLog2["default"](instance);
      _helpersLookup2["default"](instance);
      _helpersWith2["default"](instance);
    }

    function moveHelperToHooks(instance, helperName, keepHelper) {
      if (instance.helpers[helperName]) {
        instance.hooks[helperName] = instance.helpers[helperName];
        if (!keepHelper) {
          delete instance.helpers[helperName];
        }
      }
    }
  });

  unwrapExports(helpers);
  var helpers_1 = helpers.registerDefaultHelpers;
  var helpers_2 = helpers.moveHelperToHooks;

  var inline = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;

    exports["default"] = function (instance) {
      instance.registerDecorator(
        "inline",
        function (fn, props, container, options) {
          var ret = fn;
          if (!props.partials) {
            props.partials = {};
            ret = function (context, options) {
              // Create a new partials stack frame prior to exec.
              var original = container.partials;
              container.partials = utils.extend({}, original, props.partials);
              var ret = fn(context, options);
              container.partials = original;
              return ret;
            };
          }

          props.partials[options.args[0]] = options.fn;

          return ret;
        },
      );
    };

    module.exports = exports["default"];
  });

  unwrapExports(inline);

  var decorators = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    exports.registerDefaultDecorators = registerDefaultDecorators;
    // istanbul ignore next

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }

    var _decoratorsInline2 = _interopRequireDefault(inline);

    function registerDefaultDecorators(instance) {
      _decoratorsInline2["default"](instance);
    }
  });

  unwrapExports(decorators);
  var decorators_1 = decorators.registerDefaultDecorators;

  var logger_1 = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;

    var logger = {
      methodMap: ["debug", "info", "warn", "error"],
      level: "info",

      // Maps a given level value to the `methodMap` indexes above.
      lookupLevel: function lookupLevel(level) {
        if (typeof level === "string") {
          var levelMap = utils.indexOf(logger.methodMap, level.toLowerCase());
          if (levelMap >= 0) {
            level = levelMap;
          } else {
            level = parseInt(level, 10);
          }
        }

        return level;
      },

      // Can be overridden in the host environment
      log: function log(level) {
        level = logger.lookupLevel(level);

        if (
          typeof console !== "undefined" &&
          logger.lookupLevel(logger.level) <= level
        ) {
          var method = logger.methodMap[level];
          // eslint-disable-next-line no-console
          if (!console[method]) {
            method = "log";
          }

          for (
            var _len = arguments.length,
            message = Array(_len > 1 ? _len - 1 : 0),
            _key = 1;
            _key < _len;
            _key++
          ) {
            message[_key - 1] = arguments[_key];
          }

          console[method].apply(console, message); // eslint-disable-line no-console
        }
      },
    };

    exports["default"] = logger;
    module.exports = exports["default"];
  });

  unwrapExports(logger_1);

  var createNewLookupObject_1 = createCommonjsModule(
    function (module, exports) {
      exports.__esModule = true;
      exports.createNewLookupObject = createNewLookupObject;

      /**
       * Create a new object with "null"-prototype to avoid truthy results on prototype properties.
       * The resulting object can be used with "object[property]" to check if a property exists
       * @param {...object} sources a varargs parameter of source objects that will be merged
       * @returns {object}
       */

      function createNewLookupObject() {
        for (
          var _len = arguments.length, sources = Array(_len), _key = 0;
          _key < _len;
          _key++
        ) {
          sources[_key] = arguments[_key];
        }

        return utils.extend.apply(
          undefined,
          [Object.create(null)].concat(sources),
        );
      }
    },
  );

  unwrapExports(createNewLookupObject_1);
  var createNewLookupObject_2 = createNewLookupObject_1.createNewLookupObject;

  var protoAccess = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    exports.createProtoAccessControl = createProtoAccessControl;
    exports.resultIsAllowed = resultIsAllowed;
    exports.resetLoggedProperties = resetLoggedProperties;
    // istanbul ignore next

    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key))
              newObj[key] = obj[key];
          }
        }
        newObj["default"] = obj;
        return newObj;
      }
    }

    var logger = _interopRequireWildcard(logger_1);

    var loggedProperties = Object.create(null);

    function createProtoAccessControl(runtimeOptions) {
      var defaultMethodWhiteList = Object.create(null);
      defaultMethodWhiteList["constructor"] = false;
      defaultMethodWhiteList["__defineGetter__"] = false;
      defaultMethodWhiteList["__defineSetter__"] = false;
      defaultMethodWhiteList["__lookupGetter__"] = false;

      var defaultPropertyWhiteList = Object.create(null);
      // eslint-disable-next-line no-proto
      defaultPropertyWhiteList["__proto__"] = false;

      return {
        properties: {
          whitelist: createNewLookupObject_1.createNewLookupObject(
            defaultPropertyWhiteList,
            runtimeOptions.allowedProtoProperties,
          ),
          defaultValue: runtimeOptions.allowProtoPropertiesByDefault,
        },
        methods: {
          whitelist: createNewLookupObject_1.createNewLookupObject(
            defaultMethodWhiteList,
            runtimeOptions.allowedProtoMethods,
          ),
          defaultValue: runtimeOptions.allowProtoMethodsByDefault,
        },
      };
    }

    function resultIsAllowed(result, protoAccessControl, propertyName) {
      if (typeof result === "function") {
        return checkWhiteList(protoAccessControl.methods, propertyName);
      } else {
        return checkWhiteList(protoAccessControl.properties, propertyName);
      }
    }

    function checkWhiteList(protoAccessControlForType, propertyName) {
      if (protoAccessControlForType.whitelist[propertyName] !== undefined) {
        return protoAccessControlForType.whitelist[propertyName] === true;
      }
      if (protoAccessControlForType.defaultValue !== undefined) {
        return protoAccessControlForType.defaultValue;
      }
      logUnexpecedPropertyAccessOnce(propertyName);
      return false;
    }

    function logUnexpecedPropertyAccessOnce(propertyName) {
      if (loggedProperties[propertyName] !== true) {
        loggedProperties[propertyName] = true;
        logger.log(
          "error",
          'Handlebars: Access has been denied to resolve the property "' +
          propertyName +
          '" because it is not an "own property" of its parent.\n' +
          "You can add a runtime option to disable the check or this warning:\n" +
          "See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details",
        );
      }
    }

    function resetLoggedProperties() {
      Object.keys(loggedProperties).forEach(function (propertyName) {
        delete loggedProperties[propertyName];
      });
    }
  });

  unwrapExports(protoAccess);
  var protoAccess_1 = protoAccess.createProtoAccessControl;
  var protoAccess_2 = protoAccess.resultIsAllowed;
  var protoAccess_3 = protoAccess.resetLoggedProperties;

  var base = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    exports.HandlebarsEnvironment = HandlebarsEnvironment;
    // istanbul ignore next

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }

    var _exception2 = _interopRequireDefault(exception);

    var _logger2 = _interopRequireDefault(logger_1);

    var VERSION = "4.7.2";
    exports.VERSION = VERSION;
    var COMPILER_REVISION = 8;
    exports.COMPILER_REVISION = COMPILER_REVISION;
    var LAST_COMPATIBLE_COMPILER_REVISION = 7;

    exports.LAST_COMPATIBLE_COMPILER_REVISION =
      LAST_COMPATIBLE_COMPILER_REVISION;
    var REVISION_CHANGES = {
      1: "<= 1.0.rc.2", // 1.0.rc.2 is actually rev2 but doesn't report it
      2: "== 1.0.0-rc.3",
      3: "== 1.0.0-rc.4",
      4: "== 1.x.x",
      5: "== 2.0.0-alpha.x",
      6: ">= 2.0.0-beta.1",
      7: ">= 4.0.0 <4.3.0",
      8: ">= 4.3.0",
    };

    exports.REVISION_CHANGES = REVISION_CHANGES;
    var objectType = "[object Object]";

    function HandlebarsEnvironment(helpers$1, partials, decorators$1) {
      this.helpers = helpers$1 || {};
      this.partials = partials || {};
      this.decorators = decorators$1 || {};

      helpers.registerDefaultHelpers(this);
      decorators.registerDefaultDecorators(this);
    }

    HandlebarsEnvironment.prototype = {
      constructor: HandlebarsEnvironment,

      logger: _logger2["default"],
      log: _logger2["default"].log,

      registerHelper: function registerHelper(name, fn) {
        if (utils.toString.call(name) === objectType) {
          if (fn) {
            throw new _exception2["default"](
              "Arg not supported with multiple helpers",
            );
          }
          utils.extend(this.helpers, name);
        } else {
          this.helpers[name] = fn;
        }
      },
      unregisterHelper: function unregisterHelper(name) {
        delete this.helpers[name];
      },

      registerPartial: function registerPartial(name, partial) {
        if (utils.toString.call(name) === objectType) {
          utils.extend(this.partials, name);
        } else {
          if (typeof partial === "undefined") {
            throw new _exception2["default"](
              'Attempting to register a partial called "' +
              name +
              '" as undefined',
            );
          }
          this.partials[name] = partial;
        }
      },
      unregisterPartial: function unregisterPartial(name) {
        delete this.partials[name];
      },

      registerDecorator: function registerDecorator(name, fn) {
        if (utils.toString.call(name) === objectType) {
          if (fn) {
            throw new _exception2["default"](
              "Arg not supported with multiple decorators",
            );
          }
          utils.extend(this.decorators, name);
        } else {
          this.decorators[name] = fn;
        }
      },
      unregisterDecorator: function unregisterDecorator(name) {
        delete this.decorators[name];
      },
      /**
       * Reset the memory of illegal property accesses that have already been logged.
       * @deprecated should only be used in handlebars test-cases
       */
      resetLoggedPropertyAccesses: function resetLoggedPropertyAccesses() {
        protoAccess.resetLoggedProperties();
      },
    };

    var log = _logger2["default"].log;

    exports.log = log;
    exports.createFrame = utils.createFrame;
    exports.logger = _logger2["default"];
  });

  unwrapExports(base);
  var base_1 = base.HandlebarsEnvironment;
  var base_2 = base.VERSION;
  var base_3 = base.COMPILER_REVISION;
  var base_4 = base.LAST_COMPATIBLE_COMPILER_REVISION;
  var base_5 = base.REVISION_CHANGES;
  var base_6 = base.log;
  var base_7 = base.createFrame;
  var base_8 = base.logger;

  var safeString = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    function SafeString(string) {
      this.string = string;
    }

    SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
      return "" + this.string;
    };

    exports["default"] = SafeString;
    module.exports = exports["default"];
  });

  unwrapExports(safeString);

  var wrapHelper_1 = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    exports.wrapHelper = wrapHelper;

    function wrapHelper(helper, transformOptionsFn) {
      if (typeof helper !== "function") {
        // This should not happen, but apparently it does in https://github.com/wycats/handlebars.js/issues/1639
        // We try to make the wrapper least-invasive by not wrapping it, if the helper is not a function.
        return helper;
      }
      var wrapper = function wrapper() /* dynamic arguments */ {
        var options = arguments[arguments.length - 1];
        arguments[arguments.length - 1] = transformOptionsFn(options);
        return helper.apply(this, arguments);
      };
      return wrapper;
    }
  });

  unwrapExports(wrapHelper_1);
  var wrapHelper_2 = wrapHelper_1.wrapHelper;

  var runtime = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    exports.checkRevision = checkRevision;
    exports.template = template;
    exports.wrapProgram = wrapProgram;
    exports.resolvePartial = resolvePartial;
    exports.invokePartial = invokePartial;
    exports.noop = noop;
    // istanbul ignore next

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }

    // istanbul ignore next

    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key))
              newObj[key] = obj[key];
          }
        }
        newObj["default"] = obj;
        return newObj;
      }
    }

    var Utils = _interopRequireWildcard(utils);

    var _exception2 = _interopRequireDefault(exception);

    function checkRevision(compilerInfo) {
      var compilerRevision = (compilerInfo && compilerInfo[0]) || 1,
        currentRevision = base.COMPILER_REVISION;

      if (
        compilerRevision >= base.LAST_COMPATIBLE_COMPILER_REVISION &&
        compilerRevision <= base.COMPILER_REVISION
      ) {
        return;
      }

      if (compilerRevision < base.LAST_COMPATIBLE_COMPILER_REVISION) {
        var runtimeVersions = base.REVISION_CHANGES[currentRevision],
          compilerVersions = base.REVISION_CHANGES[compilerRevision];
        throw new _exception2["default"](
          "Template was precompiled with an older version of Handlebars than the current runtime. " +
          "Please update your precompiler to a newer version (" +
          runtimeVersions +
          ") or downgrade your runtime to an older version (" +
          compilerVersions +
          ").",
        );
      } else {
        // Use the embedded version info since the runtime doesn't know about this revision yet
        throw new _exception2["default"](
          "Template was precompiled with a newer version of Handlebars than the current runtime. " +
          "Please update your runtime to a newer version (" +
          compilerInfo[1] +
          ").",
        );
      }
    }

    function template(templateSpec, env) {
      /* istanbul ignore next */
      if (!env) {
        throw new _exception2["default"]("No environment passed to template");
      }
      if (!templateSpec || !templateSpec.main) {
        throw new _exception2["default"](
          "Unknown template object: " + typeof templateSpec,
        );
      }

      templateSpec.main.decorator = templateSpec.main_d;

      // Note: Using env.VM references rather than local var references throughout this section to allow
      // for external users to override these as pseudo-supported APIs.
      env.VM.checkRevision(templateSpec.compiler);

      // backwards compatibility for precompiled templates with compiler-version 7 (<4.3.0)
      var templateWasPrecompiledWithCompilerV7 =
        templateSpec.compiler && templateSpec.compiler[0] === 7;

      function invokePartialWrapper(partial, context, options) {
        if (options.hash) {
          context = Utils.extend({}, context, options.hash);
          if (options.ids) {
            options.ids[0] = true;
          }
        }
        partial = env.VM.resolvePartial.call(this, partial, context, options);

        var extendedOptions = Utils.extend({}, options, {
          hooks: this.hooks,
          protoAccessControl: this.protoAccessControl,
        });

        var result = env.VM.invokePartial.call(
          this,
          partial,
          context,
          extendedOptions,
        );

        if (result == null && env.compile) {
          options.partials[options.name] = env.compile(
            partial,
            templateSpec.compilerOptions,
            env,
          );
          result = options.partials[options.name](context, extendedOptions);
        }
        if (result != null) {
          if (options.indent) {
            var lines = result.split("\n");
            for (var i = 0, l = lines.length; i < l; i++) {
              if (!lines[i] && i + 1 === l) {
                break;
              }

              lines[i] = options.indent + lines[i];
            }
            result = lines.join("\n");
          }
          return result;
        } else {
          throw new _exception2["default"](
            "The partial " +
            options.name +
            " could not be compiled when running in runtime-only mode",
          );
        }
      }

      // Just add water
      var container = {
        strict: function strict(obj, name, loc) {
          if (!obj || !(name in obj)) {
            throw new _exception2["default"](
              '"' + name + '" not defined in ' + obj,
              {
                loc: loc,
              },
            );
          }
          return obj[name];
        },
        lookupProperty: function lookupProperty(parent, propertyName) {
          var result = parent[propertyName];
          if (result == null) {
            return result;
          }
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return result;
          }

          if (
            protoAccess.resultIsAllowed(
              result,
              container.protoAccessControl,
              propertyName,
            )
          ) {
            return result;
          }
          return undefined;
        },
        lookup: function lookup(depths, name) {
          var len = depths.length;
          for (var i = 0; i < len; i++) {
            var result = depths[i] && container.lookupProperty(depths[i], name);
            if (result != null) {
              return depths[i][name];
            }
          }
        },
        lambda: function lambda(current, context) {
          return typeof current === "function"
            ? current.call(context)
            : current;
        },

        escapeExpression: Utils.escapeExpression,
        invokePartial: invokePartialWrapper,

        fn: function fn(i) {
          var ret = templateSpec[i];
          ret.decorator = templateSpec[i + "_d"];
          return ret;
        },

        programs: [],
        program: function program(
          i,
          data,
          declaredBlockParams,
          blockParams,
          depths,
        ) {
          var programWrapper = this.programs[i],
            fn = this.fn(i);
          if (data || depths || blockParams || declaredBlockParams) {
            programWrapper = wrapProgram(
              this,
              i,
              fn,
              data,
              declaredBlockParams,
              blockParams,
              depths,
            );
          } else if (!programWrapper) {
            programWrapper = this.programs[i] = wrapProgram(this, i, fn);
          }
          return programWrapper;
        },

        data: function data(value, depth) {
          while (value && depth--) {
            value = value._parent;
          }
          return value;
        },
        mergeIfNeeded: function mergeIfNeeded(param, common) {
          var obj = param || common;

          if (param && common && param !== common) {
            obj = Utils.extend({}, common, param);
          }

          return obj;
        },
        // An empty object to use as replacement for null-contexts
        nullContext: Object.seal({}),

        noop: env.VM.noop,
        compilerInfo: templateSpec.compiler,
      };

      function ret(context) {
        var options =
          arguments.length <= 1 || arguments[1] === undefined
            ? {}
            : arguments[1];

        var data = options.data;

        ret._setup(options);
        if (!options.partial && templateSpec.useData) {
          data = initData(context, data);
        }
        var depths = undefined,
          blockParams = templateSpec.useBlockParams ? [] : undefined;
        if (templateSpec.useDepths) {
          if (options.depths) {
            depths =
              context != options.depths[0]
                ? [context].concat(options.depths)
                : options.depths;
          } else {
            depths = [context];
          }
        }

        function main(context /*, options*/) {
          return (
            "" +
            templateSpec.main(
              container,
              context,
              container.helpers,
              container.partials,
              data,
              blockParams,
              depths,
            )
          );
        }

        main = executeDecorators(
          templateSpec.main,
          main,
          container,
          options.depths || [],
          data,
          blockParams,
        );
        return main(context, options);
      }

      ret.isTop = true;

      ret._setup = function (options) {
        if (!options.partial) {
          var mergedHelpers = Utils.extend({}, env.helpers, options.helpers);
          wrapHelpersToPassLookupProperty(mergedHelpers, container);
          container.helpers = mergedHelpers;

          if (templateSpec.usePartial) {
            // Use mergeIfNeeded here to prevent compiling global partials multiple times
            container.partials = container.mergeIfNeeded(
              options.partials,
              env.partials,
            );
          }
          if (templateSpec.usePartial || templateSpec.useDecorators) {
            container.decorators = Utils.extend(
              {},
              env.decorators,
              options.decorators,
            );
          }

          container.hooks = {};
          container.protoAccessControl =
            protoAccess.createProtoAccessControl(options);

          var keepHelperInHelpers =
            options.allowCallsToHelperMissing ||
            templateWasPrecompiledWithCompilerV7;
          helpers.moveHelperToHooks(
            container,
            "helperMissing",
            keepHelperInHelpers,
          );
          helpers.moveHelperToHooks(
            container,
            "blockHelperMissing",
            keepHelperInHelpers,
          );
        } else {
          container.protoAccessControl = options.protoAccessControl; // internal option
          container.helpers = options.helpers;
          container.partials = options.partials;
          container.decorators = options.decorators;
          container.hooks = options.hooks;
        }
      };

      ret._child = function (i, data, blockParams, depths) {
        if (templateSpec.useBlockParams && !blockParams) {
          throw new _exception2["default"]("must pass block params");
        }
        if (templateSpec.useDepths && !depths) {
          throw new _exception2["default"]("must pass parent depths");
        }

        return wrapProgram(
          container,
          i,
          templateSpec[i],
          data,
          0,
          blockParams,
          depths,
        );
      };
      return ret;
    }

    function wrapProgram(
      container,
      i,
      fn,
      data,
      declaredBlockParams,
      blockParams,
      depths,
    ) {
      function prog(context) {
        var options =
          arguments.length <= 1 || arguments[1] === undefined
            ? {}
            : arguments[1];

        var currentDepths = depths;
        if (
          depths &&
          context != depths[0] &&
          !(context === container.nullContext && depths[0] === null)
        ) {
          currentDepths = [context].concat(depths);
        }

        return fn(
          container,
          context,
          container.helpers,
          container.partials,
          options.data || data,
          blockParams && [options.blockParams].concat(blockParams),
          currentDepths,
        );
      }

      prog = executeDecorators(fn, prog, container, depths, data, blockParams);

      prog.program = i;
      prog.depth = depths ? depths.length : 0;
      prog.blockParams = declaredBlockParams || 0;
      return prog;
    }

    /**
     * This is currently part of the official API, therefore implementation details should not be changed.
     */

    function resolvePartial(partial, context, options) {
      if (!partial) {
        if (options.name === "@partial-block") {
          partial = options.data["partial-block"];
        } else {
          partial = options.partials[options.name];
        }
      } else if (!partial.call && !options.name) {
        // This is a dynamic partial that returned a string
        options.name = partial;
        partial = options.partials[partial];
      }
      return partial;
    }

    function invokePartial(partial, context, options) {
      // Use the current closure context to save the partial-block if this partial
      var currentPartialBlock = options.data && options.data["partial-block"];
      options.partial = true;
      if (options.ids) {
        options.data.contextPath = options.ids[0] || options.data.contextPath;
      }

      var partialBlock = undefined;
      if (options.fn && options.fn !== noop) {
        (function () {
          options.data = base.createFrame(options.data);
          // Wrapper function to get access to currentPartialBlock from the closure
          var fn = options.fn;
          partialBlock = options.data["partial-block"] =
            function partialBlockWrapper(context) {
              var options =
                arguments.length <= 1 || arguments[1] === undefined
                  ? {}
                  : arguments[1];

              // Restore the partial-block from the closure for the execution of the block
              // i.e. the part inside the block of the partial call.
              options.data = base.createFrame(options.data);
              options.data["partial-block"] = currentPartialBlock;
              return fn(context, options);
            };
          if (fn.partials) {
            options.partials = Utils.extend({}, options.partials, fn.partials);
          }
        })();
      }

      if (partial === undefined && partialBlock) {
        partial = partialBlock;
      }

      if (partial === undefined) {
        throw new _exception2["default"](
          "The partial " + options.name + " could not be found",
        );
      } else if (partial instanceof Function) {
        return partial(context, options);
      }
    }

    function noop() {
      return "";
    }

    function initData(context, data) {
      if (!data || !("root" in data)) {
        data = data ? base.createFrame(data) : {};
        data.root = context;
      }
      return data;
    }

    function executeDecorators(fn, prog, container, depths, data, blockParams) {
      if (fn.decorator) {
        var props = {};
        prog = fn.decorator(
          prog,
          props,
          container,
          depths && depths[0],
          data,
          blockParams,
          depths,
        );
        Utils.extend(prog, props);
      }
      return prog;
    }

    function wrapHelpersToPassLookupProperty(mergedHelpers, container) {
      Object.keys(mergedHelpers).forEach(function (helperName) {
        var helper = mergedHelpers[helperName];
        mergedHelpers[helperName] = passLookupPropertyOption(helper, container);
      });
    }

    function passLookupPropertyOption(helper, container) {
      var lookupProperty = container.lookupProperty;
      return wrapHelper_1.wrapHelper(helper, function (options) {
        return Utils.extend({ lookupProperty: lookupProperty }, options);
      });
    }
  });

  unwrapExports(runtime);
  var runtime_1 = runtime.checkRevision;
  var runtime_2 = runtime.template;
  var runtime_3 = runtime.wrapProgram;
  var runtime_4 = runtime.resolvePartial;
  var runtime_5 = runtime.invokePartial;
  var runtime_6 = runtime.noop;

  var noConflict = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;

    exports["default"] = function (Handlebars) {
      /* istanbul ignore next */
      var root =
        typeof commonjsGlobal !== "undefined" ? commonjsGlobal : window,
        $Handlebars = root.Handlebars;
      /* istanbul ignore next */
      Handlebars.noConflict = function () {
        if (root.Handlebars === Handlebars) {
          root.Handlebars = $Handlebars;
        }
        return Handlebars;
      };
    };

    module.exports = exports["default"];
  });

  unwrapExports(noConflict);

  var handlebars_runtime = createCommonjsModule(function (module, exports) {
    exports.__esModule = true;
    // istanbul ignore next

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }

    // istanbul ignore next

    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key))
              newObj[key] = obj[key];
          }
        }
        newObj["default"] = obj;
        return newObj;
      }
    }

    var base$1 = _interopRequireWildcard(base);

    // Each of these augment the Handlebars object. No need to setup here.
    // (This is done to easily share code between commonjs and browse envs)

    var _handlebarsSafeString2 = _interopRequireDefault(safeString);

    var _handlebarsException2 = _interopRequireDefault(exception);

    var Utils = _interopRequireWildcard(utils);

    var runtime$1 = _interopRequireWildcard(runtime);

    var _handlebarsNoConflict2 = _interopRequireDefault(noConflict);

    // For compatibility and usage outside of module systems, make the Handlebars object a namespace
    function create() {
      var hb = new base$1.HandlebarsEnvironment();

      Utils.extend(hb, base$1);
      hb.SafeString = _handlebarsSafeString2["default"];
      hb.Exception = _handlebarsException2["default"];
      hb.Utils = Utils;
      hb.escapeExpression = Utils.escapeExpression;

      hb.VM = runtime$1;
      hb.template = function (spec) {
        return runtime$1.template(spec, hb);
      };

      return hb;
    }

    var inst = create();
    inst.create = create;

    _handlebarsNoConflict2["default"](inst);

    inst["default"] = inst;

    exports["default"] = inst;
    module.exports = exports["default"];
  });

  unwrapExports(handlebars_runtime);

  // Create a simple path alias to allow browserify to resolve
  // the runtime on a supported path.
  var runtime$1 = handlebars_runtime["default"];

  var Template = runtime$1.template({
    1: function (container, depth0, helpers, partials, data) {
      var stack1,
        alias1 = container.lambda,
        alias2 = container.escapeExpression,
        lookupProperty =
          container.lookupProperty ||
          function (parent, propertyName) {
            if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
              return parent[propertyName];
            }
            return undefined;
          };

      return (
        "\n  <p>" +
        alias2(
          alias1(
            (stack1 =
              (stack1 =
                depth0 != null ? lookupProperty(depth0, "data") : depth0) !=
                null
                ? lookupProperty(stack1, "wikiSummary")
                : stack1) != null
              ? lookupProperty(stack1, "summary")
              : stack1,
            depth0,
          ),
        ) +
        ' <span class="wiki-summary__link"><a href="' +
        alias2(
          alias1(
            (stack1 =
              (stack1 =
                depth0 != null ? lookupProperty(depth0, "data") : depth0) !=
                null
                ? lookupProperty(stack1, "wikiSummary")
                : stack1) != null
              ? lookupProperty(stack1, "link")
              : stack1,
            depth0,
          ),
        ) +
        '" target="_blank">' +
        alias2(
          alias1(
            (stack1 =
              (stack1 =
                depth0 != null ? lookupProperty(depth0, "data") : depth0) !=
                null
                ? lookupProperty(stack1, "wikiSummary")
                : stack1) != null
              ? lookupProperty(stack1, "title")
              : stack1,
            depth0,
          ),
        ) +
        " on Wikipedia &raquo;</a></span></p>\n"
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (container, depth0, helpers, partials, data) {
      var stack1,
        lookupProperty =
          container.lookupProperty ||
          function (parent, propertyName) {
            if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
              return parent[propertyName];
            }
            return undefined;
          };

      return (stack1 = lookupProperty(helpers, "if").call(
        depth0 != null ? depth0 : container.nullContext || {},
        (stack1 = depth0 != null ? lookupProperty(depth0, "data") : depth0) !=
          null
          ? lookupProperty(stack1, "wikiSummary")
          : stack1,
        {
          name: "if",
          hash: {},
          fn: container.program(1, data, 0),
          inverse: container.noop,
          data: data,
          loc: {
            source: "popover.hbs",
            start: { line: 1, column: 0 },
            end: { line: 5, column: 7 },
          },
        },
      )) != null
        ? stack1
        : "";
    },
    useData: true,
  });
  runtime$1.registerPartial("/_wikiSummary", Template);

  var Template$1 = runtime$1.template({
    1: function (container, depth0, helpers, partials, data) {
      var stack1,
        lookupProperty =
          container.lookupProperty ||
          function (parent, propertyName) {
            if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
              return parent[propertyName];
            }
            return undefined;
          };

      return (
        '\n  <h4 class="wiki-search__header">More Wikipedia Results</h4>\n\n  <ul>\n' +
        ((stack1 = lookupProperty(helpers, "each").call(
          depth0 != null ? depth0 : container.nullContext || {},
          (stack1 = depth0 != null ? lookupProperty(depth0, "data") : depth0) !=
            null
            ? lookupProperty(stack1, "wikiSearch")
            : stack1,
          {
            name: "each",
            hash: {},
            fn: container.program(2, data, 0),
            inverse: container.noop,
            data: data,
            loc: {
              source: "popover.hbs",
              start: { line: 6, column: 4 },
              end: { line: 8, column: 13 },
            },
          },
        )) != null
          ? stack1
          : "") +
        "  </ul>\n"
      );
    },
    2: function (container, depth0, helpers, partials, data) {
      var alias1 = container.lambda,
        alias2 = container.escapeExpression,
        lookupProperty =
          container.lookupProperty ||
          function (parent, propertyName) {
            if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
              return parent[propertyName];
            }
            return undefined;
          };

      return (
        '      <li><a href="' +
        alias2(
          alias1(
            depth0 != null ? lookupProperty(depth0, "link") : depth0,
            depth0,
          ),
        ) +
        '" target="_blank">' +
        alias2(
          alias1(
            depth0 != null ? lookupProperty(depth0, "title") : depth0,
            depth0,
          ),
        ) +
        "</a></li>\n"
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (container, depth0, helpers, partials, data) {
      var stack1,
        lookupProperty =
          container.lookupProperty ||
          function (parent, propertyName) {
            if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
              return parent[propertyName];
            }
            return undefined;
          };

      return (stack1 = lookupProperty(helpers, "if").call(
        depth0 != null ? depth0 : container.nullContext || {},
        (stack1 = depth0 != null ? lookupProperty(depth0, "data") : depth0) !=
          null
          ? lookupProperty(stack1, "wikiSearch")
          : stack1,
        {
          name: "if",
          hash: {},
          fn: container.program(1, data, 0),
          inverse: container.noop,
          data: data,
          loc: {
            source: "popover.hbs",
            start: { line: 1, column: 2 },
            end: { line: 10, column: 9 },
          },
        },
      )) != null
        ? stack1
        : "";
    },
    useData: true,
  });
  runtime$1.registerPartial("/_wikiSearch", Template$1);

  var Template$2 = runtime$1.template({
    1: function (container, depth0, helpers, partials, data) {
      var stack1,
        alias1 = depth0 != null ? depth0 : container.nullContext || {},
        lookupProperty =
          container.lookupProperty ||
          function (parent, propertyName) {
            if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
              return parent[propertyName];
            }
            return undefined;
          };

      return (
        "\n" +
        ((stack1 = lookupProperty(helpers, "if").call(
          alias1,
          (stack1 =
            (stack1 =
              depth0 != null ? lookupProperty(depth0, "data") : depth0) != null
              ? lookupProperty(stack1, "dictionary")
              : stack1) != null
            ? lookupProperty(stack1, "cons")
            : stack1,
          {
            name: "if",
            hash: {},
            fn: container.program(2, data, 0),
            inverse: container.noop,
            data: data,
            loc: {
              source: "popover.hbs",
              start: { line: 3, column: 4 },
              end: { line: 5, column: 11 },
            },
          },
        )) != null
          ? stack1
          : "") +
        "\n" +
        ((stack1 = lookupProperty(helpers, "if").call(
          alias1,
          (stack1 =
            (stack1 =
              depth0 != null ? lookupProperty(depth0, "data") : depth0) != null
              ? lookupProperty(stack1, "dictionary")
              : stack1) != null
            ? lookupProperty(stack1, "pronunciation")
            : stack1,
          {
            name: "if",
            hash: {},
            fn: container.program(4, data, 0),
            inverse: container.noop,
            data: data,
            loc: {
              source: "popover.hbs",
              start: { line: 7, column: 4 },
              end: { line: 9, column: 11 },
            },
          },
        )) != null
          ? stack1
          : "") +
        "\n" +
        ((stack1 = lookupProperty(helpers, "if").call(
          alias1,
          (stack1 =
            (stack1 =
              depth0 != null ? lookupProperty(depth0, "data") : depth0) != null
              ? lookupProperty(stack1, "dictionary")
              : stack1) != null
            ? lookupProperty(stack1, "fl")
            : stack1,
          {
            name: "if",
            hash: {},
            fn: container.program(6, data, 0),
            inverse: container.noop,
            data: data,
            loc: {
              source: "popover.hbs",
              start: { line: 11, column: 4 },
              end: { line: 13, column: 11 },
            },
          },
        )) != null
          ? stack1
          : "") +
        "\n    <ul>\n" +
        ((stack1 = lookupProperty(helpers, "each").call(
          alias1,
          (stack1 =
            (stack1 =
              depth0 != null ? lookupProperty(depth0, "data") : depth0) != null
              ? lookupProperty(stack1, "dictionary")
              : stack1) != null
            ? lookupProperty(stack1, "shortdef")
            : stack1,
          {
            name: "each",
            hash: {},
            fn: container.program(8, data, 0),
            inverse: container.noop,
            data: data,
            loc: {
              source: "popover.hbs",
              start: { line: 16, column: 6 },
              end: { line: 18, column: 15 },
            },
          },
        )) != null
          ? stack1
          : "") +
        '    </ul>\n    \n    <a class="dictionary__more-link" href="' +
        container.escapeExpression(
          container.lambda(
            (stack1 =
              (stack1 =
                depth0 != null ? lookupProperty(depth0, "data") : depth0) !=
                null
                ? lookupProperty(stack1, "dictionary")
                : stack1) != null
              ? lookupProperty(stack1, "link")
              : stack1,
            depth0,
          ),
        ) +
        '" target="_blank">Find out more &raquo;</a>\n'
      );
    },
    2: function (container, depth0, helpers, partials, data) {
      var stack1,
        lookupProperty =
          container.lookupProperty ||
          function (parent, propertyName) {
            if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
              return parent[propertyName];
            }
            return undefined;
          };

      return (
        '    <h4 class="dictionary__header">' +
        container.escapeExpression(
          container.lambda(
            (stack1 =
              (stack1 =
                depth0 != null ? lookupProperty(depth0, "data") : depth0) !=
                null
                ? lookupProperty(stack1, "dictionary")
                : stack1) != null
              ? lookupProperty(stack1, "cons")
              : stack1,
            depth0,
          ),
        ) +
        "</h4>\n"
      );
    },
    4: function (container, depth0, helpers, partials, data) {
      var stack1,
        lookupProperty =
          container.lookupProperty ||
          function (parent, propertyName) {
            if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
              return parent[propertyName];
            }
            return undefined;
          };

      return (
        '    <h5 class="dictionary__pronunciation">[/' +
        container.escapeExpression(
          container.lambda(
            (stack1 =
              (stack1 =
                depth0 != null ? lookupProperty(depth0, "data") : depth0) !=
                null
                ? lookupProperty(stack1, "dictionary")
                : stack1) != null
              ? lookupProperty(stack1, "pronunciation")
              : stack1,
            depth0,
          ),
        ) +
        "/]</h5>\n"
      );
    },
    6: function (container, depth0, helpers, partials, data) {
      var stack1,
        lookupProperty =
          container.lookupProperty ||
          function (parent, propertyName) {
            if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
              return parent[propertyName];
            }
            return undefined;
          };

      return (
        '    <p class="dictionary__type">' +
        container.escapeExpression(
          container.lambda(
            (stack1 =
              (stack1 =
                depth0 != null ? lookupProperty(depth0, "data") : depth0) !=
                null
                ? lookupProperty(stack1, "dictionary")
                : stack1) != null
              ? lookupProperty(stack1, "fl")
              : stack1,
            depth0,
          ),
        ) +
        "</p>\n"
      );
    },
    8: function (container, depth0, helpers, partials, data) {
      return (
        "        <li>" +
        container.escapeExpression(container.lambda(depth0, depth0)) +
        "</li>\n"
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (container, depth0, helpers, partials, data) {
      var stack1,
        lookupProperty =
          container.lookupProperty ||
          function (parent, propertyName) {
            if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
              return parent[propertyName];
            }
            return undefined;
          };

      return (
        ((stack1 = lookupProperty(helpers, "if").call(
          depth0 != null ? depth0 : container.nullContext || {},
          (stack1 =
            (stack1 =
              depth0 != null ? lookupProperty(depth0, "data") : depth0) != null
              ? lookupProperty(stack1, "dictionary")
              : stack1) != null
            ? lookupProperty(stack1, "shortdef")
            : stack1,
          {
            name: "if",
            hash: {},
            fn: container.program(1, data, 0),
            inverse: container.noop,
            data: data,
            loc: {
              source: "popover.hbs",
              start: { line: 1, column: 2 },
              end: { line: 22, column: 9 },
            },
          },
        )) != null
          ? stack1
          : "") + "  "
      );
    },
    useData: true,
  });
  runtime$1.registerPartial("/_dictionary", Template$2);

  var Template$3 = runtime$1.template({
    1: function (container, depth0, helpers, partials, data) {
      return '<div disabled class="trjs-popover trjs-popover--dark">\n';
    },
    3: function (container, depth0, helpers, partials, data) {
      return '<div disabled class="trjs-popover">\n';
    },
    5: function (container, depth0, helpers, partials, data) {
      var stack1,
        lookupProperty =
          container.lookupProperty ||
          function (parent, propertyName) {
            if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
              return parent[propertyName];
            }
            return undefined;
          };

      return (
        '  <div class="dictionary fadeInAnimated">\n    <hr>\n' +
        ((stack1 = container.invokePartial(
          lookupProperty(partials, "/_dictionary"),
          depth0,
          {
            name: "/_dictionary",
            data: data,
            indent: "    ",
            helpers: helpers,
            partials: partials,
            decorators: container.decorators,
          },
        )) != null
          ? stack1
          : "") +
        "  </div>\n"
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (container, depth0, helpers, partials, data) {
      var stack1,
        helper,
        alias1 = depth0 != null ? depth0 : container.nullContext || {},
        lookupProperty =
          container.lookupProperty ||
          function (parent, propertyName) {
            if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
              return parent[propertyName];
            }
            return undefined;
          };

      return (
        "\n" +
        ((stack1 = lookupProperty(helpers, "if").call(
          alias1,
          depth0 != null ? lookupProperty(depth0, "dark") : depth0,
          {
            name: "if",
            hash: {},
            fn: container.program(1, data, 0),
            inverse: container.program(3, data, 0),
            data: data,
            loc: {
              source: "popover.hbs",
              start: { line: 2, column: 0 },
              end: { line: 6, column: 7 },
            },
          },
        )) != null
          ? stack1
          : "") +
        '\n  <div id="trjs-close">\n    <svg class="icon icon-cancel-circle">\n      <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>\n      <path d="M21 8l-5 5-5-5-3 3 5 5-5 5 3 3 5-5 5 5 3-3-5-5 5-5z"></path>\n    </svg>\n  </div>\n  \n  <h4 class="trjs__header fadeInAnimated">' +
        container.escapeExpression(
          ((helper =
            (helper =
              lookupProperty(helpers, "selected") ||
              (depth0 != null ? lookupProperty(depth0, "selected") : depth0)) !=
              null
              ? helper
              : container.hooks.helperMissing),
            typeof helper === "function"
              ? helper.call(alias1, {
                name: "selected",
                hash: {},
                data: data,
                loc: {
                  source: "popover.hbs",
                  start: { line: 15, column: 42 },
                  end: { line: 15, column: 56 },
                },
              })
              : helper),
        ) +
        '</h4>\n\n  <div class="wiki-summary fadeInAnimated">\n' +
        ((stack1 = container.invokePartial(
          lookupProperty(partials, "/_wikiSummary"),
          depth0,
          {
            name: "/_wikiSummary",
            data: data,
            indent: "    ",
            helpers: helpers,
            partials: partials,
            decorators: container.decorators,
          },
        )) != null
          ? stack1
          : "") +
        "\n" +
        ((stack1 = container.invokePartial(
          lookupProperty(partials, "/_wikiSearch"),
          depth0,
          {
            name: "/_wikiSearch",
            data: data,
            indent: "    ",
            helpers: helpers,
            partials: partials,
            decorators: container.decorators,
          },
        )) != null
          ? stack1
          : "") +
        "  </div>\n\n" +
        ((stack1 = lookupProperty(helpers, "if").call(
          alias1,
          (stack1 =
            (stack1 =
              depth0 != null ? lookupProperty(depth0, "data") : depth0) != null
              ? lookupProperty(stack1, "dictionary")
              : stack1) != null
            ? lookupProperty(stack1, "shortdef")
            : stack1,
          {
            name: "if",
            hash: {},
            fn: container.program(5, data, 0),
            inverse: container.noop,
            data: data,
            loc: {
              source: "popover.hbs",
              start: { line: 23, column: 2 },
              end: { line: 28, column: 9 },
            },
          },
        )) != null
          ? stack1
          : "") +
        "\n" +
        ((stack1 = container.invokePartial(
          lookupProperty(partials, "/_noresults"),
          depth0,
          {
            name: "/_noresults",
            data: data,
            indent: "  ",
            helpers: helpers,
            partials: partials,
            decorators: container.decorators,
          },
        )) != null
          ? stack1
          : "") +
        "\n</div>"
      );
    },
    usePartial: true,
    useData: true,
  });
  function PopoverTemplate(data, options, asString) {
    var html = Template$4(data, options);
    return asString || true ? html : $(html);
  }

  var Template$5 = runtime$1.template({
    compiler: [8, ">= 4.3.0"],
    main: function (container, depth0, helpers, partials, data) {
      return '<div class="trjs-toggle-inner"><label class="switch">\n  <input type="checkbox">\n  <span class="slider round"></span>\n</label></div>';
    },
    useData: true,
  });
  function ToggleTemplate(data, options, asString) {
    var html = Template$5(data, options);
    return asString || true ? html : $(html);
  }

  const Wikipedia = {
    baseUrl: "https://en.wikipedia.org/w/api.php?origin=*",
    baseRestApiUrl:
      "https://en.wikipedia.org/api/rest_v1/page/summary/Stack_Overflow",
    /**
     * Construct the Wikipedia route.
     * @return {String}
     */
    searchRoute: function (search) {
      const params = {
        action: "opensearch",
        search: encodeURIComponent(search),
        limit: "5",
        namespace: "0",
        format: "json",
      };

      let route = this.baseUrl;
      Object.keys(params).forEach((key) => {
        route += "&" + key + "=" + params[key];
      });
      return route;
    },

    queryRoute: function (text) {
      const params = {
        action: "query",
        prop: "extracts",
        exsentences: 2,
        format: "json",
        titles: text,
      };

      let route = this.baseUrl + "&exintro&explaintext";

      Object.keys(params).forEach((key) => {
        route += "&" + key + "=" + params[key];
      });

      return route;
    },

    summaryRoute: function (articleTitle) {
      return `https://en.wikipedia.org/api/rest_v1/page/summary/${articleTitle}`;
    },

    formattedSearchData: function (res) {
      let arr = [];
      for (let i = 0; i < res.data[1].length; i++) {
        arr.push({
          title: res.data[1][i],
          link: res.data[3][i],
        });
      }
      return arr;
    },
  };

  const MerriamWebsterDictionary = {
    baseUrl: "https://www.dictionaryapi.com/api/v3/references/collegiate/json/",
    /**
     * Construct the Merriam-Webster Dictionary route.
     * @return {String}
     */
    searchRoute: function (options = {}) {
      const params = {
        key: options.key,
      };

      let dictionaryRoute = `${this.baseUrl}/${encodeURIComponent(
        options.searchText,
      )}?`;
      Object.keys(params).forEach((key) => {
        dictionaryRoute += "&" + key + "=" + params[key];
      });
      return dictionaryRoute;
    },

    formattedData: function (res, text) {
      if (res.data.length > 0) {
        const firstResult = res.data[0];
        const middleDot = String.fromCharCode(0x00b7);
        const hwi = firstResult.hwi || null;
        const hw = hwi ? hwi.hw : null;
        const cons = hw ? hw.replace(/\*/g, middleDot) : "";

        const pronunciation =
          hwi && firstResult.hwi.prs ? firstResult.hwi.prs[0].mw : null;
        return {
          date: firstResult.date,
          fl: firstResult.fl,
          link: `https://www.merriam-webster.com/dictionary/${text}`,
          pronunciation,
          cons,
          shortdef: firstResult.shortdef,
        };
      }
      return {
        shortdef: null,
        date: null,
        fl: null,
        link: null,
      };
    },
  };

  const DEFAULT_APPROVED_TAGS = [
    "div",
    "p",
    "span",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "li",
    "pre",
    "b",
    "strong",
    "em",
  ];
  const DEFAULT_DISABLED_TAGS = ["input", "textarea", "code", "a"];

  const TextRevealer = function (options = {}) {
    this.options = options = Object.assign({}, options);

    let defaults = {
      delay: 500,
      approvedTags: DEFAULT_APPROVED_TAGS,
      disabledTags: DEFAULT_DISABLED_TAGS,
      wikipedia: false,
      merriamWebsterDictionary: "98175769-96b7-4a62-9e95-587b00a9eac2",
      skin: "light",
      maxTextCount: 3,
    };

    // Set default & user options
    for (let name in defaults) {
      !(name in options) && (options[name] = defaults[name]);
    }

    this.disabledTags = DEFAULT_DISABLED_TAGS;
    this.text = null;
    this.targetTag = null;
    this.isActive = false;
    this.searchTextCount = 0;
    this.ttsStarted = false;

    return {
      options: this.options,

      init: function () {
        /**
         * Remove the mobile device check to allow the script to run on all devices
         */
        window.addEventListener("DOMContentLoaded", () => {
          this.addWebFont();
        });

        window.addEventListener("load", () => {
          // Set isActive to true by default
          this.isActive = true;

          document.body.addEventListener("click", (event) => {
            const textRevealerEl = document.querySelector(".trjs");
            if (
              textRevealerEl &&
              this.text &&
              !textRevealerEl.contains(event.target)
            ) {
              this.closePopover();
            } else {
              this.targetTag = event.target.localName;
            }
          });

          /**
           * Use touchend event for touch devices in addition to mouseup
           */
          document.addEventListener('touchend', this.debounced(
            options.delay,
            this.handleTextReveal.bind(this)
          ));
          document.onmouseup = this.debounced(
            options.delay,
            this.handleTextReveal.bind(this)
          );
          if (!document.all) document.captureEvents(Event.MOUSEUP);
        });

        // Add URL change listener
        this.addUrlChangeListener();

        // Call /init method on initial load
        this.callInitMethod();
      },

      /**
       * Adding Google fonts with Web Font Loader script to the page.
       *
       * @ref https://github.com/typekit/webfontloader
       */
      addWebFont: function () {
        window.WebFontConfig = {
          google: {
            families: ['Inter:400,600', 'Open+Sans:400,300,700', 'Crimson+Text:400,700'],
          },
        };

        (function (d) {
          var wf = d.createElement("script"),
            s = d.scripts[0];
          wf.src =
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js";
          wf.async = true;
          s.parentNode.insertBefore(wf, s);
        })(document);
      },

      /**
       *  Delay execution of provided function.
       * @param {number}    Timeout value.
       * @param {function}  Callback after timout has completed.
       * @return {function} Returns callback.
       */
      debounced: function (delay, fn) {
        let timerId;
        return function (...args) {
          if (timerId) {
            clearTimeout(timerId);
          }
          timerId = setTimeout(() => {
            fn(...args);
            timerId = null;
          }, delay);
        };
      },

      /**
       * Getting the selected text string, fetching the API results, and displaying the popover.
       */
      handleTextReveal: function (event) {
        if (!this.isActive) return;

        try {
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);

            // Check if the selection is within any existing popover or copy button
            const existingPopovers = document.querySelectorAll('.trjs-popover-wrapper, #trjs-copy');
            for (let popover of existingPopovers) {
              if (popover.contains(range.commonAncestorContainer) ||
                popover.contains(range.startContainer) ||
                popover.contains(range.endContainer)) {
                // Selection is within a popover or copy button, do not create a new one
                return;
              }
            }

            const fragment = range.cloneContents();
            this.text = this.sanitizeAndPreserveHTML(fragment);

            if (this.text) {
              this.displayPopover();
            }
          }
        } catch (error) {
          console.error("handleTextReveal error: ", error);
        }
      },

      sanitizeAndPreserveHTML: function (fragment) {
        const div = document.createElement("div");
        div.appendChild(fragment.cloneNode(true));

        // Remove any script tags
        const scripts = div.getElementsByTagName("script");
        for (let i = scripts.length - 1; i >= 0; i--) {
          scripts[i].parentNode.removeChild(scripts[i]);
        }

        // Preserve allowed tags
        const allowedTags = [
          "strong",
          "em",
          "b",
          "i",
          "u",
          "a",
          "p",
          "br",
          "ul",
          "ol",
          "li",
        ];
        const elements = div.getElementsByTagName("*");
        for (let i = elements.length - 1; i >= 0; i--) {
          const element = elements[i];
          if (!allowedTags.includes(element.tagName.toLowerCase())) {
            element.outerHTML = element.innerHTML;
          }
        }

        return div.innerHTML;
      },

      /**
       * Utility function using Fetch API to request route data.
       * @param {String} name
       * @param {String} route
       */
      fetchRoute: function (name, route) {
        const routePromise = fetch(route)
          .then((res) => res.json())
          .then((data) => {
            return { data, route: name };
          });
        return routePromise;
      },

      /**
       * Fetching data from various APIs with the selected string. Combining the routes into
       * a single fetch request.
       * @param {String}   searchText
       * @return {Object}  Data from fetch requests.
       */
      handleFetch: function (searchText) {
        return this.callQueryMethod(searchText);
      },

      /**
       * Construct the popover element and add it to the DOM.
       * @param {Object} - Results of the Wikipedia, Dictionary, etc. call.
       */
      displayPopover: function () {
        // Remove any existing popovers
        this.removeExistingPopovers();

        const popover = document.createElement("div");
        popover.classList.add("trjs-popover-wrapper");
        popover.innerHTML = `
          <div class="trjs-popover ${options.skin === "dark" ? "trjs-popover--dark" : ""}">
            <div class="trjs-popover__header">
              <div class="trjs__header"></div>
              <div id="trjs-close">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </div>
            </div>
            <div class="trjs__context"></div>
            <div class="trjs__content">
              <div class="trjs__loading">
                <div class="trjs__loading-spinner"></div>
                <span>Generating insights...</span>
              </div>
            </div>
            <div class="trjs__actions">
              <div class="trjs__action-btn" id="trjs-copy">
                <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </div>
              <div class="trjs__action-btn" id="trjs-share">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
              </div>
              <div class="trjs__action-btn" id="trjs-tts">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
            </div>
          </div>
        `;

        const selection = window.getSelection();
        if (selection.rangeCount) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          // Set up the popover
          document.body.appendChild(popover);

          // Set the context in the popover
          const contextDiv = popover.querySelector(".trjs__context");
          const fullContext = this.getFullContext(this.text);
          contextDiv.innerHTML = `<p><strong>Context:</strong> ${fullContext}</p>`;

          let contentP; // Declare contentP outside the fetch promise
          let fetchCompleted = false; // Add this flag

          // Fetch and display the API result
          this.handleFetch(this.text)
            .then(async (response) => {
              const reader = response.body.getReader();
              const decoder = new TextDecoder("utf-8");
              const contentDiv = popover.querySelector(".trjs__content");
              contentDiv.innerHTML = '<p class="trjs__response"></p>';
              contentP = contentDiv.querySelector('.trjs__response');

              let fullResponse = '';
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                fullResponse += chunk;
                contentP.innerHTML = fullResponse;

                // Animate the typing effect
                contentP.scrollTop = contentP.scrollHeight;
              }
              fetchCompleted = true; // Set the flag when fetch is complete
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              const contentDiv = popover.querySelector(".trjs__content");
              contentDiv.innerHTML =
                "<p>Error fetching data. Please try again.</p>";
              fetchCompleted = true; // Set the flag even if there's an error
            })
            .finally(() => {
              // Remove loading indicator
              popover.querySelector(".trjs__loading").remove();
            });

          this.positionPopover(rect, popover);

          document
            .getElementById("trjs-close")
            .addEventListener("click", (e) => {
              e.stopPropagation();
              e.preventDefault();
              this.closePopover(popover);
            });

          // Update the copy functionality
          document.getElementById("trjs-copy").addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (fetchCompleted && contentP) {
              const content = contentP.textContent;
              navigator.clipboard.writeText(content).then(() => {
                const copyButton = e.currentTarget;
                copyButton.classList.add('copied');
                setTimeout(() => {
                  copyButton.classList.remove('copied');
                }, 5000);
              });
            }
          }, true);

          document.getElementById("trjs-share").addEventListener("click", () => {
            const content = popover.querySelector(".trjs__response").textContent;
            const shareData = {
              title: "Shared Insight",
              text: content,
              url: window.location.href
            };
            navigator.share(shareData).catch((error) => console.log('Error sharing', error));
          });

          const ttsButton = document.getElementById("trjs-tts");
          ttsButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            if (this.isPlaying) {
              this.stopTextToSpeech();
            } else {
              this.textToSpeech(contentP.textContent);
            }
          });

          // Add click event listener to close popover when clicking outside
          setTimeout(() => {
            document.addEventListener(
              "click",
              this.handleOutsideClick.bind(this),
            );
          }, 0);
        }
      },

      removeExistingPopovers: function () {
        const existingPopovers = document.querySelectorAll(
          ".trjs-popover-wrapper",
        );
        existingPopovers.forEach((popover) => {
          popover.remove();
        });
      },

      closePopover: function (popover) {
        // Stop TTS if it's playing
        this.stopTextToSpeech();

        // Remove the popover
        if (popover) {
          popover.style.opacity = '0';
          popover.style.transform = 'translateY(10px)';

          setTimeout(() => {
            popover.remove();
          }, 300);
        }

        // Remove the event listener for outside clicks
        document.removeEventListener("click", this.handleOutsideClick);

        this.text = null;
        this.targetTag = null;
        this.ttsStarted = false;
        this.audio = null; // Reset audio when closing popover
      },

      handleOutsideClick: function (event) {
        const popover = document.querySelector(".trjs-popover-wrapper");
        if (popover && !popover.contains(event.target)) {
          this.removeExistingPopovers();
        }
      },

      positionPopover: function (rect, popover) {
        const ww = Math.max(
          document.documentElement.clientWidth,
          window.innerWidth || 0
        );
        const wh = Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        );

        popover.style.position = "absolute";
        popover.style.maxWidth = "300px"; // Set a fixed max-width
        popover.style.maxHeight = "600px"; // Set a fixed max-height
        popover.style.overflowY = "auto"; // Make it scrollable
        popover.style.padding = "15px"; // Add padding

        // Position the popover next to the highlighted text
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        let left = rect.right + scrollX;
        let top = rect.top + scrollY;

        // Adjust position if it goes off-screen
        if (left + popover.offsetWidth > ww + scrollX) {
          left = rect.left + scrollX - popover.offsetWidth;
        }

        if (top + popover.offsetHeight > wh + scrollY) {
          top = wh + scrollY - popover.offsetHeight;
        }

        popover.style.left = `${Math.max(0, left)}px`;
        popover.style.top = `${Math.max(0, top)}px`;

        popover.style.opacity = '0';
        popover.style.transform = 'translateY(10px)';

        setTimeout(() => {
          popover.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          popover.style.opacity = '1';
          popover.style.transform = 'translateY(0)';
        }, 50);
      },

      showToast: function (message) {
        const toast = document.createElement("div");
        toast.classList.add("trjs-toast");
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.classList.add("trjs-toast--visible");
        }, 100);

        setTimeout(() => {
          toast.classList.remove("trjs-toast--visible");
          setTimeout(() => toast.remove(), 300);
        }, 3000);
      },

      addUrlChangeListener: function () {
        let lastUrl = location.href;
        new MutationObserver(() => {
          const url = location.href;
          if (url !== lastUrl) {
            lastUrl = url;
            this.callInitMethod();
            this.callUpsertMethod(url);
          }
        }).observe(document, { subtree: true, childList: true });
      },

      callInitMethod: function () {
        fetch("http://127.0.0.1:8000/init", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            index_name: "quickstart",
            master_prompt: `
            You are a helpful assistant tasked with interpreting and explaining the meaning of a given text. Your goal is to provide a clear, concise, and accurate explanation of what the text means.

            To complete this task, please follow these steps:

            1. Carefully read and analyze the provided text.
            2. Consider the context, tone, and any potential figurative language or idioms used.
            3. Identify the main idea or message of the text.
            4. Look for any supporting details or examples that help clarify the meaning.
            5. Consider any potential implications or subtext that may not be explicitly stated.

            Now, provide your interpretation of what the text means. Your explanation should be:
            - Clear and easy to understand
            - Comprehensive, covering all important aspects of the text
            - Supported by evidence from the text itself
            - Objective, avoiding personal opinions unless specifically relevant to the interpretation

            Remember to be thorough in your analysis while also being concise in your explanation. If there are multiple possible interpretations, mention them and explain why one might be more likely than others. If the text is ambiguous or unclear in any way, acknowledge this in your interpretation.

            Make your response very short and concise (1-2 sentences). If you cannot provide an interpretation based on the given text or query, simply respond with "I don't know" or "I don't have enough information to interpret this text".
            `,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Init method called successfully:", data);
            this.callUpsertMethod(location.href);
          })
          .catch((error) => {
            console.error("Error calling init method:", error);
          });
      },

      callUpsertMethod: function (url) {
        fetch("http://127.0.0.1:8000/upsert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documents: url,
            source_type: "web",
            metadata: {},
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Upsert method called successfully:", data);
          })
          .catch((error) => {
            console.error("Error calling upsert method:", error);
          });
      },

      callQueryMethod: function (query) {
        return fetch("http://127.0.0.1:8000/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            You are tasked with interpreting a given query in light of provided context. Your goal is to provide a concise interpretation in one or two sentences.

            Here is the immediate context (sentence or paragraph) containing the query:
            <immediate_context>
            ${this.getFullContext(query)}
            </immediate_context>

            Additional relevant context from the document will be provided after this prompt by the backend system. Please consider both the immediate context and the additional context when interpreting the query.

            Please interpret this query considering all the given context. Your interpretation should be concise and to the point. Focus on the main ideas and implications of the query in relation to the full context provided.

            Provide your interpretation in exactly one or two sentences. Make sure your response is clear, concise, coherent, and captures the essence of the query in light of all the context. Answer in a clear and natural way.

            `,
            filter: {},
            k: 5,
            stream: true, // Enable streaming
          }),
        });
      },

      getFullContext: function (query) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const startNode = range.startContainer;
          const endNode = range.endContainer;

          // Find the common ancestor of the start and end nodes
          let commonAncestor = range.commonAncestorContainer;
          while (commonAncestor && commonAncestor.nodeType !== Node.ELEMENT_NODE) {
            commonAncestor = commonAncestor.parentNode;
          }

          if (commonAncestor) {
            // If the selected text is short, return the entire paragraph
            if (query.length < 50) {
              return commonAncestor.innerText || commonAncestor.textContent;
            } else {
              // For longer selections, return the selected text plus surrounding sentences
              const fullText = commonAncestor.innerText || commonAncestor.textContent;
              const sentences = fullText.match(/[^.!?]+[.!?]+/g) || [];
              const selectedTextIndex = sentences.findIndex(sentence => sentence.includes(query));

              if (selectedTextIndex !== -1) {
                const start = Math.max(0, selectedTextIndex - 1);
                const end = Math.min(sentences.length, selectedTextIndex + 2);
                return sentences.slice(start, end).join(' ');
              }
            }
          }
        }
        return query; // Fallback to just the query if we can't get more context
      },

      textToSpeech: function (text) {
        if (this.isPlaying) {
          this.stopTextToSpeech();
          return;
        }

        const apiKey = 'sk_b9ceb4c9a23daf76bb6acbe19874bb1ccc485de8a35097a8';
        const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Default voice ID

        if (!this.audio) {
          fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
            method: 'POST',
            headers: {
              'Accept': 'audio/mpeg',
              'Content-Type': 'application/json',
              'xi-api-key': apiKey
            },
            body: JSON.stringify({
              text: text,
              model_id: 'eleven_monolingual_v1',
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5
              }
            })
          })
            .then(response => response.blob())
            .then(blob => {
              const url = URL.createObjectURL(blob);
              this.audio = new Audio(url);
              this.playAudio();
            })
            .catch(error => {
              console.error('Error calling ElevenLabs TTS API:', error);
              this.showToast('Error generating speech. Please try again.');
            });
        } else {
          this.playAudio();
        }
      },

      playAudio: function () {
        this.audio.play();
        this.isPlaying = true;
        this.updateTTSButton();

        this.audio.onended = () => {
          this.isPlaying = false;
          this.updateTTSButton();
        };
      },

      stopTextToSpeech: function () {
        if (this.audio && this.isPlaying) {
          this.audio.pause();
          this.audio.currentTime = 0;
          this.isPlaying = false;
          this.updateTTSButton();
        }
      },

      updateTTSButton: function () {
        const ttsButton = document.getElementById("trjs-tts");
        if (this.isPlaying) {
          ttsButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
        } else {
          ttsButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        }
      },
    };
  };

  return TextRevealer;
})();
