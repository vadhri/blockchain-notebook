
var lrs = require("lrs"); 

var alice = lrs.gen();
var bob = lrs.gen();
var eve = lrs.gen();

var group = [alice, bob, eve].map((m) => m.publicKey);

var signed = lrs.sign(group, alice, "Signed message 1");
console.log(lrs.verify(group, signed, "Signed message 1"));
var signed2 = lrs.sign(group, alice, "Signed message 2");
console.log(lrs.link(signed, signed2));