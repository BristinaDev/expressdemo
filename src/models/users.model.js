import mongoose,{Schema} from "mongoose";

const userSchema = new Schema (
	{
    username: { type: String, required: true, unique: true,lowercase: true, index: true},
		email: {type: String, required: true, unique: true, lowercase: true,},
		password:  { type: String, required: true },
		fullname: { type: String },
		isActive: { type: Boolean, default: true },

	}, {timestamps: true})
  
	//QueryHelper
	// userSchema.query.findByActiveEmail = function (email){
	// 	return this.where({ email: email, isActive: true})
	// }
  
	// userSchema.methods.findByEmail = function (email) {
	// 	return this.model('User').find({ email: email });
	// };
	
	//Pre Middleware
	// userSchema.pre('save', function(next){
	// 	console.log(`[PRE] User is ${this.username}`)
	// })

	// //Post Middleware
	// userSchema.post('save', function(doc){
	// 	console.log(`[POST] User ${doc.username} saved.`)
	// })

	// userSchema.pre('save', async function (next){
	// if (!this.isModified('password')) return next();
	// this.password = await bcrypt.hash(this.password, 10);
	// next();
	// });
export default mongoose.model("User", userSchema);
