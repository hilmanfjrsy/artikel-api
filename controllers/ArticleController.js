const db = require("../models")

class ArticleController {
  createArticle = async (req, res, next) => {
    try {
      const user_id = req._user_id
      const body = req.body
      body.is_publish = true
      body.user_id = user_id

      await db.articles.create(body)
      let checkArticle = await db.articles.count({ where: { user_id } })
      if (checkArticle >= 3) await db.users.update({ status_monetize: true }, { where: { id: user_id } })

      let message = "Berhasil"
      return res.status(201).send({
        message,
        checkArticle
      })
    } catch (error) {
      return res.send(error)
    }
  }
  updateArticle = async (req, res, next) => {
    try {
      const id = req.params.id
      const body = req.body

      await db.articles.update(body, { where: { id } })

      let message = "Berhasil"
      return res.status(201).send({
        message
      })
    } catch (error) {
      return res.send(error)
    }
  }
  deleteArticle = async (req, res, next) => {
    try {
      const id = req.params.id
      const user_id = req._user_id

      await db.articles.destroy({ where: { id } })
      await db.user_views.destroy({ where: { article_id: id } })
      let checkArticle = await db.articles.count({ where: { id } })
      if (checkArticle < 3) await db.users.update({ status_monetize: false }, { where: { id: user_id } })

      let message = "Berhasil"
      return res.status(201).send({
        message
      })
    } catch (error) {
      return res.send(error)
    }
  }
}

module.exports = new ArticleController()