// 所有关于游戏逻辑的代码都写在这个js文件中
(function (w) {
    // 声明一个变量that用来保存游戏控制器对象
    var that = null;

    // 1. 创建游戏控制器对象的构造函数
    // 游戏控制器对象里面有什么?想让游戏开始起来,里面肯定要有蛇, 食物, 地图
    function Game(map) {
        this.food = new Food;
        this.snake = new Snake;
        this.map = map;
        // 给that赋值
        that = this;
    }

    // 2. 写一个游戏开始的方法,写在游戏控制器对象的原型中
    Game.prototype.start = function () {
        // 2.1 调用食物的render方法显示食物
        this.food.render(this.map);
        // 2.2 调用蛇的render方法显示蛇
        this.snake.render(this.map);

        // // 让蛇动起来(调用蛇的move方法)
        // this.snake.move();
        // // 把蛇重新渲染一下,因为蛇坐标已经因为移动而改变
        // this.snake.render(this.map);

        snakeAutoMove();

        // 调用bindKey方法,让蛇根据键盘按键来改变方向移动
        bindKey();
    }

    // 3.写一个方法
    function snakeAutoMove() {
        // 写一个计时器不停的调用蛇移动和蛇渲染的方法
        var timeID = setInterval(function () {
            // console.log(this); //window    window里面没有snake
            // console.log(this.snake); // undefined
            // this.snake.move();
            // this.snake.render(this.map);

            // 我们希望这里的this指向游戏控制器对象, 怎么办?
            // 使用bind()方法来更改 this 的指向
            this.snake.move(this.food, this.map);


            // 判断蛇移动是否出界
            var snakeHeadX = this.snake.body[0].x * this.snake.width; // 蛇头的x坐标
            var snakeHeadY = this.snake.body[0].y * this.snake.height; // 蛇头的y坐标
            if (snakeHeadX < 0 || snakeHeadY < 0 || snakeHeadX >= this.map.offsetWidth || snakeHeadY >= this.map.offsetHeight) {
                alert('Game Over');
                clearInterval(timeID);
                return; // 如果出界了,就不要渲染了(不执行后面的代码)
            }

            this.snake.render(this.map); // 渲染蛇

        }.bind(that), 100);
    }

    // 4. 让蛇根据键盘按键来移动
    function bindKey() {
        // 给页面注册一个键盘按下事件
        document.onkeydown = function (e) {
            // console.log(e.keyCode); // 获取按键编号 左:37, 上:38, 右:39, 下:40
            switch (e.keyCode) {
                case 37:
                    if (this.snake.direction != 'right') {
                        this.snake.direction = 'left';
                    }
                    break;
                case 38:
                    if (this.snake.direction != 'bottom') {
                        this.snake.direction = 'top';
                    }
                    break;
                case 39:
                    if (this.snake.direction != 'left') {
                        this.snake.direction = 'right';
                    }
                    break;
                case 40:
                    if (this.snake.direction != 'top') {
                        this.snake.direction = 'bottom';
                    }
                    break;
            }
        }.bind(that);
    }

    // 把这个Game构造函数暴露给window对象
    w.Game = Game;
}(window));