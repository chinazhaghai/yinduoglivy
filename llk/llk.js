var game = {
    row: 8, // 行数  列数
    width: 400, // 舞台宽度
    _w: 39,     // 元素宽度
    _x: 4,
    indexs: [],  //
    nums: [],    //
    imgCount: 12,  //图片随机的个数
    time: 0,     // 倒计时
    pass: 0,     // 当前关数
    level: "2", // 等级
    isRun: 0,  // 是否正在游戏
    stop: 0,  //是否停止
    last: 0,  // 是否是最后一个
    isClick: 0, //是否点击
    imgPath: "imgs/scsg/{n}.png", //图片路径
    curScore: 0, //当前分数
    maxScore: 0, // 最大分数
    bg: "#7B796B", // 背景颜色
    con: document.getElementById("container"),  // 舞台元素
    timeCon: document.getElementById("timeCon"), // 时间元素
    passCon: document.getElementById("passCon"), //
    ctx: document.getElementById('myCanvas').getContext ? document.getElementById('myCanvas').getContext('2d') : 0
};
game.config = {
    "2": {
        time: 120,
        imgCount: 12,
        row: 4
    }
};
game.random = function(max) {
    return Math.floor(Math.random() * max);
}
;
game.init = function() 
{
    //关数大于第九关则为第八关
    var t = game.pass < 9 ? game.pass - 1 : 8;

    // 改变时间
    game.time += game.config[game.level].time - t * 10;
    // 数量
    var count = game.row * game.row;
    var vs = game.getValues((game.row - 2) * (game.row - 2));
    game.nums = [];
    for (var i = 0, j = 0; i < count; i++) 
    {
       /*
        0 0 0 0 0 0 0 0
        0             0
        0             0
        0             0
        0             0
        0             0
        0             0
        0 0 0 0 0 0 0 0
       */
        if (!Math.floor(i / game.row) || Math.floor(i / game.row) == game.row - 1 || i % game.row == 0 || i % game.row == game.row - 1) {
            game.nums.push(0);
        } else {
            game.nums.push(vs[j]);
            j++;
        }
    }
    game.getIndexs();
    game.swap();
};


game.getValues = function(count) 
{
    var arr = [];
    var t = count % game.imgCount;  

    var c = Math.floor(count / game.imgCount); 

    if (c % 2 == 1) {
        c--;
        t += game.imgCount;
    }

    count = c * game.imgCount;

    for (var i = 0; i < count; i++) {
        arr.push(i % game.imgCount + 1);
    }

    for (var i = 0, j = 1; i < t; i += 2,
    j++) {
        arr.push(j);
        arr.push(j);
    }
    return arr;
};

/*用于第几关*/
game.next = function() {
    game.pass++;
    game.passCon.innerHTML = game.pass;
    game.init();
};

game.startTimer = function() {
    if (game._timer)
        return;
    game._timer = setInterval(function() {
        if (!game.isRun || game.stop) {
            return;
        }
        game.time--;
        game.timeCon.innerHTML = game.time;
        if (game.time <= 0) {
            game.isRun = 0;
            game.pass = 0;
            game.time = 0;
            document.getElementById("start").value = "开始";
            alert("游戏结束，你可以选择分享获取游戏时间，或者重新开始");
        }
    }, 1000);
}
;
game.creatImgs = function() 
{
    game.con.innerHTML = "";
    var img, p;
    for (var i = 0; i < game.indexs.length; i++) {
        img = document.createElement("img");
        p = game.getPoint(game.indexs[i]);
        img.src = game.imgPath.replace("{n}", game.nums[game.indexs[i]]);
        img.style.cssText = "left:" + (p.x + 1) + "px;top:" + (p.y + 1) + "px;width:" + (game._w - 2) + "px;height:" + (game._w - 2) + "px";
        img.setAttribute("index", game.indexs[i]);
        game.con.appendChild(img);
    }
};

/*设置分数*/
game.setScore = function() {
    document.getElementById("curScore").innerHTML = game.curScore;
    if (game.curScore > game.maxScore) {
        game.maxScore = game.curScore;
        document.getElementById("maxScore").innerHTML = game.curScore;
    }
};

