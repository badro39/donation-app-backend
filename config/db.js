import { connect } from 'mongoose';
const connectDB = async () => {
  let isConnected = false;
  try {
    await connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    isConnected = true;
  } catch (err) {
    console.error(err);
    console.error('❌ MongoDB connection error:');
  } finally {
    if(!isConnected) {
      console.error('❌ Exiting process due to failed DB connection');
      if(process.env.NODE_ENV !== 'test') {
        process.exit(1);
      }
    }
  }
};

export default connectDB;
