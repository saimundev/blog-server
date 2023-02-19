import mongoose from "mongoose"

const dbConnect = async()=>{
    try {
        await mongoose.connect(process.env.DB)
        console.log("DB connect successfull")
    } catch (error) {
        console.log(erro)
    }
}

export default dbConnect;