game.removeImg = function(i) 
{
    var img = game.getImg(i);
    if (img) {
        game.con.removeChild(img);
        img = null ;
    }
}
game.getImg = function(ii) {
    var imgs = game.con.getElementsByTagName("img");
    var index = 0;
    for (var i = 0; i < imgs.length; i++) 
    {
        index = parseInt(imgs[i].getAttribute("index"), 10);
        if (index == ii) 
        {
            return imgs[i];
        }
    }
    return 0;
}
;
game.swap = function() 
{
    var i = 0
      , l = game.indexs.length
      , t = 0;
    for (var j = 0; j < l; j++) 
    {
        i = game.random(l);
        t = game.nums[game.indexs[i]];
        game.nums[game.indexs[i]] = game.nums[game.indexs[j]];
        game.nums[game.indexs[j]] = t;
    }

    while (game.isLock()) {
        game.swap();
    }
    game.getIndexs();
    game.creatImgs();
}
;
game.getIndexs = function() {
    game.indexs = [];
    for (var i = 0; i < game.nums.length; i++) {
        if (game.nums[i]) {
            game.indexs.push(i);
        }
    }
}
;
game.drowLine = function(ps) {
    if (!game.ctx) {
        return;
    }
    if (ps) {
        game.ctx.strokeStyle = "red";
        game.ctx.lineWidth = 1;
        game.ctx.beginPath();
        var p = game.getPoint(ps[0]);
        var x = Math.floor(game._w / 2) + 0.5;
        game.ctx.moveTo(p.x + x, p.y + x);
        for (var i = 1; i < ps.length; i++) {
            p = game.getPoint(ps[i]);
            game.ctx.lineTo(p.x + x, p.y + x);
        }
        game.ctx.stroke();
        game.ctx.restore();
    }
    setTimeout(function() {
        game.ctx.fillStyle = game.bg;
        game.ctx.fillRect(0, 0, 1000, 1000);
    }, ps ? 200 : 0);
}
;
game.canJoin = function(i1, i2) 
{
    if (i1 == i2 || game.nums[i1] != game.nums[i2])
        return 0;
    if (game.level == "1") {
        return [i1, i2];
    }
    return game.line(i1, i2) || game.line2(i1, i2) || game.line3(i1, i2);
}
;
game.line = function(i1, i2) 
{

    if (i1 == i2) {
        return 0;
    }
    var fh = i1 > i2 ? -1 : 1;
    if (Math.floor(i1 / game.row) == Math.floor(i2 / game.row)) {
        fh *= 1;
    } else if (i1 % game.row == i2 % game.row) {
        fh *= game.row;
    } else {
        return 0;
    }
    for (var i = i1 + fh; i != i2; i += fh) 
    {
        if (game.nums[i]) {
            return 0;
        }
    }
    return [i1, i2];
}
;
game.line2 = function(i1, i2) 
{
    if (i1 == i2) {
        return 0;
    }
    var p1 = game.getPos(i1);
    var p2 = game.getPos(i2);
    if (p1.x == p2.x || p1.y == p2.y) {
        return 0;
    }
    var j1 = game.getIndex(p1.x, p2.y);
    var j2 = game.getIndex(p2.x, p1.y);
    if (!game.nums[j1] && game.line(i1, j1) && game.line(j1, i2)) {
        return [i1, j1, i2];
    }
    if (!game.nums[j2] && game.line(i1, j2) && game.line(j2, i2)) {
        return [i1, j2, i2];
    }
    return 0;
}
;
game.line3 = function(i1, i2) {
    if (i1 == i2) {
        return 0;
    }
    var arr1 = game.getCanJoins(i1);
    var arr2 = game.getCanJoins(i2);
    for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr2.length; j++) 
        {
            if (game.line(arr1[i], arr2[j])) {
                return [i1, arr1[i], arr2[j], i2];
            }
        }
    }
    return 0;
}
;
game.getCanJoins = function(i) 
{
    var t = i
      , arr = [];
    while (t % game.row > 0) {
        t--;
        if (game.nums[t]) {
            break;
        }
        arr.push(t);
    }
    t = i;
    while (t % game.row < game.row - 1) {
        t++;
        if (game.nums[t]) {
            break;
        }
        arr.push(t);
    }
    t = i;
    while (Math.floor(t / game.row) < game.row - 1) {
        t += game.row;
        if (game.nums[t]) {
            break;
        }
        arr.push(t);
    }
    t = i;
    while (Math.floor(t / game.row) > 0) {
        t -= game.row;
        if (game.nums[t]) {
            break;
        }
        arr.push(t);
    }
    return arr;
}
;
game.getPos = function(i) {
    return {
        x: Math.floor(i / game.row),
        y: i % game.row
    };
}
;
game.getIndex = function(x, y) {
    return x * game.row + y;
}
;
game.getPoint = function(i) 
{
    var p = game.getPos(i);
    var t = Math.floor(game._w / 2);
    p = {
        x: p.y * game._w + game._x - t,
        y: p.x * game._w + game._x - t
    };
    p.x = p.x < 2 ? p.x + 5 : (p.x > game.width - game._w ? p.x - t + 5 : p.x);
    p.y = p.y < 2 ? p.y + 5 : (p.y > game.width - game._w ? p.y - t + 5 : p.y);
    return p;
}
;
game.getCanPs = function() {
    var ps = 0;
    for (var i = 0; i < game.indexs.length - 1; i++) {
        for (var j = i + 1; j < game.indexs.length; j++) {
            if (ps = game.canJoin(game.indexs[i], game.indexs[j])) {
                return ps;
            }
        }
    }
    return 0;
}
;
game.isLock = function() {
    return !game.getCanPs();
}
;
game.tishi = function() {
    if (!game.isRun || game.stop) {
        return;
    }
    var ps = game.getCanPs();
    if (!ps)
        return;
    var img1 = game.getImg(ps[0]);
    var img2 = game.getImg(ps[ps.length - 1]);
    img1.className = img2.className = "on";
    game.time -= 5;
    if (game.level != "1") {
        game.drowLine(ps);
    }
}
;
game.isWin = function() {
    return game.indexs.length == 0;
}
;
game.clear = function(i1, i2) // 是否成功
{
    game.removeImg(i1);
    game.removeImg(i2);
    game.nums[i1] = 0;
    game.nums[i2] = 0;
    game.getIndexs();
    game.curScore += 10;
    if (game.isWin()) 
    {
        game.curScore += Math.floor(game.time / 5) * 10;
        alert("你赢了");
        //game.next();
    } else if (game.level != "1" && game.isLock()) {
        game.swap();
    }
    game.last = 0;
    game.isClick = 0;
    game.setScore();
}
;
game.doImg = function(index) {
    var ps = game.canJoin(index, game.last);
    if (ps) {
        if (game.level != "1") {
            game.drowLine(ps);
        }
        setTimeout(function() {
            game.clear(index, game.last);
            game.last = 0;
        }, 100);
    } else {
        var img = game.getImg(game.last);
        img.className = "";
        game.last = index;
        game.isClick = 0;
    }
}
;
game.start = function() {
    game.isRun = 1;
    game.time = 0;
    game.stop = 0;
    game.pass = 0;
    game.curScore = 0;

    game.setScore();
    game.next();
   // game.startTimer();
    document.getElementById("start").value = "暂停";
};


