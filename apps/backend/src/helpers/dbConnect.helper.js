import { connect } from "mongoose";

const dbConnect = async () => {
    try {
        connect(process.env.MONGO_DB);
        console.log("MONGO DATABASE CONNECTED");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
};

export default dbConnect;