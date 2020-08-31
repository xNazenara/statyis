const express = require("express")
const bodyParser = require('body-parser')
const cors = require("cors")
const { Client } = require('pg')
const fs = require('fs')

const app = express()

app.use(cors())

app.use(express.static('client'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const connectionString = 'postgres://twsdflruktcybb:9f41ce980434ddb1689915543e1dc7a0f7dee719c733091e7c39c48d7675d957@ec2-52-31-94-195.eu-west-1.compute.amazonaws.com:5432/d51n2533p028b4'

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  } 
})

client.connect()

app.get('/', (req, res) => {
  fs.readFile(__dirname + '/client/index.html', 'utf-8', (err, data) => {
    res.send(data)
  })
})


app.post('/post-create', (req, res) => {
  client.query(`
    insert into posts (
      title, value
    ) values (
      $1, $2
    )
  `,
  [req.body.titleValue, req.body.textValue],
  (err) => {
    if (err) {
      console.log(err)
    } else {
      res.send("Успешно добавлено!")
    }
  })

})

app.get('/posts-get', (req, res) => {
  client.query(`
      select * from posts
  `,
  (err, data) => {
    if (err) {
      console.log(err)
    } else {
      res.send(data.rows)
    }
  }
  )
})

app.post('/post-delete', (req, res) => {
  client.query(`
    delete from posts p
    where p.id = $1
  `,
  [req.body.id],
  (err) => {
    if (err) {
      console.log(err)
    } else {
      res.send("Успешно удалено!")
    }
  })

})

app.post('/post-edit', (req, res) => {
  client.query(`
    update posts p
    set value = $3, title = $2
    where p.id = $1
  `,
  [req.body.id, req.body.titleValue, req.body.textValue],
  (err) => {
    if (err) {
      console.log(err)
    } else {
      res.send("Успешно изменено!")
    }
  })

})

app.post('/post-del', (req, res) => {
  client.query(`
      delete from posts p
      where p.id = $1
    `,
    [req.body.id],
    (err) => {
      if (err) {
        console.log(err)
      } else {
        res.send("Успешно удалено!")
      }
    })
})

app.listen(3000, ()=>console.log("Started"))
