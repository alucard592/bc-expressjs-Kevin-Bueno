import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/banco_sangre';

  try {
    // Intentar conectar con un timeout de 2.5 segundos
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    console.log('✓ MongoDB local conectado exitosamente');
  } catch (error) {
    console.log('\n⚠️ No se detectó un servicio MongoDB activo localmente.');
    console.log('⚡ Levantando servidor MongoDB en memoria para pruebas de desarrollo...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();

      await mongoose.connect(memoryUri);
      console.log('✓ Base de datos en memoria iniciada y conectada con éxito.');
    } catch (memError) {
      console.error('Error al iniciar MongoDB en memoria:', memError);
      throw memError;
    }
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log('MongoDB desconectado');
}
