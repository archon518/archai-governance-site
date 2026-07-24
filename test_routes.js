const router = require("./router.js");

console.log(router.send("core.ping", "hello"));
console.log(router.send("auth.login", { username: "starr" }));
console.log(router.send("data.save", { item: 123 }));
