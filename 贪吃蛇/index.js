// 所有关于食物的代码都写在这个js文件中
// 自执行函数
;(function (w) {
    // 声明一个list数组来保存显示食物的div
    var list = [];
    // 1. 创建食物构造函数
    function Food(width, height, bgColor, x, y) {
        this.width = width || 20;
        this.height = height || 20;
        this.bgColor = bgColor || 'green';
        this.x = x || 0;
        this.y = y || 0;
    }

    // 2. 食物对象的渲染方法
    Food.prototype.render = function (map) {
        // 渲染新食物之前, 删除老食物div
        remove(map);

        //  2.1 给食物对象随机产生坐标
        this.x = Math.floor(Math.random() * map.offsetWidth / this.width) * this.width;
        this.y = Math.floor(Math.random() * map.offsetHeight / this.height) * this.height;
        // 2.2 创建一个div,让这个div拥有这个食物对象的所有显示信息
        var div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.left = this.x + 'px';
        div1.style.top = this.y + 'px';
        div1.style.width = this.width + 'px';
        div1.style.height = this.height + 'px';
        div1.style.backgroundColor = this.bgColor;
        // 2.3 把这个div追加到地图那个div中
        map.appendChild(div1);

        // 把这个div存起来
        list.push(div1);
    }

    // 写一个方法来删除渲染老食物的div
    function remove(map) {
        for (var i = 0; i < list.length; i++) {
            map.removeChild(list[i]);
        }
        // 清空list数组
        list = [];
    }

    // 把 Food 这个构造函数暴露给 window对象
    w.Food = Food;
}(window));


// --------------------------------------------------------------------

// 所有关于蛇的代码都写在这个js文件中
// 自执行函数
;(function (w) {
    // 声明一个list来保存显示蛇使用的div
    var list = [];

    // 蛇也是一个对象,那应该也有创建一个蛇对象的构造函数
    function Snake(width, height, direction) {
        this.width = width || 20;
        this.height = height || 20;
        this.direction = direction || 'right';
        // 用一个body数组, 来描述蛇的每一节身体
        this.body = [
            { bgColor: 'red', x: 3, y: 14 },
            { bgColor: 'green', x: 2, y: 14 },
            { bgColor: 'pink', x: 1, y: 14 }
        ];
    }

    // 2. 把蛇对象渲染出来的代码封装成一个函数, 这个函数写在原型中比较合适
    Snake.prototype.render = function (map) {
        // 在渲染新蛇之前,把老蛇给删掉
        remove(map);

        // 把蛇的每一节遍历出来做渲染,这样就是一条整蛇
        for (var i = 0; i < this.body.length; i++) {
            // this.body[i] // 这就是每一节蛇身体, 当i等于0的时候他是蛇头,i等于1的时候是蛇身, i等于2的时候是蛇尾
            // 创建一个div, 让这个div拥有当前这一节的所有显示信息
            var div1 = document.createElement('div');
            div1.style.position = 'absolute';
            div1.style.left = this.body[i].x * this.width + 'px';
            div1.style.top = this.body[i].y * this.height + 'px';
            div1.style.width = this.width + 'px';
            div1.style.height = this.height + 'px';
            div1.style.backgroundColor = this.body[i].bgColor;
            // 把这个div追加到地图上
            map.appendChild(div1);

            // 把蛇渲染的这些div给存起来, 只有存起来了后面才可以找到他们并且从map中移出
            list.push(div1);
        }
    }

    // 删除老蛇div
    function remove(map) {
        for (var i = 0; i < list.length; i++) {
            map.removeChild(list[i]);
        }
        // 清空list数组
        list = [];
    }

    // 3. 蛇移动的代码封装成一个方法, 写在蛇的原型中
    Snake.prototype.move = function (food, map) {
        // 3.1 除了蛇头之外的蛇身体(它移动之后的坐标,是它上一节移动之前的坐标)
        for (var i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }

        // 3.2 蛇头(根据方向来改变坐标)
        switch (this.direction) {
            case 'right':
                this.body[0].x++;
                break;
            case 'left':
                this.body[0].x--;
                break;
            case 'top':
                this.body[0].y--;
                break;
            case 'bottom':
                this.body[0].y++;
                break;
        }

        // 3.3 判断蛇头是否吃到了食物
        // 拿到蛇头坐标和拿到食物坐标, 看他们是否重叠
        var snakeHeadX = this.body[0].x * this.width;
        var snakeHeadY = this.body[0].y * this.height;
        var foodX = food.x;
        var foodY = food.y;
        // 把蛇的尾巴用标量存起来,方便等下取他的xy
        var lastUnit = this.body[this.body.length - 1];
        // 判断
        if (snakeHeadX == foodX && snakeHeadY == foodY) {
            // 长身体: 长的这一节身体的坐标,就是原来蛇尾巴的坐标
            this.body.push({
                x: lastUnit.x,
                y: lastUnit.y,
                bgColor: getColorForRandom()
            });

            // this.body.push(lastUnit); // 这样不行,相当于把蛇尾拿出来,又放到最后,不会长身体

            // 随机产生一个新食物
            food.render(map);
        }
    };

    // 随机产生一个十六进制的颜色的函数
    function getColorForRandom() {
        var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']; // 下标0-15
        var str = '#';
        // 循环产生6个 0-15的数
        for (var i = 0; i < 6; i++) {
            var num = Math.floor(Math.random() * 16);
            // 根据这个随机数, 在arr数组中去取值
            str += arr[num];
        }
        return str;
    }

    // 把 Snake 这个构造函数,暴露给window
    w.Snake = Snake;
}(window));


// -----------------------------------------------------

// 所有关于游戏逻辑的代码都写在这个js文件中
;(function (w) {
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