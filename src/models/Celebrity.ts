import mongoose from 'mongoose'

type CelebrityType = mongoose.Document &
{
    _id: string
    name: string
    image: string
    relations: Array<{character: string, media: string}>
}

const CelebritySchema = new mongoose.Schema(
{
    name: {type: String, required: true},
    image: {type: String, required: true},
    relations:
    [{
        character: {type: mongoose.Schema.Types.ObjectId, ref: 'Character'},
        media: {type: mongoose.Schema.Types.ObjectId, ref: 'Media'}
    }]
})

export default mongoose.model<CelebrityType>('Celebrity', CelebritySchema)