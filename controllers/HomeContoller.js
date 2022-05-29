const db = require("../models")

class HomeContoller {
  homes = async (req, res, next) => {
    try {
      const body = req.body

      let find = {
        attributes: {
          include: [
            [db.sequelize.literal(`(select count(*) from user_views where article_id="articles".id )`), 'total_views'],
            [db.sequelize.literal(`(select title from category where id="articles".category_id )`), 'category_name'],
          ],
          exclude: ['contents'],
        },
        where: { deletedAt: null, is_publish: true },
        include: [{
          model: db.users,
          attributes: ['id', 'name', 'avatar_id'],
          where: { deletedAt: null },
          include: [{
            model: db.avatar,
            where: { deletedAt: null }
          }]
        }]
      }

      const popular = await db.articles.findAll({
        ...find,
        order: [[db.sequelize.literal(`(total_views)`), 'DESC']],
        limit: 3,
      })

      const new_articles = await db.articles.findAll({
        ...find,
        order: [['createdAt', 'DESC']],
        limit: 5
      })

      let message = "Berhasil"
      return res.status(200).send({
        message,
        popular,
        new_articles
      })
    } catch (error) {
      return res.send(error)
    }
  }

  explore = async (req, res, next) => {
    try {
      let where = {
        deletedAt: null,
        is_publish: true,
      }
      if (req.query.search) {
        where.title = {
          [db.Sequelize.Op.iLike]: `%${req.query.search}%`
        }
      }
      if (req.query.category_id) {
        where.category_id = req.query.category_id
      }
      let find = {
        attributes: {
          include: [
            [db.sequelize.literal(`(select count(*) from user_views where article_id="articles".id )`), 'total_views'],
            [db.sequelize.literal(`(select title from category where id="articles".category_id )`), 'category_name'],
          ],
          exclude: ['contents'],
        },
        where,
        limit: 10,
        offset: 10 * (req.query.page - 1),
        include: [{
          model: db.users,
          attributes: ['id', 'name', 'avatar_id'],
          where: { deletedAt: null },
          include: [{
            model: db.avatar,
            where: { deletedAt: null }
          }]
        }]
      }

      const explore = await db.articles.findAll({
        ...find,
        order: [['createdAt', 'DESC']],
      })
      let message = "Berhasil"
      return res.status(200).send({
        message,
        explore
      })
    } catch (error) {
      return res.send(error)
    }
  }

  myArticles = async (req, res, next) => {
    try {
      const user_id = req._user_id
      let where = {
        deletedAt: null,
        is_publish: true,
        user_id
      }
      let find = {
        attributes: {
          include: [
            [db.sequelize.literal(`(select count(*) from user_views where article_id="articles".id )`), 'total_views'],
            [db.sequelize.literal(`(select title from category where id="articles".category_id )`), 'category_name'],
          ],
        },
        where,
        include: [{
          model: db.users,
          attributes: ['id', 'name', 'avatar_id'],
          where: { deletedAt: null },
          include: [{
            model: db.avatar,
            where: { deletedAt: null }
          }]
        }]
      }

      const my_articles = await db.articles.findAll({
        ...find,
        order: [['createdAt', 'DESC']],
      })
      let checkUsers = await db.users.findOne({ where: { id: user_id }, raw: true })
      delete checkUsers['password']
      let avatar = await db.avatar.findOne({ where: { id: checkUsers.avatar_id, deletedAt: null } })
      let count = await db.sequelize.query(`SELECT count(*), sum(uv.duration) from user_views uv
          JOIN articles a on a.id=uv.article_id and a."deletedAt" is null and a.is_publish=true and a.user_id='${checkUsers.id}'`, { type: db.sequelize.QueryTypes.SELECT })
      let total_articles = await db.articles.count({ where: { user_id: checkUsers.id } })

      checkUsers.total_articles = total_articles
      checkUsers.sum_duration = count[0].sum
      checkUsers.total_views = count[0].count
      checkUsers.avatar = avatar

      let message = "Berhasil"
      return res.status(200).send({
        message,
        my_articles,
        checkUsers
      })
    } catch (error) {
      return res.send(error)
    }
  }
  detailArticles = async (req, res, next) => {
    try {
      const id = req.params.id

      let where = {
        deletedAt: null,
        is_publish: true,
        id
      }
      let find = {
        attributes: {
          include: [
            [db.sequelize.literal(`(select count(*) from user_views where article_id="articles".id )`), 'total_views'],
            [db.sequelize.literal(`(select count(*) from comments where article_id="articles".id )`), 'total_comment'],
            [db.sequelize.literal(`(select title from category where id="articles".category_id )`), 'category_name'],
          ],
        },
        where,
        include: [{
          model: db.users,
          attributes: ['id', 'name', 'avatar_id'],
          where: { deletedAt: null },
          include: [{
            model: db.avatar,
            where: { deletedAt: null }
          }]
        }]
      }

      const articles = await db.articles.findOne({
        ...find,
        order: [['createdAt', 'DESC']],
      })
      let message = "Berhasil"
      return res.status(200).send({
        message,
        articles
      })
    } catch (error) {
      return res.send(error)
    }
  }

  getAllCategory = async (req, res, next) => {
    try {
      let category = await db.category.findAll({ where: { deletedAt: null } })
      let message = "Berhasil"
      return res.status(200).send({
        message,
        category
      })
    } catch (error) {
      return res.send(error)
    }
  }
}
module.exports = new HomeContoller()