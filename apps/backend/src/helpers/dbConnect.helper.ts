import mongoose from "mongoose";

const dbConnect = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_DB as string);
        console.log("MONGO DATABASE CONNECTED");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
};

export default dbConnect;
