const { createServer } = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const routes = [];

// const res = fs.readdirSync(path.join(__dirname, "routes"), {
//   recursive: true,
//   withFileTypes: true
// });
// console.log(res);

function recursiveReadDir(route, endpoint = "/") {
  const read = fs.readdirSync(route, { encoding: "utf8", withFileTypes: true });

  for (let fileElement of read) {
    if (fileElement.isDirectory()) {
      const newEndpoint =
        endpoint === "/"
          ? endpoint + fileElement.name
          : endpoint + "/" + fileElement.name;
      recursiveReadDir(path.join(route, fileElement.name), newEndpoint);
    } else {
      routes.push({
        path: endpoint,
        response: fs.readFileSync(path.join(route, fileElement.name), {
          encoding: "utf8"
        })
      });
    }
  }
}

recursiveReadDir(path.join(__dirname, "routes"));

console.log(routes);

const server = createServer((req, res) => {
  routes.forEach((route) => {
    if (req.url === route.path) {
      res.end(route.response);
    }
  });
});

server.listen(8080, () => {
  console.log("Server on port 8080");
});
