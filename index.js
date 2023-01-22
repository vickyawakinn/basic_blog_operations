const PORT = 5000;

const express = require("express");
const articleRouter = require("./routes/article");
const app = express();

const methodOverride = require("method-override");

const Article = require("./models/article");

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost/blog");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.use("/articles", articleRouter);

app.get("/", async (req, res) => {
    const articles = await Article.find().sort({
        date: "desc",
    });
    res.render("articles/index", { articles: articles });
});

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});
