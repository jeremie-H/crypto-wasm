"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkcreate_wasm_app"] = self["webpackChunkcreate_wasm_app"] || []).push([["index_js"],{

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var crypto_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto-wasm */ \"./node_modules/crypto-wasm/crypto_wasm_bg.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([crypto_wasm__WEBPACK_IMPORTED_MODULE_0__]);\ncrypto_wasm__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\ndocument.querySelector('#encrypt-button').addEventListener('click', function(event) {\n  let clef = document.getElementById('wasm-enc-key').value;\n  let message = document.getElementById('wasm-enc-message').value;\n  crypto_wasm__WEBPACK_IMPORTED_MODULE_0__.encrypt(document, { message: message, key: clef });\n  \n});\n\ndocument.querySelector('#decrypt-button').addEventListener('click', function(event) {\n    let key = document.getElementById('wasm-dec-key').value;\n    let nonce = document.getElementById('wasm-dec-nonce').value;\n    let encoded = document.getElementById('wasm-dec-encoded').value;\n    document.getElementById('wasm-dec-message').innerText=\"... decoding ...\";\n    crypto_wasm__WEBPACK_IMPORTED_MODULE_0__.decrypt(document.getElementById('wasm-dec-message'), { encoded: encoded, key: key, nonce: nonce });\n  });\n\n\n/**\n * copy text into clipboard\n * @param {text} text to copy in clipboard\n * @returns \n */\nfunction copyTextToClipboard(text) {\n    if (!navigator.clipboard) {\n        fallbackCopyTextToClipboard(text);\n        return;\n    }\n    navigator.clipboard.writeText(text).then(function() {\n        //console.log('Async: Copying to clipboard was successful!');\n    }, function(err) {\n        console.error('Async: Could not copy text: ', err);\n    });\n}\n\nvar copyNonce = document.querySelector('.js-copy-nonce-btn'),\n    copyEncoded = document.querySelector('.js-copy-encoded-btn'),\n    copyDecoded = document.querySelector('.js-copy-decoded-btn');\n\ncopyNonce.addEventListener('click', function(event) {\n    copyTextToClipboard(document.querySelector('.result_nonce').innerText);\n});\n\ncopyEncoded.addEventListener('click', function(event) {\n    copyTextToClipboard(document.querySelector('.result_encoded').innerText);\n});\n\ncopyDecoded.addEventListener('click', function(event) {\n    copyTextToClipboard(document.querySelector('.result_decoded').innerText);\n});\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://create-wasm-app/./index.js?");

/***/ })

}]);