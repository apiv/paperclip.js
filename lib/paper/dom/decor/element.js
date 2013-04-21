// Generated by CoffeeScript 1.6.2
(function() {
  var AttributeBinding, Decorator, Template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Template = require("../../template");

  AttributeBinding = (function() {
    function AttributeBinding(data, attribute, element) {
      this.data = data;
      this.attribute = attribute;
      this.element = element;
      this._elementChange = __bind(this._elementChange, this);
      this._change = __bind(this._change, this);
      this.name = attribute.name;
      this._template = new Template(this.attribute.value);
      this._renderer = this._template.render(this.data);
    }

    AttributeBinding.prototype.init = function() {
      this._renderer.bind("text").to(this._change);
      return $(this.element).bind("mouseup keydown keyup change", this._elementChange);
    };

    AttributeBinding.prototype._change = function(value) {
      return this.attribute.value = this.currentValue = value;
    };

    AttributeBinding.prototype._elementChange = function(event) {
      var key, refs, refsByKey, value, _i, _len, _results;

      if (this.name === "value") {
        value = this.element.value;
      } else {
        value = this.attribute.value;
      }
      if (this.currentValue !== value && (refs = this._bothWays()).length) {
        _results = [];
        for (_i = 0, _len = refs.length; _i < _len; _i++) {
          refsByKey = refs[_i];
          _results.push((function() {
            var _results1;

            _results1 = [];
            for (key in refsByKey) {
              _results1.push(refsByKey[key].value(value));
            }
            return _results1;
          })());
        }
        return _results;
      }
    };

    AttributeBinding.prototype._bothWays = function() {
      var binding, refs, _i, _len, _ref;

      refs = [];
      _ref = this._renderer.bindings;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        if (binding.clip.options.bothWays) {
          refs.push(binding.clip.options.bothWays);
        }
      }
      return refs;
    };

    return AttributeBinding;

  })();

  Decorator = (function() {
    function Decorator(data, element) {
      this.data = data;
      this.element = element;
      this._bindings = [];
    }

    Decorator.prototype.init = function() {
      var attr, binding, _i, _len, _ref, _results;

      _ref = this.element.attributes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attr = _ref[_i];
        if (!!~String(attr.value).indexOf("{{")) {
          this._bindings.push(binding = new AttributeBinding(this.data, attr, this.element));
          _results.push(binding.init());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Decorator.test = function(element) {
      var attr, _i, _len, _ref;

      _ref = element.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attr = _ref[_i];
        if (!!~String(attr.value).indexOf("{{")) {
          return true;
        }
      }
      return false;
    };

    return Decorator;

  })();

  module.exports = Decorator;

}).call(this);