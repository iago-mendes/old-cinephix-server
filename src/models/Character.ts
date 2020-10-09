import mongoose from 'mongoose'

type CharacterType = mongoose.Document &
{
    _id: string
    name: string
    image: string
    relations: Array<{celebrity: string, media: string}>
}

const CharacterSchema = new mongoose.Schema(
{
    name: {type: String, required: true},
    image: {type: String, required: true},
    relations:
    [{
        celebrity: {type: mongoose.Schema.Types.ObjectId, ref: 'Celebrity'},
        media: {type: mongoose.Schema.Types.ObjectId, ref: 'Media'}
    }]
})

export default mongoose.model<CharacterType>('Character', CharacterSchema)