import { Request, Response, NextFunction } from 'express'

import Genre from '../models/Genre'

export default
{
    create: async (req: Request, res: Response, next: NextFunction) =>
    {
        try {
            const {name} = req.body
            await Genre.create({name})
            return res.status(201).send()
        } catch (error) {
            next(error)
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) =>
    {
        try {
            const {id} = req.params
            const {name} = req.body

            const tmp = Genre.findByIdAndUpdate(id, {name})
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
            const tmp = Genre.findByIdAndDelete(id)
            res.status(200).send()
            return tmp
        } catch (error) {
            next(error)
        }
    },

    list: async (req: Request, res: Response, next: NextFunction) =>
    {
        try {
            const genres = Genre.find()
            return res.json(genres)
        } catch (error) {
            next(error)
        }
    }
}