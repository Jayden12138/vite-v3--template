
import vertexShader from './shader.vert?raw'
import fragmentShader from './shader.frag?raw'

export const init = () => {
  var oCanvas = document.getElementById("oCanvas");
  var gl = oCanvas.getContext("webgl");
  if (!gl) {
    alert("浏览器不支持webgl");
  }

  var vertexStr = vertexShader;
  var fragmentStr = fragmentShader;

  var vertexShaderProgram = createShader(gl, gl.VERTEX_SHADER, vertexStr);
  var fragmentShaderProgram = createShader(gl, gl.FRAGMENT_SHADER, fragmentStr);

  // 初始化一个程序
  var program = createProgram(gl, vertexShaderProgram, fragmentShaderProgram);

  // 清空画布
  gl.clearColor(0, 0, 0, 1);

  // 清空颜色缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 使用
  gl.useProgram(program);

  var screenSize = gl.getUniformLocation(program, "screenSize");
  gl.uniform2f(screenSize, oCanvas.width, oCanvas.height);

  var a_position = gl.getAttribLocation(program, "a_position");
  var point_size = gl.getAttribLocation(program, "point_size");
  var a_color = gl.getAttribLocation(program, "a_color");
  // gl.vertexAttrib4f(a_color, 1, 1, 0, 1);

  // 创建缓冲区
  var positionBuffer = gl.createBuffer();

  // 绑定
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 向缓冲区写入数据
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  //   50, 50,
  //   50, 100,
  //   100, 100
  // ]), gl.STATIC_DRAW);
  // 
  var indexBuffer = gl.createBuffer();

  // 绑定
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  var pointsData = createCircle(100, 100, 50, 50)

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointsData), gl.STATIC_DRAW);
  // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
  //   0, 1, 2,
  //   2, 3, 0
  // ]), gl.STATIC_DRAW);

  // 将缓冲区对象分配给attribute变量
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 4 * 6, 0);
  gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, 4 * 6, 4 * 2);
  // gl.vertexAttribPointer(point_size, 1, gl.FLOAT, false, 4 * 3, 4 * 2);

  // 启用attribute
  gl.enableVertexAttribArray(a_position);
  gl.enableVertexAttribArray(a_color);
  // gl.enableVertexAttribArray(point_size);

  // 绘制
  // gl.drawArrays(gl.TRIANGLES, 0, 6);
  // gl.drawArrays(gl.POINTS, 0, 3);
  // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
  // gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 0)

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 52);

  // bindEvent(gl, program);
  // bindTriangleEvent(gl, program);
}


function createCircle(x, y, r, n){
  var points = [x, y, ...randomColor()];
  for(var i = 0; i <= n; i++){
    var angle = i * 2 * Math.PI / n;
    var pointX = r * Math.cos(angle) + x;
    var pointY = r * Math.sin(angle) + y;
    
    console.log(i, pointX, pointY)
    points.push(pointX, pointY, ...randomColor());
  }
  console.log(points)
  return points
}

function bindTriangleEvent(gl, program) {
  var a_position = gl.getAttribLocation(program, "a_position");
  var a_color = gl.getAttribLocation(program, "a_color");
  var point_size = gl.getAttribLocation(program, "point_size");
  var points = [];
  oCanvas.onmousedown = function (e) {
    // 清空画布
    gl.clearColor(0, 0, 0, 1);

    // 清空颜色缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT);

    var x = e.offsetX;
    var y = e.offsetY;

    // 随机颜色 rgba
    var color = randomColor();

    points.push(x, y, 10.0);
    console.log(points)
    if(points.length % 3 === 0){
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

      // 将缓冲区对象分配给attribute变量
      gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 4 * 3, 0);
      gl.vertexAttribPointer(point_size, 1, gl.FLOAT, false, 4 * 3, 4 * 2);

      // 启用attribute
      gl.enableVertexAttribArray(a_position);
      gl.enableVertexAttribArray(point_size);

      // 绘制
      gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);
      gl.drawArrays(gl.POINTS, 0, points.length / 3);
    }
  };
}

function bindEvent(gl, program) {
  var a_position = gl.getAttribLocation(program, "a_position");
  var a_color = gl.getAttribLocation(program, "a_color");
  var points = [];
  oCanvas.onmousedown = function (e) {
    // 清空画布
    gl.clearColor(0, 0, 0, 1);

    // 清空颜色缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT);

    var x = e.offsetX;
    var y = e.offsetY;

    // 随机颜色 rgba
    var color = randomColor();

    points.push({ x, y, color });

    for (let i = 0; i < points.length; i++) {
      gl.vertexAttrib2f(a_position, points[i].x, points[i].y);

      // 设置颜色
      gl.vertexAttrib4f(a_color, ...points[i].color);

      // 绘制
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  };
}

function randomColor() {
  var r = Math.random();
  var g = Math.random();
  var b = Math.random();
  var a = 0.5 + Math.random() * 0.5;

  return [r, g, b, a];
}

// 创建程序
function createProgram(gl, vertexShader, fragmentShader) {
  // 创建程序
  var program = gl.createProgram();

  // 绑定着色器程序
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // 链接
  gl.linkProgram(program);

  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
}

// 创建着色器
function createShader(gl, type, source) {

  // 创建着色器
  var shader = gl.createShader(type);

  // 添加资源
  gl.shaderSource(shader, source);

  // 编译
  gl.compileShader(shader);

  // 判断是否编译成功
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
}
