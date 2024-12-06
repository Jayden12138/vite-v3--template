attribute vec2 a_position;
attribute vec4 a_color;
uniform vec2 screenSize;
varying vec4 v_color;
void main() {
  float x = a_position.x * 2.0 / screenSize.x - 1.0;
  float y = 1.0 - (a_position.y * 2.0 / screenSize.y);

  gl_Position = vec4(x, y, 0, 1);
  gl_PointSize = 10.0;
  v_color = a_color;
}
