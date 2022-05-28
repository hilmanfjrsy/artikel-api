const db = require("../models")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const Cryptr = require("cryptr")
const cryptr = new Cryptr(process.env.SECRET_CRYPTR)

class UsersController {
  login = async (req, res, next) => {
    try {
      const body = req.body

      let checkUsers = await db.users.findOne({ where: { email: body.email }, raw: true })

      if (checkUsers) {
        let checkPassword = await bcrypt.compare(body.password, checkUsers.password)
        if (checkPassword) {
          delete checkUsers['password']
          var secret = cryptr.encrypt(checkUsers.id);

          var token = jwt.sign(checkUsers,
            process.env.SECRET, {
            expiresIn: 7200 // 2 hours
          });
          let avatar = await db.avatar.findOne({ where: { id: checkUsers.avatar_id, deletedAt: null } })
          let count = await db.sequelize.query(`SELECT count(*), sum(uv.duration) from user_views uv
          JOIN articles a on a.id=uv.article_id and a."deletedAt" is null and a.is_publish=true and a.user_id='${checkUsers.id}'`, { type: db.sequelize.QueryTypes.SELECT })
          let total_articles = await db.articles.count({ where: { user_id: checkUsers.id } })

          checkUsers.total_articles = total_articles
          checkUsers.sum_duration = count[0].sum
          checkUsers.total_views = count[0].count
          checkUsers.avatar = avatar

          return res.status(201).send({ secret, token, user: checkUsers })
        } else {
          let message = "Password tidak sesuai"
          return res.status(400).send({ message })
        }
      } else {
        let message = "Email tidak ditemukan"
        return res.status(400).send({ message })
      }
    } catch (error) {
      return res.send(error)
    }
  }

  register = async (req, res, next) => {
    try {
      const body = req.body

      let checkUsers = await db.users.findOne({ where: { email: body.email } })

      if (!checkUsers) {
        let hash = await bcrypt.hash(body.password, 10);
        let avatar = await db.avatar.findOne({ order: db.sequelize.random() })
        body.password = hash
        body.avatar_id = avatar.id
        body.status_monetize = false
        body.income = 0

        let users = await db.users.create(body)

        return res.status(201).send({
          data: users,
          message: "Akun Anda kini telah terdaftar! Silahkan Login"
        })
      } else {
        let message = "Email telah digunakan"
        return res.status(400).send({ message })
      }
    } catch (error) {
      return res.send(error)
    }
  }

  updateProfile = async (req, res, next) => {
    try {
      const body = req.body
      const id = req._user_id

      await db.users.update(body, { where: { id } })
      let users = await db.users.findOne({ where: { id }, raw: true })
      let avatar = await db.avatar.findOne({ where: { id: users.avatar_id } })
      let count = await db.sequelize.query(`SELECT count(*), sum(uv.duration) from user_views uv
      JOIN articles a on a.id=uv.article_id and a."deletedAt" is null and a.is_publish=true and a.user_id='${users.id}'`, { type: db.sequelize.QueryTypes.SELECT })
      let total_articles = await db.articles.count({ where: { user_id: users.id } })

      users.total_articles = total_articles
      users.sum_duration = count[0].sum
      users.total_views = count[0].count
      users.avatar = avatar

      return res.status(201).send({
        data: users,
        message: "Profil telah diperbarui"
      })
    } catch (error) {
      return res.send(error)
    }
  }

  checkEmail = async (req, res, next) => {
    try {
      const email = req.body.email
      let checkUsers = await db.users.findOne({ where: { email } })

      if (checkUsers) {
        return res.status(200).send({ message: "Email telah digunakan", exist: 1 })
      } else {
        return res.status(200).send({ message: "Email dapat digunakan", exist: 0 })
      }
    } catch (error) {
      return res.send(error)
    }
  }

  refreshToken = async (req, res) => {
    try {
      let id = cryptr.decrypt(req.body.secret);
      let users = await db.users.findOne({ where: { id }, raw: true })

      if (users) {
        delete users['password']
        var secret = cryptr.encrypt(users.id);

        var token = jwt.sign(users,
          process.env.SECRET, {
          expiresIn: 7200 // 2 hours
        });

        return res.status(201).send({ token, secret })
      } else {
        let message = "Sesi telah habis"
        return res.status(444).send({ message })
      }
    } catch (error) {
      return res.send(error)
    }
  }

  getAllAvatar = async (req, res) => {
    try {
      let avatar = await db.avatar.findAll({ where: { deletedAt: null } })
      return res.status(200).send({ avatar })
    } catch (error) {
      return res.send(error)
    }
  }
}

module.exports = new UsersController()