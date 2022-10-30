class Parent {
  constructor(name) {
    this.name = name;
    this.children = [];
  }
  say() {
    console.log(`my name is ${this.name}`);
  }
  appendChildren(child) {
    this.children.push(child);
  }

  static getUUid() {
    return "parent";
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name);
    this.age = age;
  }

  intro() {
    console.log(`my name is ${this.name}, ${this.age} age.`);
  }
}
