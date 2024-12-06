
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

  bindEvent(gl, program);
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
