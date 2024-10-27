/*!
 * Holder - client side image placeholders
 * Version 2.9.4+cabil
 * © 2016 Ivan Malopinsky - http://imsky.co
 *
 * Site:     http://holderjs.com
 * Issues:   https://github.com/imsky/holder/issues
 * License:  MIT
 */

(function (global) {
    if (global.document) {
      var doc = global.document;

      // Adiciona métodos de suporte para querySelectorAll, getElementsByClassName, etc.
      if (!doc.querySelectorAll) {
        doc.querySelectorAll = function (selector) {
          var style = doc.createElement("style");
          var elements = [];
          doc.documentElement.firstChild.appendChild(style);
          doc._qsa = [];
          style.styleSheet.cssText =
            selector + "{x-qsa:expression(document._qsa && document._qsa.push(this))}";
          global.scrollBy(0, 0);
          style.parentNode.removeChild(style);

          while (doc._qsa.length) {
            var element = doc._qsa.shift();
            element.style.removeAttribute("x-qsa");
            elements.push(element);
          }

          doc._qsa = null;
          return elements;
        };
      }

      if (!doc.querySelector) {
        doc.querySelector = function (selector) {
          var elements = doc.querySelectorAll(selector);
          return elements.length ? elements[0] : null;
        };
      }

      if (!doc.getElementsByClassName) {
        doc.getElementsByClassName = function (className) {
          return doc.querySelectorAll("." + className);
        };
      }

      // Adiciona suporte para Object.keys
      if (!Object.keys) {
        Object.keys = function (obj) {
          if (obj !== Object(obj)) throw new TypeError("Object.keys called on non-object");
          var keys = [];
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) keys.push(key);
          }
          return keys;
        };
      }

      // Adiciona suporte para Array.prototype.forEach
      if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (callback, thisArg) {
          if (this == null) throw new TypeError("Array.prototype.forEach called on null or undefined");
          var O = Object(this);
          var len = O.length >>> 0;
          if (typeof callback !== "function") throw new TypeError(callback + " is not a function");

          var T = thisArg || undefined;
          for (var i = 0; i < len; i++) {
            if (i in O) callback.call(T, O[i], i, O);
          }
        };
      }

      // Suporte para atob e btoa
      (function () {
        var b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        global.atob = global.atob || function (input) {
          input = String(input).replace(/\s/g, "");
          if (input.length % 4 === 1) throw new Error("InvalidCharacterError");

          var output = "";
          var buffer;
          for (var bc = 0, bs, buffer, idx = 0; (buffer = input.charAt(idx++)); ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
            ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
            : 0) {
            buffer = b64chars.indexOf(buffer);
          }
          return output;
        };

        global.btoa = global.btoa || function (input) {
          input = String(input);
          var output = "";
          var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
          var i = 0;
          while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) enc3 = enc4 = 64;
            else if (isNaN(chr3)) enc4 = 64;

            output += b64chars.charAt(enc1) + b64chars.charAt(enc2) + b64chars.charAt(enc3) + b64chars.charAt(enc4);
          }
          return output;
        };
      })();

      // Adiciona suporte para performance.now()
      (function () {
        if ("performance" in global === false) global.performance = {};

        Date.now = Date.now || function () {
          return new Date().getTime();
        };

        if ("now" in global.performance === false) {
          var nowOffset = Date.now();
          if (performance.timing && performance.timing.navigationStart) {
            nowOffset = performance.timing.navigationStart;
          }

          global.performance.now = function () {
            return Date.now() - nowOffset;
          };
        }
      })();

      // Adiciona suporte para requestAnimationFrame e cancelAnimationFrame
      if (!global.requestAnimationFrame) {
        global.requestAnimationFrame = function (callback) {
          return setTimeout(callback, 1000 / 60);
        };
        global.cancelAnimationFrame = function (id) {
          clearTimeout(id);
        };
      }
    }
  })(this);

  // Holder.js main logic
  (function (global) {
    var Holder = {
      version: "2.9.4",
      // Configurações iniciais do Holder.js
      settings: {
        domain: "holder.js",
        themes: {
          gray: { bg: "#EEEEEE", fg: "#AAAAAA" },
          social: { bg: "#3a5a97", fg: "#FFFFFF" },
        },
      },

      // Função para adicionar um tema ao Holder.js
      addTheme: function (name, settings) {
        if (name && settings) {
          Holder.settings.themes[name] = settings;
        }
        return Holder;
      },

      // Função para inicializar imagens com placeholders
      run: function (options) {
        options = options || {};
        var images = document.querySelectorAll(options.images || "img");

        images.forEach(function (img) {
          var src = img.getAttribute("data-src");
          if (src && src.indexOf(Holder.settings.domain) !== -1) {
            img.src = "https://via.placeholder.com/150"; // Exemplo de placeholder
          }
        });
      }
    };

    // Exporta o Holder.js para o escopo global
    global.Holder = Holder;
  })(this);

  // Inicializa o Holder.js
  document.addEventListener("DOMContentLoaded", function () {
    Holder.run({ images: "img" });
  });
