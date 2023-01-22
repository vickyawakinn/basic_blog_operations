const express = require("express");
const router = express.Router();

const Article = require("./../models/article");

router.get("/", (req, res) => {
    res.send("article 1");
});

// to get a new blog entry page
router.get("/new", (req, res) => {
    res.render("articles/new", { article: new Article() });
});

router.get("/edit/:slug", async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        res.render("articles/edit", { article: article });
    } catch (err) {
        console.log(err);
    }
});

// to get a particular blog page
router.get("/:slug", async (req, res) => {
    const article = await Article.findOne({
        slug: req.params.slug,
    });
    if (article == null) res.redirect("/");
    res.render("articles/show", { article: article });
});

// to create a new blog
router.post(
    "/",
    async (req, res, next) => {
        req.article = new Article();
        next();
    },
    saveArticleAndRedirect("new")
);

router.put(
    "/:slug",
    async (req, res, next) => {
        req.article = await Article.findOne({
            slug: req.params.slug,
        });
        next();
    },
    saveArticleAndRedirect("edit")
);

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        try {
            await article.save();
            if (path == "edit") {
                res.redirect(`${article.slug}`);
            } else {
                res.redirect(`articles/${article.slug}`);
            }
        } catch (err) {
            res.render(`articles/${path}`, { article: article });
        }
    };
}

router.delete("/:id", async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

module.exports = router;
