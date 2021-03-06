/*!
 * BackboneFire is the officially supported Backbone binding for Firebase. The
 * bindings let you use special model and collection types that allow for
 * synchronizing data with Firebase.
 *
 * BackboneFire 0.5.1
 * https://github.com/firebase/backbonefire/
 * License: MIT
 */
 ;

var Backbone,
    _,  
    Firebase,
    context = window


if (module && module.exports){
  Backbone = require('backbone');
  _ = require('underscore');
  Firebase = require('firebase');
  context = module.exports
} 
  

_        =  _ || window._
Backbone = Backbone || window.Backbone
Firebase = Firebase || window.Firebase
context = module.exports || window.BackboneFire

context = function(a, b) { "use strict";
    b.Firebase = {}, 
    b.Firebase._getKey = function(a) {
        return "function" == typeof a.key ? a.key() : a.name() }, b.Firebase._determineAutoSync = function(b, c) {
        var d = Object.getPrototypeOf(b);
        return a.extend({ autoSync: d.hasOwnProperty("autoSync") ? d.autoSync : !0 }, this, c).autoSync }, b.Firebase.sync = function(a, c, d) {
        var e = c.toJSON(); "read" === a ? b.Firebase._readOnce(c.firebase, function(a) {
            var b = a.val();
            d.success && d.success(b) }, function(a) { d.error && d.error(a) }) : "create" === a ? b.Firebase._setWithCheck(c.firebase, e, d) : "update" === a ? b.Firebase._updateWithCheck(c.firebase, e, d) : "delete" === a && b.Firebase._setWithCheck(c.firebase, null, d) }, b.Firebase._readOnce = function(a, b) { a.once("value", b) }, b.Firebase._setToFirebase = function(a, b, c) { a.set(b, c) }, b.Firebase._updateToFirebase = function(a, b, c) { a.update(b, c) }, b.Firebase._onCompleteCheck = function(a, b, c) { c && (a && c.error ? c.error(b, a, c) : c.success && c.success(b, null, c)) }, b.Firebase._setWithCheck = function(a, c, d) { b.Firebase._setToFirebase(a, c, function(a) { b.Firebase._onCompleteCheck(a, c, d) }) }, b.Firebase._updateWithCheck = function(a, c, d) { b.Firebase._updateToFirebase(a, c, function(a) { b.Firebase._onCompleteCheck(a, c, d) }) }, b.Firebase._throwError = function(a) {
        throw new Error(a) }, b.Firebase._determineRef = function(a) {
        switch (typeof a) {
            case "string":
                return new Firebase(a);
            case "object":
                return a;
            default:
                b.Firebase._throwError("Invalid type passed to url property") } }, b.Firebase._checkId = function(a) {
        var c = a.val();
        return b.Firebase._isPrimitive(c) && b.Firebase._throwError("InvalidIdException: Models must have an Id. Note: You may be trying to sync a primitive value (int, string, bool)."), null === c && (c = {}), c.id = b.Firebase._getKey(a), c }, b.Firebase._isPrimitive = function(b) {
        return !a.isObject(b) && null !== b }, b.Firebase._promiseEvent = function(b) {
        var c = b.syncPromise,
            d = b.success,
            e = b.error,
            f = b.context || this,
            g = b.complete,
            h = setInterval(a.bind(function() { c.resolve && (c.success ? d.call(f) : c.err && e.call(f, c.err), g && g.call(f), clearInterval(h)) }, f)) };
    var c = function() {
            function a() { this._initialSync = {}, this.firebase.on("value", function(a) { this._setLocal(a), this._initialSync.resolve = !0, this._initialSync.success = !0, this.trigger("sync", this, null, null) }, function(a) { this._initialSync.resolve = !0, this._initialSync.err = a, this.trigger("error", this, a, null) }, this), this._listenLocalChange(function(a) { this.firebase.update(a) }) }
            return a.protoype = { fetch: function(a) { b.Firebase._promiseEvent({ syncPromise: this._initialSync, context: this, success: function() { this.trigger("sync", this, null, a) }, error: function(b) { this.trigger("err", this, b, a) }, complete: function() { b.Firebase._onCompleteCheck(this._initialSync.err, this, a) } }) } }, a }(),
        d = function() {
            function a() { this._listenLocalChange(function(a) { this.set(a, { silent: !0 }) }) }
            return a }();
    
    b.Firebase.Model = b.Model.extend({ constructor: function(e, f) { b.Model.apply(this, arguments);
            var g = a.result(this, "defaults");
            switch (this.once("sync", function() { this.set(a.defaults(this.toJSON(), g)) }), this.autoSync = b.Firebase._determineAutoSync(this, f), typeof this.url) {
                case "string":
                    this.firebase = b.Firebase._determineRef(this.url);
                    break;
                case "function":
                    this.firebase = b.Firebase._determineRef(this.url());
                    break;
                case "object":
                    this.firebase = b.Firebase._determineRef(this.url);
                    break;
                default:
                    b.Firebase._throwError("url parameter required") }
            this.autoSync ? (a.extend(this, c.protoype), c.apply(this, arguments)) : (d.apply(this, arguments), a.extend(this, d.protoype)) }, sync: function(a, c, d) { b.Firebase.sync(a, c, d) }, _setId: function(a) { this.isNew() && this.set("id", b.Firebase._getKey(a), { silent: !0 }) }, _setLocal: function(a) {
            var b = this._unsetAttributes(a);
            this.set(b) }, _unsetAttributes: function(c) {
            var d = b.Firebase._checkId(c);
            if ("object" == typeof d && null !== d) {
                var e = a.difference(a.keys(this.attributes), a.keys(d));
                a.each(e, a.bind(function(a) { this.unset(a) }, this)) }
            return this._setId(c), d }, _updateModel: function(b) {
            var c = b.changedAttributes();
            return a.each(b.changed, function(a, b) {
                ("undefined" == typeof a || null === a) && ("id" == b ? delete c[b] : c[b] = null) }), c }, _listenLocalChange: function(b) {
            var c = b ? "on" : "off";
            this[c]("change", function(c) {
                var d = this._updateModel(c);
                a.isFunction(b) && b.call(this, d) }, this) } });
    
    var e = function() {
            function c() {}
            return c.protoype = { create: function(c, d) {
                    return c.id = b.Firebase._getKey(this.firebase.push()), d = a.extend({ autoSync: !1 }, d), b.Collection.prototype.create.call(this, c, d) }, add: function(c, d) {
                    return c.id = b.Firebase._getKey(this.firebase.push()), d = a.extend({ autoSync: !1 }, d), b.Collection.prototype.add.call(this, c, d) }, sync: function(a, c, d) { b.Firebase.sync(a, c, d) }, fetch: function(b) { b = b ? a.clone(b) : {}, void 0 === b.parse && (b.parse = !0);
                    var c = b.success,
                        d = this;
                    return b.success = function(e) {
                        var f = [],
                            g = a.keys(e);
                        a.each(g, function(a) { f.push(e[a]) });
                        var h = b.reset ? "reset" : "set";
                        d[h](f, b), c && c(d, f, b), b.autoSync = !1, b.url = this.url, d.trigger("sync", d, f, b) }, this.sync("read", this, b) } }, c }(),
        f = function() {
            function c() { this._initialSync = {}, this.firebase.on("child_added", a.bind(this._childAdded, this)), this.firebase.on("child_moved", a.bind(this._childMoved, this)), this.firebase.on("child_changed", a.bind(this._childChanged, this)), this.firebase.on("child_removed", a.bind(this._childRemoved, this)), a.defer(a.bind(function() { this.firebase.once("value", function() { this._initialSync.resolve = !0, this._initialSync.success = !0, this.trigger("sync", this, null, null) }, function(a) { this._initialSync.resolve = !0, this._initialSync.err = a, this.trigger("error", this, a, null) }, this) }, this)), this.listenTo(this, "change", this._updateModel, this), this.listenTo(this, "destroy", this._removeModel, this) }
            return c.protoype = { add: function(b, c) {
                    var d = this._parseModels(b);
                    c = c ? a.clone(c) : {}, c.success = a.isFunction(c.success) ? c.success : function() {};
                    for (var e = 0; e < d.length; e++) {
                        var f = d[e];
                        c.silent === !0 && (this._suppressEvent = !0);
                        var g = this.firebase.ref().child(f.id);
                        g.set(f, a.bind(c.success, f)) }
                    return d }, create: function(b, c) {
                    if (c = c ? a.clone(c) : {}, c.wait && this._log("Wait option provided to create, ignoring."), !b) return !1;
                    var d = this.add([b], c);
                    return d[0] }, remove: function(c, d) {
                    var e = this._parseModels(c);
                    d = d ? a.clone(d) : {}, d.success = a.isFunction(d.success) ? d.success : function() {};
                    for (var f = 0; f < e.length; f++) {
                        var g = e[f],
                            h = this.firebase.child(g.id);
                        d.silent === !0 && (this._suppressEvent = !0), b.Firebase._setWithCheck(h, null, d) }
                    return e }, reset: function(b, c) { c = c ? a.clone(c) : {}, this.remove(this.models, { silent: !0 });
                    var d = this.add(b, { silent: !0 });
                    return c.silent || this.trigger("reset", this, c), d }, fetch: function(a) { b.Firebase._promiseEvent({ syncPromise: this._initialSync, context: this, success: function() { this.trigger("sync", this, null, a) }, error: function(b) { this.trigger("err", this, b, a) }, complete: function() { b.Firebase._onCompleteCheck(this._initialSync.err, this, a) } }) }, _log: function(a) { console && console.log && console.log(a) }, _parseModels: function(c, d) {
                    var e = [],
                        f = !a.isArray(c);
                    c = f ? c ? [c] : [] : c.slice();
                    for (var g = 0; g < c.length; g++) {
                        var h = c[g];
                        h.id || (h.id = b.Firebase._getKey(this.firebase.push())), h = b.Collection.prototype._prepareModel.call(this, h, d), h.toJSON && "function" == typeof h.toJSON && (h = h.toJSON()), e.push(h) }
                    return e }, _childAdded: function(a) {
                    var c = b.Firebase._checkId(a);
                    this._suppressEvent === !0 ? (this._suppressEvent = !1, b.Collection.prototype.add.call(this, [c], { silent: !0 })) : b.Collection.prototype.add.call(this, [c]), this.get(c.id)._remoteAttributes = c }, _childMoved: function() {}, _childChanged: function(c) {
                    var d = b.Firebase._checkId(c),
                        e = a.find(this.models, function(a) {
                            return a.id == d.id });
                    if (!e) return void this._childAdded(c);
                    this._preventSync(e, !0), e._remoteAttributes = d;
                    var f = a.difference(a.keys(e.attributes), a.keys(d));
                    a.each(f, function(a) { e.unset(a) }), e.set(d), this.trigger("sync", this), this._preventSync(e, !1) }, _childRemoved: function(a) {
                    var c = b.Firebase._checkId(a);
                    this._suppressEvent === !0 ? (this._suppressEvent = !1, b.Collection.prototype.remove.call(this, [c], { silent: !0 })) : (this.trigger("sync", this), b.Collection.prototype.remove.call(this, [c])) }, _updateModel: function(b) {
                    var c, d, e, f;
                    b._remoteChanging || (c = b._remoteAttributes || {}, d = b.toJSON(), e = this._compareAttributes(c, d), f = this.firebase.ref().child(b.id), a.has(e, ".priority") ? this._setWithPriority(f, d) : this._updateToFirebase(f, d)) }, _compareAttributes: function(b, c) {
                    var d = {},
                        e = a.union(a.keys(b), a.keys(c));
                    return a.each(e, function(e) { a.has(c, e) ? c[e] != b[e] && (d[e] = c[e]) : d[e] = null }), d }, _setWithPriority: function(a, b) {
                    var c = b[".priority"];
                    return delete b[".priority"], a.setWithPriority(b, c), b }, _updateToFirebase: function(a, b) { a.update(b) }, _removeModel: function(c, d, e) { e = e ? a.clone(e) : {}, e.success = a.isFunction(e.success) ? e.success : function() {};
                    var f = this.firebase.child(c.id);
                    b.Firebase._setWithCheck(f, null, a.bind(e.success, c)) }, _preventSync: function(a, b) { a._remoteChanging = b } }, c }();
    
    b.Firebase.Collection = b.Collection.extend({ constructor: function(c, d) { b.Collection.apply(this, arguments);
            var g = this,
                h = g.model;
            switch (this.autoSync = b.Firebase._determineAutoSync(this, d), typeof this.url) {
                case "string":
                    this.firebase = b.Firebase._determineRef(this.url);
                    break;
                case "function":
                    this.firebase = b.Firebase._determineRef(this.url());
                    break;
                case "object":
                    this.firebase = b.Firebase._determineRef(this.url);
                    break;
                default:
                    throw new Error("url parameter required") }
            this.autoSync ? (a.extend(this, f.protoype), f.apply(this, arguments)) : (a.extend(this, e.protoype), e.apply(this, arguments)), this.model = function(a, c) {
                var d = new h(a, c);
                return d.autoSync = !1, d.firebase = g.firebase.ref().child(d.id), d.sync = b.Firebase.sync, d.on("change", function(a) {
                    var c = b.Firebase.Model.prototype._updateModel(a);
                    a.set(c, { silent: !0 }) }), d } }, comparator: function(a) {
            return a.id } })
    return b
  }( _ , Backbone, Firebase);
