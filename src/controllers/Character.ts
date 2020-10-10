import { Request, Response, NextFunction } from 'express'
import fs from 'fs'

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
    media: {id: string, name: string, image: string}
}

export default
{
    create: async (req: Request, res: Response, next: NextFunction) =>
    {
        try {
            const {name} = req.body
            const image = req.file.filename
            await Character.create({name, image, relations: []})
            return res.status(201).send()
        } catch (error) {
            next(error)
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) =>
    {
        try {
            const {id} = req.params
            const {name, relations} = req.body
            let image = req.file.filename

            const character = await Character.findById(id)
            if (character)
            {
                if (image.slice(0, -37) === character.image)
                {
                    fs.unlinkSync(`../../uploads/${image}`)
                    image = character.image
                }
                else fs.unlinkSync(`../../uploads/${character.image}`)
            }

            const tmp = await Character.findByIdAndUpdate(id, {_id: id, name, image, relations})
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
            
            const character = await Character.findById(id)
            fs.unlinkSync(`../../uploads/${character?.image}`)
            
            const tmp = await Character.findByIdAndDelete(id)
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
            const characters = await Character.find()

            const promises = characters.map(character =>
            {
                list.push(
                {
                    id: character._id,
                    name: character.name,
                    image: `${baseUrl}/uploads/${character.image}`
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
            const character = await Character.findById(id)
            let relations: Relation[] = []

            if (character !== null)
            {
                const promises = character.relations.map(async ({celebrity, media}) =>
                {
                    const tmpCelebrity = await Celebrity.findById(celebrity)
                    const tmpMedia = await Media.findById(media)

                    relations.push(
                    {
                        celebrity:
                        {
                            id: tmpCelebrity?._id,
                            name: String(tmpCelebrity?.name),
                            image: String(tmpCelebrity?.image)
                        },
                        media:
                        {
                            id: tmpMedia?._id,
                            name: String(tmpMedia?.name),
                            image: String(tmpMedia?.image)
                        }
                    })
                })
                await Promise.all(promises)

                return res.json(
                {
                    id,
                    name: character.name,
                    image: `${baseUrl}/uploads/${character.image}`,
                    relations
                })
            }
        } catch (error) {
            next(error)
        }
    }
}