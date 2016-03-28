
; module.exports = (function(m,w){
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Firebase = require('firebase'),
    BackboneFire = require('./dist/backbonefire.js')

  console.log(BackboneFire.Firebase._getKey)
  
  if(m && m.exports){
    return BackboneFire
  } else {
    w.BackboneFire = BackboneFire
  }

})(module || window )
