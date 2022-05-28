const db = require("../models")

class CommetsController {
  create = async (req, res, next) => {
    try {
      const body = req.body
      body.user_id = req._user_id
      await db.comments.create(body)

      let message = "Berhasil"
      return res.status(201).send({ message })
    } catch (error) {
      return res.send(error)
    }
  }

  getAll = async (req, res, next) => {
    try {
      const user_id = req._user_id
      const article_id = req.query.article_id
      let data = []
      if (article_id) {
        data = await db.sequelize.query(`SELECT cm.id,cm.article_id,cm.comment, a.avatar,cm."createdAt",
                CASE
                  WHEN (u.id = '${user_id}') THEN 'Anda'
                  ELSE u.name
                END AS "name" from comments cm 
                JOIN users u on u.id=cm.user_id and cm."deletedAt" is null and u."deletedAt" is null
                JOIN avatar a on a.id=u.avatar_id and a."deletedAt" is null and cm.article_id='${article_id}'`, { type: db.sequelize.QueryTypes.SELECT })
      }
      let message = "Berhasil"
      return res.status(200).send({ message, data })
    } catch (error) {
      return res.send(error)
    }
  }
}
module.exports = new CommetsController()