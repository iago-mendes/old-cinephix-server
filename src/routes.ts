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
routes.put('/celebrities/:id', upload.single('image'), Celebrity.update)
routes.delete('/celebrities/:id', Celebrity.remove)
routes.get('/celebrities', Celebrity.list)
routes.get('/celebrities/:id', Celebrity.show)

routes.post('/characters', upload.single('image'), Character.create)
routes.put('/characters/:id', upload.single('image'), Character.update)
routes.delete('/characters/:id', Character.remove)
routes.get('/characters', Character.list)
routes.get('/characters/:id', Character.show)

routes.post('/media', upload.single('image'), Media.create)
routes.put('/media/:id', upload.single('image'), Media.update)
routes.delete('/media/:id', Media.remove)
routes.get('/media', Media.list)
routes.get('/media/:id', Media.show)

routes.post('/genres', Genre.create)
routes.put('/genres/:id', Genre.update)
routes.delete('/genres/:id', Genre.remove)
routes.get('/genres', Genre.list)

export default routes