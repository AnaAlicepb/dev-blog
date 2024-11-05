(function (global) {
  if (global.document) { // Verifica se existe o documento no escopo global
    var doc = global.document; // Atribui o documento à variável 'doc'

    // Adiciona métodos de suporte para querySelectorAll, getElementsByClassName, etc.
    if (!doc.querySelectorAll) { // Se querySelectorAll não estiver disponível
      doc.querySelectorAll = function (selector) { // Define querySelectorAll manualmente
        var style = doc.createElement("style"); // Cria uma tag <style>
        var elements = []; // Array para armazenar elementos encontrados
        doc.documentElement.firstChild.appendChild(style); // Adiciona o estilo no início do documento
        doc._qsa = []; // Inicializa a variável '_qsa' no documento
        style.styleSheet.cssText = selector + "{x-qsa:expression(document._qsa && document._qsa.push(this))}"; // Cria expressão para selecionar elementos
        global.scrollBy(0, 0); // Força a renderização
        style.parentNode.removeChild(style); // Remove o estilo após execução

        while (doc._qsa.length) { // Enquanto houver elementos na '_qsa'
          var element = doc._qsa.shift(); // Remove o primeiro elemento da '_qsa'
          element.style.removeAttribute("x-qsa"); // Remove o atributo 'x-qsa' do elemento
          elements.push(element); // Adiciona o elemento ao array 'elements'
        }

        doc._qsa = null; // Limpa a '_qsa' do documento
        return elements; // Retorna os elementos encontrados
      };
    }

    if (!doc.querySelector) { // Se querySelector não estiver disponível
      doc.querySelector = function (selector) {
        var elements = doc.querySelectorAll(selector); // Usa querySelectorAll
        return elements.length ? elements[0] : null; // Retorna o primeiro elemento ou null
      };
    }

    if (!doc.getElementsByClassName) { // Se getElementsByClassName não estiver disponível
      doc.getElementsByClassName = function (className) {
        return doc.querySelectorAll("." + className); // Usa querySelectorAll para buscar por classe
      };
    }

    // Adiciona suporte para Object.keys
    if (!Object.keys) { // Se Object.keys não estiver disponível
      Object.keys = function (obj) {
        if (obj !== Object(obj)) throw new TypeError("Object.keys called on non-object"); // Verifica se é um objeto
        var keys = []; // Array para armazenar chaves
        for (var key in obj) { // Itera sobre as propriedades do objeto
          if (Object.prototype.hasOwnProperty.call(obj, key)) keys.push(key); // Adiciona chave se for própria do objeto
        }
        return keys; // Retorna as chaves
      };
    }

    // Adiciona suporte para Array.prototype.forEach
    if (!Array.prototype.forEach) { // Se forEach não estiver disponível
      Array.prototype.forEach = function (callback, thisArg) {
        if (this == null) throw new TypeError("Array.prototype.forEach called on null or undefined"); // Verifica se é nulo ou indefinido
        var O = Object(this); // Converte para objeto
        var len = O.length >>> 0; // Obtém o comprimento do array
        if (typeof callback !== "function") throw new TypeError(callback + " is not a function"); // Verifica se é uma função

        var T = thisArg || undefined; // Define 'this' do callback
        for (var i = 0; i < len; i++) { // Itera sobre o array
          if (i in O) callback.call(T, O[i], i, O); // Chama o callback para cada elemento
        }
      };
    }

    // Suporte para atob e btoa
    (function () {
      var b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; // Define caracteres base64

      global.atob = global.atob || function (input) { // Se atob não estiver disponível
        input = String(input).replace(/\s/g, ""); // Remove espaços em branco
        if (input.length % 4 === 1) throw new Error("InvalidCharacterError"); // Verifica validade do input

        var output = ""; // Armazena a saída decodificada
        var buffer;
        for (var bc = 0, bs, buffer, idx = 0; (buffer = input.charAt(idx++)); ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
          ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)))) // Concatena caracteres decodificados
          : 0) {
          buffer = b64chars.indexOf(buffer); // Converte caractere base64 para índice
        }
        return output; // Retorna o texto decodificado
      };

      global.btoa = global.btoa || function (input) { // Se btoa não estiver disponível
        input = String(input); // Converte entrada para string
        var output = ""; // Armazena a saída codificada
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4; // Variáveis para caracteres e codificação
        var i = 0;
        while (i < input.length) { // Itera sobre os caracteres da string
          chr1 = input.charCodeAt(i++); // Obtém código do primeiro caractere
          chr2 = input.charCodeAt(i++); // Obtém código do segundo caractere
          chr3 = input.charCodeAt(i++); // Obtém código do terceiro caractere

          enc1 = chr1 >> 2; // Primeira parte da codificação
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4); // Segunda parte
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6); // Terceira parte
          enc4 = chr3 & 63; // Quarta parte

          if (isNaN(chr2)) enc3 = enc4 = 64; // Se chr2 não for número, enc3 e enc4 são 64 (padding)
          else if (isNaN(chr3)) enc4 = 64; // Se chr3 não for número, enc4 é 64 (padding)

          output += b64chars.charAt(enc1) + b64chars.charAt(enc2) + b64chars.charAt(enc3) + b64chars.charAt(enc4); // Concatena caracteres codificados
        }
        return output; // Retorna o texto codificado
      };
    })();

    // Adiciona suporte para performance.now()
    (function () {
      if ("performance" in global === false) global.performance = {}; // Se performance não estiver disponível, cria um objeto vazio

      Date.now = Date.now || function () {
        return new Date().getTime(); // Define Date.now se não estiver disponível
      };

      if ("now" in global.performance === false) { // Se performance.now não estiver disponível
        var nowOffset = Date.now(); // Define o offset atual
        if (performance.timing && performance.timing.navigationStart) { // Ajusta o offset com o tempo de navegação
          nowOffset = performance.timing.navigationStart;
        }

        global.performance.now = function () {
          return Date.now() - nowOffset; // Retorna o tempo atual subtraído do offset
        };
      }
    })();

    // Adiciona suporte para requestAnimationFrame e cancelAnimationFrame
    if (!global.requestAnimationFrame) {
      global.requestAnimationFrame = function (callback) {
        return setTimeout(callback, 1000 / 60); // Simula 60 frames por segundo
      };
      global.cancelAnimationFrame = function (id) {
        clearTimeout(id); // Cancela a execução do frame
      };
    }
  }
})(this);

// Adiciona funcionalidade de toggle para o menu responsivo
document.addEventListener('DOMContentLoaded', function() { // Espera o carregamento completo do DOM
  const toggler = document.querySelector('.navbar-toggler'); // Seleciona o botão do toggle
  const navCollapse = document.querySelector('#navbarNav'); // Seleciona o menu de navegação

  if (toggler && navCollapse) { // Verifica se os elementos existem na página
    toggler.addEventListener('click', function() { // Adiciona evento de clique ao botão do toggle
      navCollapse.classList.toggle('show'); // Alterna a classe 'show' para exibir/ocultar o menu
    });
  }
});
document.addEventListener('DOMContentLoaded', function () {
  var carouselElement = document.getElementById('carouselExampleCaptions');
  if (carouselElement) {
    var carousel = new bootstrap.Carousel(carouselElement, {
      interval: 2000, // Tempo em milissegundos entre os slides (ex.: 2000 ms = 2 segundos)
      ride: 'carousel', // Inicia automaticamente o carrossel
      pause: 'hover', // Pausa ao passar o mouse
      wrap: true // Retorna ao primeiro slide após o último
    });
  }
});
