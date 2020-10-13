import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import path from 'path'

import Celebrity from '../models/Celebrity'
import Character from '../models/Character'
import Media from '../models/Media'
import { baseUrl } from '../config/credentials'

interface List
{
    id: string
    name: string
    image: string
}

interface Relation
{
    celebrity: {id: string, name: string, image: string},
    character: {id: string, name: string, image: string}
}

export default
{
    create: async (req: Request, res: Response, next: NextFunction) =>
    {
        try {
            const {name, type, genres} = req.body
            const image = req.file.filename
            await Media.create({name, image, type, genres: [], relations: []})
            return res.status(201).send()
        } catch (error) {
            next(error)
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) =>
    {
        try {
            const {id} = req.params
            const {name/*, type, genres, relations*/} = req.body
            let image = req.file.filename

            const media = await Media.findById(id)
            if (media)
            {
                if (image.slice(0, -37) === media.image)
                {
                    fs.unlinkSync(path.resolve(__dirname, '..', '..', 'uploads', image))
                    image = media.image
                }
                else fs.unlinkSync(path.resolve(__dirname, '..', '..', 'uploads', media.image))
            }

            const tmp = await Media.findByIdAndUpdate(id, {_id: id, name, image/*, type, genres, relations*/})
            res.status(200).send()
            return tmp
        } catch (error) {
            next(error)
        }
    },

    remove: async (req: Request, res: Response, next: NextFunction) =>
    {
        try {
            const {id} = req.params
            
            const media = await Media.findById(id)
            fs.unlinkSync(path.resolve(__dirname, '..', '..', 'uploads', String(media?.image)))
            
            const tmp = await Media.findByIdAndDelete(id)
            res.status(200).send()
            return tmp
        } catch (error) {
            next(error)
        }
    },

    list: async (req: Request, res: Response, next: NextFunction) =>
    {
        try {            
            let list: List[] = []
            const medias = await Media.find()

            const promises = medias.map(media =>
            {
                list.push(
                {
                    id: media._id,
                    name: media.name,
                    image: `${baseUrl}/uploads/${media.image}`
                })
            })
            await Promise.all(promises)

            return res.json(list)
        } catch (error) {
            next(error)
        }
    },

    show: async (req: Request, res: Response, next: NextFunction) =>
    {
        try {
            const {id} = req.params
            const media = await Media.findById(id)
            let relations: Relation[] = []

            if (media)
            {
                const promises = media.relations.map(async ({celebrity, character}) =>
                {
                    const tmpCelebrity = await Celebrity.findById(celebrity)
                    const tmpCharacter = await Character.findById(character)

                    relations.push(
                    {
                        celebrity:
                        {
                            id: tmpCelebrity?._id,
                            name: String(tmpCelebrity?.name),
                            image: String(tmpCelebrity?.image)
                        },
                        character:
                        {
                            id: tmpCharacter?._id,
                            name: String(tmpCharacter?.name),
                            image: String(tmpCharacter?.image)
                        }
                    })
                })
                await Promise.all(promises)

                return res.json(
                {
                    id,
                    name: media.name,
                    image: `${baseUrl}/uploads/${media.image}`,
                    type: media.type,
                    genres: media.genres,
                    relations
                })
            }
        } catch (error) {
            next(error)
        }
    }
}