import mongoose,{Schema} from "mongoose";

const userSchema = new Schema (
	{
    username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			index: true
	  },
		email: {
      type: String,
			required: true,
			unique: true,
			lowercase: true
		},
		fullname: {
			type: String,
			required: true,
	  },
		// avatar: {
    //   type: String, //URL
		// 	required: true,
		// },
		// watchHistory: [{
		// 	type: Schema.Types.ObjectId,
		// 	ref: "Video"
		// }],
		password:  {
			type: String,
			required: true
		}
		// refreshToken: {
		// 	type: String
		// }

	}, {timestamps: true})


export default mongoose.model("User", userSchema);
