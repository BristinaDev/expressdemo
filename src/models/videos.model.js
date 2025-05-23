import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema( {
    videoFile: {
			type: String, //Coudinary URL
			required: true
	},
    thumbnail: {
			type: String, // URL
			required :true
    },
		title: {
				type: String,
			required: true
    },
    decriptions: {
			type: String,
			required: true
    },
    duration: {
			type: Number,
			required: true
    },
		views: {
			type: Number,
			required: true
    },
		isPublished: {
			type: Boolean,
			default: true
    },
		videoOwner: {
			type: Schema.Types.ObjectId,
			ref: "User"
		}
}, { timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema)