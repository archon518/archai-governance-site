const fs = require("fs");

module.exports = {
  validate() {
    const graph = JSON.parse(fs.readFileSync("dependency_graph.json"));
    const loaded = [];

    Object.keys(graph).forEach(sub => {
      const deps = graph[sub];
      deps.forEach(dep => {
        if (!graph[dep]) {
          throw new Error("Missing dependency: " + dep);
        }
      });
      loaded.push(sub);
    });

    return true;
  }
};
