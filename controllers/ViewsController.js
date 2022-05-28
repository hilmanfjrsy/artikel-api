const db = require("../models")

class ViewsController {
  generate = async (req, res, next) => {
    try {
      const body = req.body

      for (let index = 0; index < body.total_data; index++) {
        let duration = Math.floor(Math.random() * 100) + 20;
        let article = await db.articles.findOne({ where: { id: article_id } })
        let user = await db.users.findOne({ order: db.sequelize.random() })
        let start = Date.parse(body.start_date);
        let end = Date.parse(body.end_date);

        let createdAt = new Date(Math.floor(Math.random() * (end - start + 1) + start));
        await db.user_views.create({
          article_id: body.article_id,
          user_id: user.id,
          duration,
          createdAt
        })
      }
      let message = "Berhasil"
      return res.status(201).send({ message })
    } catch (error) {
      return res.send(error)
    }
  }

  view = async (req, res, next) => {
    try {
      let user_id = req._user_id
      if (!user_id) user_id = '53c403c3-f74d-469d-a7c4-1f772474082b'
      const id = req.query.id
      const article_id = req.query.article_id

      let data = null

      if (id) {
        let check = await db.user_views.findOne({ where: { id } })
        let startDate = check.createdAt;
        // Do your operations
        let endDate = new Date();
        let seconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
        let artikel = await db.articles.findOne({ where: { id: article_id } })
        let user = await db.users.findOne({ where: { id: artikel.user_id } })
        
        if (user.status_monetize) {
          let incomePerSecond = 10
          user.income = (seconds * incomePerSecond) + parseFloat(user.income)
          user.save()
        }
        check.duration = seconds
        check.save()
        // data = check
      } else {
        data = await db.user_views.create({
          article_id,
          user_id,
          duration: 0
        })
      }
      let message = "Berhasil"
      return res.status(200).send({ message, data })
    } catch (error) {
      return res.send(error)
    }
  }

  statistik = async (req, res, next) => {
    try {
      const query = req.query
      const interval = query.interval
      const article_id = query.article_id

      let where = ''
      let title = 'Kunjungan'

      if (interval) {
        where = `WHERE uv."createdAt" > current_date - interval '${interval}' day`
        title = `Kunjungan ${interval} hari terakhir`
      }
      if (article_id) {
        if (interval) {
          where = where + ` and article_id='${article_id}'`
        } else {
          where = `where article_id='${article_id}'`
        }
      }

      let interactive = {
        title,
        date: [],
        value: []
      }

      let listAge = {
        title: `Berdasarkan Kategori Umur`,
        keys: [],
        value: [],
      }

      let listGender = {
        title: `Berdasarkan Jenis Kelamin`,
        data: []
      }
      const listInteractive = await db.sequelize.query(`SELECT date("createdAt"), count("createdAt") from user_views uv
                              ${where}
                              GROUP BY date("createdAt")
                              ORDER BY date("createdAt")`, { type: db.sequelize.QueryTypes.SELECT })

      const listAges = await db.sequelize.query(`select
                              sum(case when date_part('year',age(birthdate))<15 then 1 end) as "<15",
                              sum(case when date_part('year', age(birthdate))>=15 and date_part('year', age(birthdate))<25 then 1 end) as "15-24",
                              sum(case when date_part('year', age(birthdate))>=25 and date_part('year', age(birthdate))<35 then 1 end) as "25-34",
                              sum(case when date_part('year', age(birthdate))>=35 and date_part('year', age(birthdate))<45 then 1 end) as "35-44",
                              sum(case when date_part('year', age(birthdate))>=45 then 1 end) as ">45"
                            from users u
                            JOIN user_views uv on uv.user_id=u.id
                            ${where}`, { type: db.sequelize.QueryTypes.SELECT })

      const listGenders = await db.sequelize.query(`SELECT count(u.gender),u.gender from user_views uv
                            JOIN users u on u.id=uv.user_id and u."deletedAt" is null
                            ${where}
                            GROUP BY u.gender`, { type: db.sequelize.QueryTypes.SELECT })

      for (const list of listInteractive) {
        interactive.date.push(list.date)
        interactive.value.push(parseInt(list.count))
      }

      for (const age in listAges[0]) {
        listAge.keys.push(age)
        listAge.value.push(parseInt(listAges[0][age]))
      }

      let idxGender = 0
      for (const gender of listGenders) {
        listGender.data.push({
          key: idxGender,
          value: parseInt(gender.count),
          label: gender.gender,
          svg: { fill: idxGender ? '#43AA8B' : '#43AA8B70' }
        })
        idxGender += 1
      }

      let message = "Berhasil"
      return res.status(200).send({
        message,
        interactive,
        listAge,
        listGender
      })
    } catch (error) {
      return res.send(error)
    }
  }
}
module.exports = new ViewsController()