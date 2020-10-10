import express from 'express'
import multer from 'multer'

const routes = express.Router()

import multerConfig from './config/multer'
const upload = multer(multerConfig)

import Celebrity from './controllers/Celebrity'
import Character from './controllers/Character'
import Media from './controllers/Media'
import Genre from './controllers/Genre'

routes.post('/celebrities', upload.single('image'), Celebrity.create)
routes.post('/celebrities/:id', upload.single('image'), Celebrity.update)
routes.post('/celebrities/:id', Celebrity.remove)
routes.post('/celebrities', Celebrity.list)
routes.post('/celebrities/:id', Celebrity.show)

routes.post('/characters', upload.single('image'), Character.create)
routes.post('/characters/:id', upload.single('image'), Character.update)
routes.post('/characters/:id', Character.remove)
routes.post('/characters', Character.list)
routes.post('/characters/:id', Character.show)

routes.post('/media', upload.single('image'), Media.create)
routes.post('/media/:id', upload.single('image'), Media.update)
routes.post('/media/:id', Media.remove)
routes.post('/media', Media.list)
routes.post('/media/:id', Media.show)

routes.post('/genres', Genre.create)
routes.post('/genres/:id', Genre.update)
routes.post('/genres/:id', Genre.remove)
routes.post('/genres', Genre.list)

export default routes