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
    character: {id: string, name: string, image: string},
    media: {id: string, name: string, image: string}
}

interface charactersRelations
{
    [character: string]: Array<{celebrity: string, media: string}>
}

interface mediasRelations
{
    [media: string]: Array<{celebrity: string, character: string}>
}

export default class CelebrityController
{
    async create(req: Request, res: Response, next: NextFunction)
    {
        try {
            const {name, relations} = req.body
            const image = req.file.filename
            
            const celebrity = await Celebrity.create({name, image, relations})
            celebrity.relations.map(async ({character, media}) =>
            {
                const tmpCharacter = await Character.findById(character)
                const tmpMedia = await Media.findById(media)

                if (tmpCharacter !== null && tmpMedia !== null)
                {
                    await Character.findByIdAndUpdate(character,
                    {
                        relations: [...tmpCharacter.relations, {celebrity: celebrity.id, media}]
                    })
                    await Media.findByIdAndUpdate(media,
                    {
                        relations: [...tmpMedia.relations, {celebrity: celebrity.id, character}]
                    })
                }
            })
            
            return res.status(201).send()
        } catch (error) {
            next(error)
        }
    }

    async update(req: Request, res: Response, next: NextFunction)
    {
        try {
            const {id} = req.params
            const {name,relations}:{name:string,relations:{character:string,media:string}[]}=req.body
            let image = req.file.filename

            const celebrity = await Celebrity.findById(id)
            if (celebrity !== null)
            {
                if (image.slice(0, -37) === celebrity.image)
                {
                    fs.unlinkSync(`../../uploads/${image}`)
                    image = celebrity.image
                }
                if (relations !== celebrity.relations)
                {
                    let charactersRelations: charactersRelations = {}
                    let mediasRelations: mediasRelations = {}

                    relations.map(async ({character, media}) =>
                    {
                        const tmpCharacter = await Character.findById(character)
                        const tmpMedia = await Media.findById(media)

                        if (tmpCharacter !== null && tmpMedia !== null)
                        {
                            charactersRelations[character] = tmpCharacter.relations
                            .filter(({celebrity}) => celebrity !== id)

                            mediasRelations[media] = tmpMedia.relations
                            .filter(({celebrity}) => celebrity !== id)

                            charactersRelations[character].push({celebrity: id, media})
                            mediasRelations[media].push({celebrity: id, character})
                        }
                    })

                    for (const [character, relations] of Object.entries(charactersRelations))
                    {
                        await Character.findByIdAndUpdate(character, {_id: character, relations})
                    }

                    for (const [media, relations] of Object.entries(mediasRelations))
                    {
                        await Media.findByIdAndUpdate(media, {_id: media, relations})
                    }
                }
            }

            const tmp = await Celebrity.findByIdAndUpdate(id, {_id: id, name, image, relations})
            res.status(200).send()
            return tmp
        } catch (error) {
            next(error)
        }
    }

    async remove(req: Request, res: Response, next: NextFunction)
    {
        try {
            const {id} = req.params
            
            const celebrity = await Celebrity.findById(id)
            fs.unlinkSync(`../../uploads/${celebrity?.image}`)
            
            const tmp = await Celebrity.findByIdAndDelete(id)
            res.status(200).send()
            return tmp
        } catch (error) {
            next(error)
        }
    }

    async list(req: Request, res: Response, next: NextFunction)
    {
        try {
            let list: List[] = []
            const celebrities = await Celebrity.find()

            const promises = celebrities.map(celebrity =>
            {
                list.push(
                {
                    id: celebrity._id,
                    name: celebrity.name,
                    image: `${baseUrl}/uploads/${celebrity.image}`
                })
            })
            await Promise.all(promises)

            return res.json(list)
        } catch (error) {
            next(error)
        }
    }

    async show(req: Request, res: Response, next: NextFunction)
    {
        try {
            const {id} = req.params
            const celebrity = await Celebrity.findById(id)
            let relations: Relation[] = []

            if (celebrity !== null)
            {
                const promises = celebrity.relations.map(async ({character, media}) =>
                {
                    const tmpCharacter = await Character.findById(character)
                    const tmpMedia = await Media.findById(media)

                    relations.push(
                    {
                        character:
                        {
                            id: tmpCharacter?._id,
                            name: String(tmpCharacter?.name),
                            image: String(tmpCharacter?.image)
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
                    name: celebrity.name,
                    image: `${baseUrl}/uploads/${celebrity.image}`,
                    relations
                })
            }
        } catch (error) {
            next(error)
        }
    }
}