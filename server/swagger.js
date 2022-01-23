const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Walkle API",
    description: "Walkle Api Spec",
  },

  host: process.env.HOST,
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./index.js");
});
