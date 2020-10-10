import mongoose from 'mongoose'

type GenreType = mongoose.Document &
{
    _id: string
    name: string
    // medias: Array<string>
}

const GenreSchema = new mongoose.Schema(
{
    name: {type: String, required: true},
    // medias: [{type: mongoose.Schema.Types.ObjectId, ref: 'Media'}]
})

export default mongoose.model<GenreType>('Genre', GenreSchema)