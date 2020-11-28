export class Color {

  static BLACK = 'black';
  static RED = 'red';
}

export class Text {

  constructor(str = '') {
    this.text = str;
  }

  text: String;
  color?: Color;

  toString() {
    return this.text;
  }

}
