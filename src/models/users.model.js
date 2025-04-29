import mongoose,{Schema} from "mongoose";

const userSchema = new Schema (
	{
    username: { type: String, required: true, unique: true,lowercase: true, index: true},
		email: {type: String, required: true, unique: true, lowercase: true,},
		password:  { type: String, required: true },
		fullname: { type: String, required: true},
		isActive: { type: Boolean, default: true },

		// avatar: {
    //   type: String, //URL
		// 	required: true,
		// },
		// watchHistory: [{
		// 	type: Schema.Types.ObjectId,
		// 	ref: "Video"
		// }],
		// refreshToken: {
		// 	type: String
		// }

	}, {timestamps: true})
  
	//QueryHelper
	// userSchema.query.findByActiveEmail = function (email){
	// 	return this.where({ email: email, isActive: true})
	// }
  
	userSchema.methods.findByEmail = function (email) {
		return this.model('User').find({ email: email });
	};
	
	//Pre Middleware
	userSchema.pre('save', function(next){
		console.log(`[PRE] User is ${this.username}`)
	})

	//Post Middleware
	userSchema.post('save', function(doc){
		console.log(`[POST] User ${doc.username} saved.`)
	})

export default mongoose.model("User", userSchema);
