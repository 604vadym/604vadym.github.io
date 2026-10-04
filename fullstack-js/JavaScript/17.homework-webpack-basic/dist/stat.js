/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/statistics.js"
/*!***************************!*\
  !*** ./src/statistics.js ***!
  \***************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\nfunction createStatistics() {\r\n    let counter = 0;\r\n    let isDestroyed = false;\r\n    const listener = () => counter++;\r\n\r\n    document.addEventListener(\"click\", listener);\r\n\r\n    return {\r\n        destroy() {\r\n            $(document).off(\"click\", listener);\r\n            isDestroyed = true;\r\n            return \"Destroyed\";\r\n        },\r\n\r\n        getClicks() {\r\n            if (isDestroyed) return \"Statistics is destroyed\";\r\n\r\n            return counter;\r\n        },\r\n    };\r\n}\r\n\r\nwindow.statistics = createStatistics();\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc3RhdGlzdGljcy5qcyIsIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLzE3LmhvbWV3b3JrLXdlYnBhY2stYmFzaWMvLi9zcmMvc3RhdGlzdGljcy5qcz8xMzEzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGNyZWF0ZVN0YXRpc3RpY3MoKSB7XHJcbiAgICBsZXQgY291bnRlciA9IDA7XHJcbiAgICBsZXQgaXNEZXN0cm95ZWQgPSBmYWxzZTtcclxuICAgIGNvbnN0IGxpc3RlbmVyID0gKCkgPT4gY291bnRlcisrO1xyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsaXN0ZW5lcik7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkZXN0cm95KCkge1xyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vZmYoXCJjbGlja1wiLCBsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgIGlzRGVzdHJveWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIFwiRGVzdHJveWVkXCI7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0Q2xpY2tzKCkge1xyXG4gICAgICAgICAgICBpZiAoaXNEZXN0cm95ZWQpIHJldHVybiBcIlN0YXRpc3RpY3MgaXMgZGVzdHJveWVkXCI7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY291bnRlcjtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufVxyXG5cclxud2luZG93LnN0YXRpc3RpY3MgPSBjcmVhdGVTdGF0aXN0aWNzKCk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/statistics.js\n\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	const __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	let __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/statistics.js"](0,__webpack_exports__,__webpack_require__);
/******/ 	
/******/ })()
;