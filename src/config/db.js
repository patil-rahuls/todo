import { connect } from "mongoose";
import './dotenv.js';

const dbConn = () => {
  try{
    connect(process.env.DB_URL);
    console.log("DB connected!");
  } catch(err){
    console.error(err.message);
  }
};

export { dbConn };
