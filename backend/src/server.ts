import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀  WAY3D backend running on http://localhost:${PORT}`);
  console.log(`📦  SQLite database ready`);
});
