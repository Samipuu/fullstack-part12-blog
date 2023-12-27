const lodash = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (best, item) => {
        if (best.likes > item.likes) {
            return best
        }
        return item
    }

    return blogs.length === 0
        ? null
        : blogs.reduce(reducer, 0)
}

const mostLikes = (blogs) => {
    mostAuthor = ""
    most = 0
    blogs = lodash.groupBy(blogs, "author")
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    //console.log(lodash.groupBy(blogs, "author"))
    for (author in blogs) {
        sum = blogs[author].length === 0 ? 0 : blogs[author].reduce(reducer, 0)
        if (sum > most) {
            most = sum
            mostAuthor = author
        }
    }
    return { author: mostAuthor, likes: most }
}

const mostBlogs = (blogs) => {
    mostAuthor = ""
    most = 0
    blogs = lodash.groupBy(blogs, "author")

    for (author in blogs) {
        if (blogs[author].length > most) {
            most = blogs[author].length
            mostAuthor = author
        }
    }
    return { author: mostAuthor, blogs: most }
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostLikes, mostBlogs
}