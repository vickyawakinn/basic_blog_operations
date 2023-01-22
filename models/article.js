const mongoose = require("mongoose");
const marked = require("marked");
const slug = require("slugify");
const { default: slugify } = require("slugify");

const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    markdown: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    sanitizedHTML: {
        type: String,
        required: true,
    },
});

articleSchema.pre("validate", function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    if (this.markdown) {
        this.sanitizedHTML = dompurify.sanitize(marked.parse(this.markdown));
    }
    next();
});

module.exports = mongoose.model("Article", articleSchema);
