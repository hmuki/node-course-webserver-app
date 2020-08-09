const path = require("path");
const express = require("express");
const hbs = require("hbs");

const forecast = require("./utils/forecast");
const geocode = require("./utils/geocode");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Hoffmann",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Hoffmann",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text.",
    title: "Help",
    name: "Hoffmann",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address term",
    });
  }
  const { address } = req.query;
  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({
        error: error,
      });
    }
    forecast(latitude, longitude, (error, data) => {
      if (error) {
        return res.send({
          error: error,
        });
      }
      res.send({
        forecast: data,
        location: location,
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("error", {
    title: "Error!",
    name: "Hoffmann",
    errorMessage: "Help article not found.",
  });
});

app.get("*", (req, res) => {
  res.render("error", {
    title: "Error!",
    name: "Hoffmann",
    errorMessage: "Page not found.",
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port + ".");
});
