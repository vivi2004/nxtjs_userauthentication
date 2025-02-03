import mongoose from 'mongoose';

export async function connect() {
  // Check if MONGO_URI is defined
  if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in the environment variables. Please set it in your .env file.');
    process.exit(1);
  }

  try {
    // Connect to MongoDB using the connection string from the environment variable
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');

    // Optionally, you can listen for further connection events:
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('Something went wrong while connecting to MongoDB:', error);
    process.exit(1); // Exit the process with a failure code
  }
}
