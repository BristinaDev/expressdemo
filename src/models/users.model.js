import mongoose,{Schema} from "mongoose";

const userSchema = new (
	{
    username: {
			type: String,
			requried: true,
			unqiue: true,
			lowercase: true,
			index: true
	  },
		email: {
      type: String,
			requried: true,
			unqiue: true,
			lowercase: true
		},
		fullname: {
			type: String,
			requried: true,
	  },
		avatar: {
      type: String, //URL
			requried: true,
		},
		watchHistory: [{
			type: Schema.Types.ObjectId,
			ref: "Video"
		}],
		password:  {
			type: String,
			requried: true
		},
		refeshToken: {
			type: String
		}

	}, {timestamps: true})

export const User = mongoose.model("User", userSchema)