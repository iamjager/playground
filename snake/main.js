'use strict';

(function () {
    var Directions = {
        LEFT: -1,
        TOP: -2,
        RIGHT: 1,
        BOTTOM: 2,
        areOpposite: function (direction1, direction2) {
            return ((direction1 + direction2) === 0);
        }
    };

    var Colors = {
        FIELD: '#000',
        SNAKE: '#00FF00',
        FOOD: '#0000FF'
    };

    var SNAKE_INITIAL_SPEED = 100,
        MAX_REDRAW_SPEED = 17;

    var Snake = {
        _setCanvasSize: function () {
            this._canvas.width = this._canvas.parentNode.offsetWidth;
            this._canvas.height = this._canvas.parentNode.offsetHeight;
        },

        _drawField: function () {
            this._canvasCtx.fillStyle = Colors.FIELD;
            this._canvasCtx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        },
        
        _drawSnakeSegment: function (x, y) {
            this._canvasCtx.fillStyle = Colors.SNAKE;
            this._canvasCtx.fillRect(x, y, 20, 20);
        },
        
        _drawSnake: function () {
            for (var i = 0; i < this._segments.length; i++) {
                this._drawSnakeSegment(this._segments[i].x, this._segments[i].y);
            }
        },
        
        _moveSnake: function () {
            this._segments.shift();
            this._segments.push(this._nextHead);
            this._createNextHead();
        },
        
        _getCurrentHead: function () {
            return this._segments[this._segments.length - 1];
        },
        
        _createNextHead: function () {
            var currentHead = this._getCurrentHead();
            this._nextHead = {
                x: currentHead.x,
                y: currentHead.y
            };

            switch (this._direction) {
                case Directions.LEFT:
                    this._nextHead.x -= 25;
                    break;
                case Directions.TOP:
                    this._nextHead.y -= 25;
                    break;
                case Directions.RIGHT:
                    this._nextHead.x += 25;
                    break;
                case Directions.BOTTOM:
                    this._nextHead.y += 25;
                    break;
                default:
                    break;
            }

            return this._nextHead;
        },
        
        _redraw: function () {
            window.requestAnimationFrame(Snake._redraw);

            if (!Snake._needsRedraw) {
                return;
            }

            Snake._drawField();
            Snake._drawSnake();
            Snake._needsRedraw = false;
        },
        
        _handleWindowResize: function () {
            this._setCanvasSize();
            this._needsRedraw = true;
        },

        _handleKeyboardInput: function (event) {
            var newDirection = this._direction;
            switch (event.keyCode) {
                case 37:
                    newDirection = Directions.LEFT;
                    break;
                case 38:
                    newDirection = Directions.TOP
                    break;
                case 39:
                    newDirection = Directions.RIGHT
                    break;
                case 40:
                    newDirection = Directions.BOTTOM
                    break;
                default:
                    break;
            }

            // snake can't turn to opposite direction
            if (!Directions.areOpposite(this._direction, newDirection)) {
                this._direction = newDirection;
                this._moveSnake();
                this._needsRedraw = true;
            }
        },

        _initSnakeMovementCycle: function () {
            this._snakeMovementInterval = window.setInterval((function () {
                this._moveSnake();
                this._needsRedraw = true;
            }).bind(this), SNAKE_INITIAL_SPEED);
        },

        init: function () {
            this._canvas = document.getElementById('snake');

            if (!this._canvas.getContext) {
                return;
            }

            this._canvasCtx = this._canvas.getContext('2d');
            this._direction = Directions.RIGHT;
            this._segments = [];

            for (var i = 0; i < 5; i++) {
                this._segments.push({
                    x: 25*i,
                    y: 0
                });
            }

            this._createNextHead();
            this._handleWindowResize();
            this._initSnakeMovementCycle();
            window.requestAnimationFrame(Snake._redraw);

            window.addEventListener('resize', this._handleWindowResize.bind(this));
            window.addEventListener('keydown', this._handleKeyboardInput.bind(this));
        }
    };

    Snake.init();
})();