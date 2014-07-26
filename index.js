var D = 200,
    d = 5,
    elemLeft = $('canvas')[0].offsetLeft,
    elemTop = $('canvas')[0].offsetTop;
var $coordinates = $('#coordinate');

function convertCoords(coord) {
    return ((coord - elemLeft) - (coord - elemLeft) % d) / d
}

function getRandom(from, to) {
    return (Math.random() * to) + from;
}

function cc() {
    var r = Math.floor(getRandom(10, 256));
    var g = Math.floor(getRandom(10, 256));
    var b = Math.floor(getRandom(10, 256));
    var c = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return c;
}

function Ants(opt) {
    this.currentId = 1;
    this.settings = [];
}
/**
 * {
 *  x: 200,
 *  y: 200,
 *  color: '#FF00FF',
 *  direction: '0', //0,1,2,3
 * }
 * @param opt
 */
Ants.prototype.addAnt = function (opt) {
    var options = opt,
        id = this.currentId;
    opt.name = opt.name || 'z' + id;
    var dateCreate = new Date();
    var advOptions = {
        id: id,
        timeCreate: dateCreate,
        timeLive: 0,
        counterStep: 0
    }
    this.settings.push($.extend(options, advOptions));
    this.currentId++;
}
Ants.prototype.getAnts = function () {
    return this.settings;
}

Ants.prototype.getAnt = function (n) {
    return this.settings[n];
}

var ants = new Ants();
$('#addAnt').click(function () {
    var nameAnt = $('#nameAnt').val(),
        colorAnt = $('#colorAnt').val() || '#ff0000',
        directionAnt = $('#direction').val(),
        coordAnt = {x: $coordinates.attr('x'), y: $coordinates.attr('y')};
    ants.addAnt({
        x: coordAnt.x,
        y: coordAnt.y,
        color: colorAnt,
        direction: directionAnt,
        name: nameAnt
    });
    getResult();
})

var running = false;
var example = document.getElementById("example");
var idInt = null;

$('#start').on('click', function () {
    running = true;
    idInt = setInterval(function () {
        ants.getAnts().map(function (i, k) {
            movePlayer(k, i);
        })
    }, 1);
    setInterval(getResult, 500);
});

$('#stop').on('click', function () {
    clearInterval(idInt);
    getResult();
    running = false;
})


ctx = example.getContext('2d');

$('canvas').click(function (e) {
    if (running) {
        return;
    }
    clickX = convertCoords(e.pageX);
    clickY = convertCoords(e.pageY);

    var oldX = $coordinates.attr('x');
    var oldY = $coordinates.attr('y');
    if (oldX === clickX && oldY === clickY) {
        $coordinates.attr('x', 0).attr('y', 0).text('[' + 0 + ',' + 0 + ']');
        ctx.clearRect(oldX * d, oldX * d, d, d);
    } else {
        ctx.clearRect(oldX * d, oldY * d, d, d);
        $coordinates.attr('x', clickX).attr('y', clickY).text('[' + clickX + ',' + clickY + ']');
        ctx.fillStyle = $('#colorAnt').val();
        ctx.fillRect(clickX * d, clickY * d, d, d);
    }
})
function getResult() {
    var h = '<ol>'
    ants.getAnts().sort(function (a, b) {
        return b.counterStep - a.counterStep;
    }).map(function (ant, k) {
        h += '<li style="color:'+ (k === 0 ? 'red' : 'blue') +'">' + '<span class=label style="background:' + ant.color + '"></span> ' + ant.name + ' - '  + ant.counterStep + ' ' + (ant.timeLive / 1000)
    })
    h += '</ol>';
    $('#resut').html(h);
}


var array = Array.apply(null, new Array(D)).map(Number.prototype.valueOf, 0);
for (var i = 0; i < D; i++) {
    array[i] = Array.apply(null, new Array(D)).map(Number.prototype.valueOf, 0);
}

function movePlayer(n, ant) {
    ant.timeLive++;
    if ((array[ant.x][ant.y]) === 0) {
        ant.direction--;
        ctx.fillStyle = ant.color;
        ctx.fillRect(ant.x * d, ant.y * d, d, d);
        ant.counterStep++;
        array[ant.x][ant.y] = n + 1;
    } else {
        ant.direction++;
        ants.getAnt(array[ant.x][ant.y] -1).counterStep--;
        array[ant.x][ant.y] = 0;
        ctx.clearRect(ant.x * d, ant.y * d, d, d);
    }

    if (ant.direction == -1)
        ant.direction = 3;

    if (ant.direction == 4)
        ant.direction = 0;


    if (ant.direction == 0) {
        ant.x++;
    } else if (ant.direction == 1) {
        ant.y++;
    } else if (ant.direction == 2) {
        ant.x--;
    } else if (ant.direction == 3) {
        ant.y--;
    }

    if (ant.x == -1) {
        ant.direction = 3;
        ant.x = 0;
    } else if (ant.y == -1) {
        ant.direction = 0;
        ant.y = 0;
    } else if (ant.x == D) {
        ant.x = D - 1;
        ant.direction = 1;
    } else if (ant.y == D) {
        ant.y = D - 1;
        ant.direction = 2;
    }
}


ctx.fillRect(0, 0, 10, 10);
ctx.fillRect(990, 990, 10, 10);
ctx.fillRect(0, 990, 10, 10);
ctx.fillRect(990, 0, 10, 10);
