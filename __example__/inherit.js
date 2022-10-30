var __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
var Parent = /** @class */ (function () {
  function Parent(name) {
    this.name = name;
    this.children = [];
  }
  Parent.prototype.say = function () {
    console.log("my name is " + this.name);
  };
  Parent.prototype.appendChildren = function (child) {
    this.children.push(child);
  };
  Parent.getUUid = function () {
    return "parent";
  };
  return Parent;
}());
var Child = /** @class */ (function (_super) {
  __extends(Child, _super);
  function Child(name, age) {
    var _this = _super.call(this, name) || this;
    _this.age = age;
    return _this;
  }
  Child.prototype.intro = function () {
    console.log("my name is " + this.name + ", " + this.age + " age.");
  };
  return Child;
}(Parent));
