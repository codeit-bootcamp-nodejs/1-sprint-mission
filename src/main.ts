import { app } from './app';
import { PORT } from './lib/constants';

app.listen(PORT || 3000, () => {
  console.log('Server is running on port 3000');
});