game.con.onclick = function(e) 
{
    if (game.isClick || game.stop)
        return;
    if (game.time <= 0) {
        alert("游戏结束，你可以选择分享获取游戏时间，或者重新开始");
        return;
    }
    game.isClick = 1;
    e = e || event;
    e = e.target || e.srcElement;
    var index = parseInt(e.getAttribute("index"), 10) || 0;
    if (!game.stop && e.tagName == "IMG" && index) {
        if (!game.last) {
            game.last = index;
            e.className = "on";
            game.isClick = 0;
        } 
        else if (game.last == index) {
            game.last = 0;
            e.className = "";
            game.isClick = 0;
        } 
        else {
            e.className = "on";
            setTimeout(function() {
                game.doImg(index);
            }, 10);
        }
    } else {
        game.isClick = 0;
    }
}
;




document.getElementById("start").onclick = function() 
{

    if (game.isRun) 
    {
        game.stop = !game.stop;
        this.value = game.stop ? "开始" : "暂停";
        if (game.stop) {
            game.isClick = 0;
        }
    } else 
    {
        game.start();
    }
};


function setLevel(l) 
{
    var change = 0;
    if (game.isRun) {
        change = confirm("你正在游戏中，重新选择难度，将结束当前游戏，再重新开始，你是否真的要结束当前游戏？");
        if (!change) {
            $("slcLevel").value = game.level;
            return;
        }
    }
    game.imgCount = game.config[l].imgCount;
    game.level = l;
    game.row = game.config[l].row + 2;
    var w = document.body.clientWidth;
    var w1 = (game.row - 1) * 50;
    w = w < w1 ? w : w1;
    var t = w % game.row;
    game._w = Math.floor(w / (game.row - 1));
    game._x = Math.floor(t / 2);
    var canvas = document.getElementById('myCanvas');

    canvas.width = canvas.height = game.width = w;
    game.con.style.width = 
    game.con.style.height = 
    game.con.parentNode.style.width = 
    game.con.parentNode.style.height = w + "px";

    if (change) {
        game.start();
    }
}
function setImgs(slc) 
{
    game.imgPath = "imgs/" + slc;
    game.bg = "#7B796B";
    document.getElementById('myCanvas').style.backgroundColor = game.bg;
    if (game.isRun) {
        game.creatImgs();
        game.drowLine();
    }
}

Array.prototype.indexOf = function(v) 
{
    for (var i = 0; i < this.length; i++) 
    {
        if (this[i] == v) {
            return i;
        }
    }
    return -1;
}
Array.prototype.removeAt = function(i) 
{
    if (isNaN(i) || i > this.length || i < 0) {
        return false;
    }
    this.splice(i, 1);
};

setLevel("2");
setImgs("scsg/{n}.png");
