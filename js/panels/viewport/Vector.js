
export default class Vector {

  static vec2() {
    return [0.0, 0.0];
  }

  static vec2(x, y) {
    return [x, y];
  }



  static vec3() {
    return [0.0, 0.0, 0.0];
  }

  static vec3(x, y, z) {
    return [x, y, z];
  }

  static vec3_length(v) {
    return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
  }

  static vec3_scaled(v, x, y, z) {
    return [v[0]*x, v[1]*y, v[2]*z];
  }

  static vec3_subtract(v1, v2) {
    return [v1[0]-v2[0], v1[1]-v2[1], v1[2]-v2[2]];
  }

  static vec3_add(v1, v2) {
    return [v1[0]+v2[0], v1[1]+v2[1], v1[2]+v2[2]];
  }

  static vec3_normalized(v) {
    var l = Vector.vec3_length(v);
    if (l !== 0.0) {
      var s = 1.0/l;
      return Vector.vec3_scaled(v, s, s, s);
    }
    return [v[0], v[1], v[2]];
  }

  static vec3_crossed(v1, v2) {
    return [
      v1[1]*v2[2] - v1[2]*v2[1],
      v1[2]*v2[0] - v1[0]*v2[2],
      v1[0]*v2[1] - v1[1]*v2[0]
    ];
  }



  static vec4() {
    return ([0.0, 0.0, 0.0, 0.0]);
  }

  static vec4(x, y, z, w = 1.0) {
    return ([x, y, z, w]);
  }



  static mat4_identity() {
    return [
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ];
  }

  static mat4_translate(x, y, z) {
    return [
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      x,   y,   z,   1.0
    ];
  }

  static mat4_scale(x, y, z) {
    return [
      x,   0.0, 0.0, 0.0,
      0.0, y,   0.0, 0.0,
      0.0, 0.0, z,   0.0,
      0.0, 0.0, 0.0, 1.0
    ];
  }

  static mat4_rotX(radians) {
    var c = Math.cos(radians);
    var s = Math.sin(radians);
    return [
      1.0, 0.0, 0.0, 0.0,
      0.0, c,   s,   0.0,
      0.0, -s,  c,   0.0,
      0.0, 0.0, 0.0, 1.0
    ];
  }

  static mat4_rotY(radians) {
    var c = Math.cos(radians);
    var s = Math.sin(radians);
    return [
      c,   0.0, -s,  0.0,
      0.0, 1.0, 0.0, 0.0,
      s,   0.0, c,   0.0,
      0.0, 0.0, 0.0, 1.0
    ];
  }

  static mat4_rotZ(radians) {
    var c = Math.cos(radians);
    var s = Math.sin(radians);
    return [
      c,   s, 0.0, 0.0,
      -s,  c,   0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ];
  }

  static mat4_frustum(left, right, bottom, top, near, far) {
    var a = (2.0 * near) / (right - left);
    var b = (2.0 * near) / (top - bottom);
    var c = (right + left) / (right - left);
    var d = (top + bottom) / (top - bottom);
    var e = -(far + near) / (far - near);
    var f = (-2.0 * far * near) / (far - near);

    return [
      a,   0.0, 0.0, 0.0,
      0.0, b,   0.0, 0.0,
      c,   d,   e,  -1.0,
      0.0, 0.0, f,   1.0
    ];
  }

  static mat4_ortho(left, right, bottom, top, near, far) {
    var a = 2.0 / (right - left);
    var b = 2.0/ (top - bottom);
    var c = 2.0 / (far - near);
    var d = -(right + left) / (right - left);
    var e = -(top + bottom) / (top - bottom);
    var f = -(far + near) / (far - near);

    return [
      a,   0.0, 0.0, 0.0,
      0.0, b,   0.0, 0.0,
      0.0, 0.0, c,   0.0,
      d,   e,   f,   1.0
    ];
  }

  static mat4_multiply(m1, m2) {
    return ([
      m1[0]*m2[0] + m1[4]*m2[1] + m1[8]*m2[2]  + m1[12]*m2[3],
      m1[1]*m2[0] + m1[5]*m2[1] + m1[9]*m2[2]  + m1[13]*m2[3],
      m1[2]*m2[0] + m1[6]*m2[1] + m1[10]*m2[2] + m1[14]*m2[3],
      m1[3]*m2[0] + m1[7]*m2[1] + m1[11]*m2[2] + m1[15]*m2[3],

      m1[0]*m2[4] + m1[4]*m2[5] + m1[8]*m2[6]  + m1[12]*m2[7],
      m1[1]*m2[4] + m1[5]*m2[5] + m1[9]*m2[6]  + m1[13]*m2[7],
      m1[2]*m2[4] + m1[6]*m2[5] + m1[10]*m2[6] + m1[14]*m2[7],
      m1[3]*m2[4] + m1[7]*m2[5] + m1[11]*m2[6] + m1[15]*m2[7],

      m1[0]*m2[8] + m1[4]*m2[9] + m1[8]*m2[10]  + m1[12]*m2[11],
      m1[1]*m2[8] + m1[5]*m2[9] + m1[9]*m2[10]  + m1[13]*m2[11],
      m1[2]*m2[8] + m1[6]*m2[9] + m1[10]*m2[10] + m1[14]*m2[11],
      m1[3]*m2[8] + m1[7]*m2[9] + m1[11]*m2[10] + m1[15]*m2[11],

      m1[0]*m2[12] + m1[4]*m2[13] + m1[8]*m2[14]  + m1[12]*m2[15],
      m1[1]*m2[12] + m1[5]*m2[13] + m1[9]*m2[14]  + m1[13]*m2[15],
      m1[2]*m2[12] + m1[6]*m2[13] + m1[10]*m2[14] + m1[14]*m2[15],
      m1[3]*m2[12] + m1[7]*m2[13] + m1[11]*m2[14] + m1[15]*m2[15]
    ]);
  }

  static mat4_lookAt(eye, center, up)
    {
      var f = Vector.vec3_normalized(Vector.vec3_subtract(center, eye));
      var s = Vector.vec3_normalized(Vector.vec3_crossed(f, up));
      var u = Vector.vec3_crossed(s, f);

      var m = [
        s[0], u[0], -f[0], 0.0,
        s[1], u[1], -f[1], 0.0,
        s[2], u[2], -f[2], 0.0,
        0.0,  0.0,   0.0,  1.0
      ];

      return Vector.mat4_multiply(m, Vector.mat4_translate(-eye[0], -eye[1], -eye[2]));
    }
};
