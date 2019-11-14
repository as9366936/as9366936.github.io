// 所有关于蛇的代码都写在这个js文件中
// 自执行函数
(function (w) {
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
    function remove(map){
        for(var i = 0; i < list.length; i++){
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
        if(snakeHeadX == foodX && snakeHeadY == foodY){
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
    function getColorForRandom(){
        var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']; // 下标0-15
        var str = '#';
        // 循环产生6个 0-15的数
        for(var i = 0; i < 6; i++){
            var num = Math.floor(Math.random() * 16);
            // 根据这个随机数, 在arr数组中去取值
            str += arr[num];
        }
        return str; 
    }

    // 把 Snake 这个构造函数,暴露给window
    w.Snake = Snake;
}(window));