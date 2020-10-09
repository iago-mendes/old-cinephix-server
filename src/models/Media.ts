import mongoose from 'mongoose'

type MediaType = mongoose.Document &
{
    _id: string
    name: string
    image: string
    type: {isMovie: boolean, isSeries: boolean, isUniverse: boolean}
    genres: Array<string>
    celebrities_characters: Array<{celebrity: string, character: string}>
}

const MediaSchema = new mongoose.Schema(
{
    name: {type: String, required: true},
    image: {type: String, required: true},
    type:
    {
        isMovie: {type: Boolean, required: true},
        isSeries: {type: Boolean, required: true},
        isUniverse: {type: Boolean, required: true}
    },
    genres: [{type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}],
    celebrities_characters:
    [{
        celebrity: {type: mongoose.Schema.Types.ObjectId, ref: 'Celebrity'},
        character: {type: mongoose.Schema.Types.ObjectId, ref: 'Character'}
    }]
})

export default mongoose.model<MediaType>('Media', MediaSchema)