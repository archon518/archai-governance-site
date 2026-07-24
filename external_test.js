const external = require("./external_router.js");

external.execute("core.ping", "hello world");
external.execute("auth.login", { username: "starr" });
external.execute("data.save", { item: 999 });

