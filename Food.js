// 所有关于食物的代码都写在这个js文件中
// 自执行函数
(function (w) {
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