const fs = require("fs");
const express = require("express");

const dbFile = "koders.json";

const createDatabase = (file) => {
  fs.writeFileSync(file, "[]", "utf8");
};

if (!fs.existsSync(dbFile)) {
  createDatabase(dbFile);
}

const server = express();
server.use(express.json());

const contentString = fs.readFileSync(dbFile, "utf8");
const content = JSON.parse(contentString);

server.post("/koders", (request, response) => {
  content.push(request.body);
  fs.writeFileSync(dbFile, JSON.stringify(content), "utf8");

  response.json({
    message: "Koder Created",
    content,
  });
});

server.delete("/koders/:name", (request, response) => {
  if (!content.find((koder) => koder.name === request.params.name)) {
    response.status(404);
    response.json({ message: "Koder not found" });
  }
  const remove = content.filter((koder) => koder.name !== request.params.name);
  fs.writeFileSync(dbFile, JSON.stringify(remove), "utf-8");
  response.json({ message: "Koder deleted", content });
});

server.get("/koders", (request, response) => {
  response.json(content);
});

server.delete("/koders", (request, response) => {
  createDatabase(dbFile);
  response.json({ message: "Koders Eliminated", content });
});

server.listen(8080, () => {
  console.log("listening on port 8080");
});
