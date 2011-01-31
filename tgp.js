var TGP = TGP || {};

(function() {

  function MakeObject(name) {
      if (!this[name]) {
          this[name] = {};
      }
  }

  function Namespace() {
      var lastNamespace = this;

      var firstArg = 0;

      if (arguments[0] === true) {
          lastNamespace = TGP.globalNamespace;
          firstArg = 1;
      }

      for (var i = firstArg, length = arguments.length; i < length; ++i) {
          if (!lastNamespace[arguments[i]]) {
              lastNamespace[arguments[i]] = { Namespace: Namespace, MakeObject: MakeObject };
          }

          lastNamespace = lastNamespace[arguments[i]];
      }

      return lastNamespace;
  }

  this.MakeObject = MakeObject;
  this.Namespace  = Namespace;

}).call(TGP);
