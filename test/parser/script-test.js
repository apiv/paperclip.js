var parser = require("../../lib/parser2/parser.js"),
expect     = require("expect.js");

describe("parser/script#", function () {


  describe("references", function () {

  });

  describe("scripts", function () {
    it("automatically assigns value script", function () {
        var ast = parser.parse("{{ a }}")[0];
        expect(ast.scripts.value.value).to.be("a");
    });

    it("properly parses scripts", function () {
        var ast = parser.parse("{{ a:b, c:d, e:f}}")[0];
        expect(ast.scripts.a.value).to.be("b");
        expect(ast.scripts.c.value).to.be("d");
        expect(ast.scripts.e.value).to.be("f");
    });
  });

  describe("objects", function () {
    it("can have different types of keys", function () {
        var ast = parser.parse("{{{ a:b, 'c':d, \"e\":'f'} }}")[0];
        expect(ast.scripts.value.value[0].key).to.be("a");
        expect(ast.scripts.value.value[1].key).to.be("c");
        expect(ast.scripts.value.value[2].key).to.be("e");
    });
  });

  describe("numbers", function () {
    it("can parse an integer", function () {
      expect((parser.parse("{{ 55 }}")[0].scripts.value.value)).to.be(55);
    });

    it("can parse a floating point", function () {
      expect((parser.parse("{{ .5 }}")[0].scripts.value.value)).to.be(.5);
      expect((parser.parse("{{ 333.509 }}")[0].scripts.value.value)).to.be(333.509);
    });

    it("can parse a negative values", function () {
      expect((parser.parse("{{ -.5 }}")[0].scripts.value.value)).to.be(-.5);
      expect((parser.parse("{{ -333.509 }}")[0].scripts.value.value)).to.be(-333.509);
    });

  });

  describe("reserved words", function () {
    it("can parse boolean values", function () {
      expect(parser.parse("{{ true }}")[0].scripts.value.value).to.be(true);
      expect(parser.parse("{{ false }}")[0].scripts.value.value).to.be(false);
    });
    it("can parse undefined values", function () {
      expect(parser.parse("{{ undefined }}")[0].scripts.value.value).to.be(void 0);
    });
    it("can parse null values", function () {
      expect(parser.parse("{{ null }}")[0].scripts.value.value).to.be(null);
    });
  });



  describe("operations", function () {

    describe("ternery", function () {
      it("parses properly", function () {
        var ast = parser.parse("{{a?b:c}}")[0].scripts.value;

      });
      it("can nest ternery operations", function () {
        var ast = parser.parse("{{a ? b ? c ? d : e : f : g }}")[0].scripts.value;


        expect(ast.condition.value).to.be("a"); 
        expect(ast.right.value).to.be("g");
        expect(ast.left.condition.value).to.be("b");
        expect(ast.left.right.value).to.be("f");
        expect(ast.left.left.condition.value).to.be("c");
        expect(ast.left.left.right.value).to.be("e");
      });
    });

    describe("equations", function () {
      it("can add / subtract two numbers together", function () {
        var ast = parser.parse("{{ 5+6 }}")[0].scripts.value;
        expect(ast.left.value).to.be(5);
        expect(ast.right.value).to.be(6);
        ast = parser.parse("{{ 5-6 }}")[0].scripts.value;
        expect(ast.left.value).to.be(5);
        expect(ast.right.value).to.be(6);
      });

      it("gets the order of operations correct", function () {
        var ast = parser.parse("{{ 3+4*5/(6+7) }}")[0].scripts.value;
        expect(ast.left.value).to.be(3);
        expect(ast.right.left.value).to.be(4);
        expect(ast.right.right.left.value).to.be(5);
        expect(ast.right.right.right.left.value).to.be(6);
        expect(ast.right.right.right.right.value).to.be(7);
      });

      it("works with modulus", function () {
        var ast = parser.parse("{{ 3*4%5 }}")[0].scripts.value;
        expect(ast.left.left.value).to.be(3);
        expect(ast.left.right.value).to.be(4);
        expect(ast.right.value).to.be(5);


        var ast = parser.parse("{{ 3+4%5 }}")[0].scripts.value;
        expect(ast.left.value).to.be(3);
        expect(ast.right.left.value).to.be(4);
        expect(ast.right.right.value).to.be(5);
      });
    });
  
    describe("comparisons", function () {
      it("can parse &&", function () {
        var ast = parser.parse("{{ true&&false }}")[0].scripts.value;
        expect(ast.left.value).to.be(true);
        expect(ast.right.value).to.be(false);
      });
    })
  });
});
