import mongoose from 'mongoose'

type MediaType = mongoose.Document &
{
    _id: string
    name: string
    image: string
    type: {isMovie: boolean, isSeries: boolean, isUniverse: boolean}
    genres: Array<string>
    relations: Array<{celebrity: string, character: string}>
}

const MediaSchema = new mongoose.Schema(
{
    name: {type: String, required: true},
    image: {type: String, required: true},
    type:
    {
        isMovie: {type: Boolean},
        isSeries: {type: Boolean},
        isUniverse: {type: Boolean}
    },
    genres: [{type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}],
    relations:
    [{
        celebrity: {type: mongoose.Schema.Types.ObjectId, ref: 'Celebrity'},
        character: {type: mongoose.Schema.Types.ObjectId, ref: 'Character'}
    }]
})

export default mongoose.model<MediaType>('Media', MediaSchema)