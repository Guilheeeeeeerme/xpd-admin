/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/workers/dmec-chart.worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/workers/dmec-chart.worker.ts":
/*!******************************************!*\
  !*** ./src/workers/dmec-chart.worker.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var worker;
(function (worker) {
    var d3;
    (function (d3) {
        var dmec;
        (function (dmec) {
            const ctx = self;
            ctx.addEventListener('message', (event) => {
                const data = event.data;
                try {
                    data.zoomStartAt = new Date(data.zoomStartAt).getTime();
                    data.zoomEndAt = new Date(data.zoomEndAt).getTime();
                }
                catch (error) {
                    console.error(error);
                }
                const exclude = (point) => {
                    return point.x >= data.zoomStartAt && point.x <= data.zoomEndAt;
                };
                const overflowPoints = (tracks, points) => {
                    const result = {};
                    tracks.map((track) => {
                        try {
                            points[track.param] = points[track.param].filter(exclude);
                            result[track.param] = handleOverflow(points[track.param], track);
                        }
                        catch (error) {
                            // faça nada
                        }
                    });
                    return result;
                };
                const handleOverflow = (points, track) => {
                    const result = [];
                    let distance = 0;
                    let lastPoint = null;
                    distance = Math.abs(track.max - track.min);
                    points.map((point) => {
                        const empty = {
                            x: point.x,
                            y: null,
                            actual: null,
                        };
                        if (point.y != null) {
                            point.overflow = 0;
                            let tempPoint = null;
                            while (point.y < track.min) {
                                tempPoint = JSON.parse(JSON.stringify(point));
                                point.overflow++;
                                point.y += distance;
                            }
                            while (point.y > track.max) {
                                tempPoint = JSON.parse(JSON.stringify(point));
                                point.overflow--;
                                point.y -= distance;
                            }
                            if (lastPoint != null && lastPoint.overflow !== point.overflow) {
                                if (tempPoint) {
                                    result.push(tempPoint);
                                }
                                result.push(empty);
                            }
                            lastPoint = point;
                        }
                        else {
                            lastPoint = null;
                        }
                        result.push(point);
                    });
                    return result;
                };
                const getParamPointAVL = (timestamp, param, oldPoints, newPoints) => {
                    return new Promise((resolve, reject) => {
                        let points = [];
                        if (newPoints &&
                            newPoints[param] &&
                            newPoints[param].length) {
                            points = newPoints[param];
                        }
                        if (oldPoints &&
                            oldPoints[param] &&
                            oldPoints[param].length) {
                            points = [...oldPoints[param], ...points];
                        }
                        while (points && points.length > 1) {
                            const half = Math.ceil(points.length / 2);
                            const firstHalf = points.slice(0, half);
                            const lastHalf = points.slice(-1 * half);
                            if (lastHalf &&
                                lastHalf.length &&
                                timestamp > lastHalf[0].x) {
                                points = lastHalf;
                            }
                            else {
                                points = firstHalf;
                            }
                        }
                        resolve({
                            param: param,
                            point: points[0] || null,
                        });
                    });
                };
                const readingsToPoints = (readings, tracks) => {
                    const points = {};
                    const preparePoints = (reading) => {
                        const convertToXY = (track) => {
                            const xyPoint = {
                                x: reading.timestamp,
                                y: reading[track.param] || null,
                                actual: reading[track.param] || null,
                            };
                            if (!points[track.param]) {
                                points[track.param] = [];
                            }
                            // points[track.param].push(xyPoint);
                            if (points[track.param].length >= 2 &&
                                points[track.param][points[track.param].length - 1].y === xyPoint.y &&
                                points[track.param][points[track.param].length - 2].y === xyPoint.y) {
                                points[track.param][points[track.param].length - 1] = xyPoint;
                            }
                            else {
                                points[track.param].push(xyPoint);
                            }
                        };
                        tracks.map(convertToXY);
                    };
                    readings.map(preparePoints);
                    return points;
                };
                switch (data.cmd) {
                    case 'find-point-avl':
                        getParamPointAVL(data.timestamp, data.param, data.oldPoints, data.newPoints).then((point) => {
                            ctx.postMessage({
                                cmd: data.cmd,
                                point: point,
                                param: data.param,
                            });
                        });
                        break;
                    case 'handle-overflow':
                        ctx.postMessage({
                            cmd: data.cmd,
                            trackName: data.trackName,
                            points: overflowPoints(data.tracks, data.points),
                        });
                        break;
                    case 'reading-to-points':
                        data.readings = data.readings.filter((reading) => {
                            return reading.timestamp >= data.zoomStartAt && reading.timestamp <= data.zoomEndAt;
                        });
                        ctx.postMessage({
                            cmd: data.cmd,
                            points: readingsToPoints(data.readings, data.tracks),
                        });
                        break;
                    default:
                        console.log('[Worker] Unable to handle ', data);
                        break;
                }
            }, false);
        })(dmec = d3.dmec || (d3.dmec = {}));
    })(d3 = worker.d3 || (worker.d3 = {}));
})(worker || (worker = {}));


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3dvcmtlcnMvZG1lYy1jaGFydC53b3JrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBLElBQVUsTUFBTSxDQW1OZjtBQW5ORCxXQUFVLE1BQU07SUFBQyxNQUFFLENBbU5sQjtJQW5OZ0IsYUFBRTtRQUFDLFFBQUksQ0FtTnZCO1FBbk5tQixlQUFJO1lBRXZCLE1BQU0sR0FBRyxHQUFXLElBQVcsQ0FBQztZQUVoQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ3pDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBRXhCLElBQUksQ0FBQztvQkFDSixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksSUFBSSxDQUFD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QUFDO3dCQUVILEdBQUcsQ0FBQyxXQUFXLENBQUM7NEJBQ2YsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHOzRCQUNiLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7eUJBQ3BELENBQUMsQ0FBQzt3QkFDSCxLQUFLLENBQUM7b0JBQ1A7d0JBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDaEQsS0FBSyxDQUFDO2dCQUVSLENBQUM7WUFFRixDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFWCxDQUFDLEVBbk5tQixJQUFJLEdBQUosT0FBSSxLQUFKLE9BQUksUUFtTnZCO0lBQUQsQ0FBQyxFQW5OZ0IsRUFBRSxHQUFGLFNBQUUsS0FBRixTQUFFLFFBbU5sQjtBQUFELENBQUMsRUFuTlMsTUFBTSxLQUFOLE1BQU0sUUFtTmYiLCJmaWxlIjoiZG1lYy1jaGFydC53b3JrZXIvZG1lYy1jaGFydC53b3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy93b3JrZXJzL2RtZWMtY2hhcnQud29ya2VyLnRzXCIpO1xuIiwibmFtZXNwYWNlIHdvcmtlci5kMy5kbWVjIHtcclxuXHJcblx0Y29uc3QgY3R4OiBXb3JrZXIgPSBzZWxmIGFzIGFueTtcclxuXHJcblx0Y3R4LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQpID0+IHtcclxuXHRcdGNvbnN0IGRhdGEgPSBldmVudC5kYXRhO1xyXG5cclxuXHRcdHRyeSB7XHJcblx0XHRcdGRhdGEuem9vbVN0YXJ0QXQgPSBuZXcgRGF0ZShkYXRhLnpvb21TdGFydEF0KS5nZXRUaW1lKCk7XHJcblx0XHRcdGRhdGEuem9vbUVuZEF0ID0gbmV3IERhdGUoZGF0YS56b29tRW5kQXQpLmdldFRpbWUoKTtcclxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGV4Y2x1ZGUgPSAocG9pbnQpID0+IHtcclxuXHRcdFx0cmV0dXJuIHBvaW50LnggPj0gZGF0YS56b29tU3RhcnRBdCAmJiBwb2ludC54IDw9IGRhdGEuem9vbUVuZEF0O1xyXG5cdFx0fTtcclxuXHJcblx0XHRjb25zdCBvdmVyZmxvd1BvaW50cyA9ICh0cmFja3MsIHBvaW50cykgPT4ge1xyXG5cclxuXHRcdFx0Y29uc3QgcmVzdWx0ID0ge307XHJcblxyXG5cdFx0XHR0cmFja3MubWFwKCh0cmFjaykgPT4ge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRwb2ludHNbdHJhY2sucGFyYW1dID0gcG9pbnRzW3RyYWNrLnBhcmFtXS5maWx0ZXIoZXhjbHVkZSk7XHJcblx0XHRcdFx0XHRyZXN1bHRbdHJhY2sucGFyYW1dID0gaGFuZGxlT3ZlcmZsb3cocG9pbnRzW3RyYWNrLnBhcmFtXSwgdHJhY2spO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdFx0XHQvLyBmYcOnYSBuYWRhXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9O1xyXG5cclxuXHRcdGNvbnN0IGhhbmRsZU92ZXJmbG93ID0gKHBvaW50cywgdHJhY2spID0+IHtcclxuXHJcblx0XHRcdGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cdFx0XHRsZXQgZGlzdGFuY2UgPSAwO1xyXG5cdFx0XHRsZXQgbGFzdFBvaW50ID0gbnVsbDtcclxuXHJcblx0XHRcdGRpc3RhbmNlID0gTWF0aC5hYnModHJhY2subWF4IC0gdHJhY2subWluKTtcclxuXHJcblx0XHRcdHBvaW50cy5tYXAoKHBvaW50KSA9PiB7XHJcblxyXG5cdFx0XHRcdGNvbnN0IGVtcHR5ID0ge1xyXG5cdFx0XHRcdFx0eDogcG9pbnQueCxcclxuXHRcdFx0XHRcdHk6IG51bGwsXHJcblx0XHRcdFx0XHRhY3R1YWw6IG51bGwsXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0aWYgKHBvaW50LnkgIT0gbnVsbCkge1xyXG5cclxuXHRcdFx0XHRcdHBvaW50Lm92ZXJmbG93ID0gMDtcclxuXHRcdFx0XHRcdGxldCB0ZW1wUG9pbnQgPSBudWxsO1xyXG5cclxuXHRcdFx0XHRcdHdoaWxlIChwb2ludC55IDwgdHJhY2subWluKSB7XHJcblx0XHRcdFx0XHRcdHRlbXBQb2ludCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocG9pbnQpKTtcclxuXHRcdFx0XHRcdFx0cG9pbnQub3ZlcmZsb3crKztcclxuXHRcdFx0XHRcdFx0cG9pbnQueSArPSBkaXN0YW5jZTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR3aGlsZSAocG9pbnQueSA+IHRyYWNrLm1heCkge1xyXG5cdFx0XHRcdFx0XHR0ZW1wUG9pbnQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHBvaW50KSk7XHJcblx0XHRcdFx0XHRcdHBvaW50Lm92ZXJmbG93LS07XHJcblx0XHRcdFx0XHRcdHBvaW50LnkgLT0gZGlzdGFuY2U7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKGxhc3RQb2ludCAhPSBudWxsICYmIGxhc3RQb2ludC5vdmVyZmxvdyAhPT0gcG9pbnQub3ZlcmZsb3cpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHRlbXBQb2ludCkge1xyXG5cdFx0XHRcdFx0XHRcdHJlc3VsdC5wdXNoKHRlbXBQb2ludCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0cmVzdWx0LnB1c2goZW1wdHkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGxhc3RQb2ludCA9IHBvaW50O1xyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bGFzdFBvaW50ID0gbnVsbDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKHBvaW50KTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdH07XHJcblxyXG5cdFx0Y29uc3QgZ2V0UGFyYW1Qb2ludEFWTCA9ICh0aW1lc3RhbXAsIHBhcmFtLCBvbGRQb2ludHMsIG5ld1BvaW50cykgPT4ge1xyXG5cclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcblx0XHRcdFx0bGV0IHBvaW50cyA9IFtdO1xyXG5cclxuXHRcdFx0XHRpZiAobmV3UG9pbnRzICYmXHJcblx0XHRcdFx0XHRuZXdQb2ludHNbcGFyYW1dICYmXHJcblx0XHRcdFx0XHRuZXdQb2ludHNbcGFyYW1dLmxlbmd0aCkge1xyXG5cclxuXHRcdFx0XHRcdHBvaW50cyA9IG5ld1BvaW50c1twYXJhbV07XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKG9sZFBvaW50cyAmJlxyXG5cdFx0XHRcdFx0b2xkUG9pbnRzW3BhcmFtXSAmJlxyXG5cdFx0XHRcdFx0b2xkUG9pbnRzW3BhcmFtXS5sZW5ndGgpIHtcclxuXHJcblx0XHRcdFx0XHRwb2ludHMgPSBbLi4ub2xkUG9pbnRzW3BhcmFtXSwgLi4ucG9pbnRzXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHdoaWxlIChwb2ludHMgJiYgcG9pbnRzLmxlbmd0aCA+IDEpIHtcclxuXHJcblx0XHRcdFx0XHRjb25zdCBoYWxmID0gTWF0aC5jZWlsKHBvaW50cy5sZW5ndGggLyAyKTtcclxuXHJcblx0XHRcdFx0XHRjb25zdCBmaXJzdEhhbGYgPSBwb2ludHMuc2xpY2UoMCwgaGFsZik7XHJcblx0XHRcdFx0XHRjb25zdCBsYXN0SGFsZiA9IHBvaW50cy5zbGljZSgtMSAqIGhhbGYpO1xyXG5cclxuXHRcdFx0XHRcdGlmIChsYXN0SGFsZiAmJlxyXG5cdFx0XHRcdFx0XHRsYXN0SGFsZi5sZW5ndGggJiZcclxuXHRcdFx0XHRcdFx0dGltZXN0YW1wID4gbGFzdEhhbGZbMF0ueCkge1xyXG5cclxuXHRcdFx0XHRcdFx0cG9pbnRzID0gbGFzdEhhbGY7XHJcblxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cG9pbnRzID0gZmlyc3RIYWxmO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJlc29sdmUoe1xyXG5cdFx0XHRcdFx0cGFyYW06IHBhcmFtLFxyXG5cdFx0XHRcdFx0cG9pbnQ6IHBvaW50c1swXSB8fCBudWxsLFxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fTtcclxuXHJcblx0XHRjb25zdCByZWFkaW5nc1RvUG9pbnRzID0gKHJlYWRpbmdzLCB0cmFja3MpID0+IHtcclxuXHRcdFx0Y29uc3QgcG9pbnRzID0ge307XHJcblxyXG5cdFx0XHRjb25zdCBwcmVwYXJlUG9pbnRzID0gKHJlYWRpbmcpID0+IHtcclxuXHJcblx0XHRcdFx0Y29uc3QgY29udmVydFRvWFkgPSAodHJhY2spID0+IHtcclxuXHJcblx0XHRcdFx0XHRjb25zdCB4eVBvaW50ID0ge1xyXG5cdFx0XHRcdFx0XHR4OiByZWFkaW5nLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0eTogcmVhZGluZ1t0cmFjay5wYXJhbV0gfHwgbnVsbCxcclxuXHRcdFx0XHRcdFx0YWN0dWFsOiByZWFkaW5nW3RyYWNrLnBhcmFtXSB8fCBudWxsLFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIXBvaW50c1t0cmFjay5wYXJhbV0pIHtcclxuXHRcdFx0XHRcdFx0cG9pbnRzW3RyYWNrLnBhcmFtXSA9IFtdO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIHBvaW50c1t0cmFjay5wYXJhbV0ucHVzaCh4eVBvaW50KTtcclxuXHJcblx0XHRcdFx0XHRpZiAocG9pbnRzW3RyYWNrLnBhcmFtXS5sZW5ndGggPj0gMiAmJlxyXG5cdFx0XHRcdFx0XHRwb2ludHNbdHJhY2sucGFyYW1dW3BvaW50c1t0cmFjay5wYXJhbV0ubGVuZ3RoIC0gMV0ueSA9PT0geHlQb2ludC55ICYmXHJcblx0XHRcdFx0XHRcdHBvaW50c1t0cmFjay5wYXJhbV1bcG9pbnRzW3RyYWNrLnBhcmFtXS5sZW5ndGggLSAyXS55ID09PSB4eVBvaW50LnkpIHtcclxuXHRcdFx0XHRcdFx0cG9pbnRzW3RyYWNrLnBhcmFtXVtwb2ludHNbdHJhY2sucGFyYW1dLmxlbmd0aCAtIDFdID0geHlQb2ludDtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHBvaW50c1t0cmFjay5wYXJhbV0ucHVzaCh4eVBvaW50KTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0dHJhY2tzLm1hcChjb252ZXJ0VG9YWSk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0cmVhZGluZ3MubWFwKHByZXBhcmVQb2ludHMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHBvaW50cztcclxuXHJcblx0XHR9O1xyXG5cclxuXHRcdHN3aXRjaCAoZGF0YS5jbWQpIHtcclxuXHRcdFx0Y2FzZSAnZmluZC1wb2ludC1hdmwnOlxyXG5cdFx0XHRcdGdldFBhcmFtUG9pbnRBVkwoZGF0YS50aW1lc3RhbXAsIGRhdGEucGFyYW0sIGRhdGEub2xkUG9pbnRzLCBkYXRhLm5ld1BvaW50cykudGhlbigocG9pbnQpID0+IHtcclxuXHRcdFx0XHRcdGN0eC5wb3N0TWVzc2FnZSh7XHJcblx0XHRcdFx0XHRcdGNtZDogZGF0YS5jbWQsXHJcblx0XHRcdFx0XHRcdHBvaW50OiBwb2ludCxcclxuXHRcdFx0XHRcdFx0cGFyYW06IGRhdGEucGFyYW0sXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnaGFuZGxlLW92ZXJmbG93JzpcclxuXHRcdFx0XHRjdHgucG9zdE1lc3NhZ2Uoe1xyXG5cdFx0XHRcdFx0Y21kOiBkYXRhLmNtZCxcclxuXHRcdFx0XHRcdHRyYWNrTmFtZTogZGF0YS50cmFja05hbWUsXHJcblx0XHRcdFx0XHRwb2ludHM6IG92ZXJmbG93UG9pbnRzKGRhdGEudHJhY2tzLCBkYXRhLnBvaW50cyksXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JlYWRpbmctdG8tcG9pbnRzJzpcclxuXHJcblx0XHRcdFx0ZGF0YS5yZWFkaW5ncyA9IGRhdGEucmVhZGluZ3MuZmlsdGVyKChyZWFkaW5nKSA9PiB7XHJcblx0XHRcdFx0XHRyZXR1cm4gcmVhZGluZy50aW1lc3RhbXAgPj0gZGF0YS56b29tU3RhcnRBdCAmJiByZWFkaW5nLnRpbWVzdGFtcCA8PSBkYXRhLnpvb21FbmRBdDtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0Y3R4LnBvc3RNZXNzYWdlKHtcclxuXHRcdFx0XHRcdGNtZDogZGF0YS5jbWQsXHJcblx0XHRcdFx0XHRwb2ludHM6IHJlYWRpbmdzVG9Qb2ludHMoZGF0YS5yZWFkaW5ncywgZGF0YS50cmFja3MpLFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdbV29ya2VyXSBVbmFibGUgdG8gaGFuZGxlICcsIGRhdGEpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fSwgZmFsc2UpO1xyXG5cclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9