import mongoose from 'mongoose'

type CharacterType = mongoose.Document &
{
    _id: string
    name: string
    image: string
    celebrities_media: Array<{celebrity: string, media: string}>
}

const CharacterSchema = new mongoose.Schema(
{
    name: {type: String, required: true},
    image: {type: String, required: true},
    celebrities_media:
    [{
        celebrity: {type: mongoose.Schema.Types.ObjectId, ref: 'Celebrity'},
        media: {type: mongoose.Schema.Types.ObjectId, ref: 'Media'}
    }]
})

export default mongoose.model<CharacterType>('Character', CharacterSchema)