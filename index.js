import express from 'express'
import 'dotenv/config'
import routes from './routes/index.mjs'
import path from 'node:path'

const app = new express()

app.use(express.static('public'))

app.set('views',path.resolve('views'))
app.set('view engine','ejs')
app.set('PORT',process.env.PORT || 8080)


app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/',routes)

app.listen(app.get('PORT'),()=>console.log(`Servidor listo en: localhost:${app.get('PORT')}`))