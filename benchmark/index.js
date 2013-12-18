var Benchmark = require("benchmark"),
suite = new Benchmark.Suite(),
pc = require(".."),
bindable = require("bindable");

var tpls = {
  one: pc.template("{{'message'}}"),
  two: pc.template("{{message}}"),
  three: pc.template("hello")
}


suite.add("hello!", function () {
  tpls.three.bind(new bindable.Object());
});

suite.add("{{'message'}}", function () {
  tpls.one.bind(new bindable.Object());
});

suite.add("{{message}}", function () {
  tpls.two.bind(new bindable.Object());
});


suite.on("cycle", function (event) {
  console.log(String(event.target));
});


suite.on("complete", function() {
  console.log("Fastest is '%s'", this.filter("fastest").pluck("name"));
});

suite.run({ async: true });