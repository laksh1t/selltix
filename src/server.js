const app = require('./app');
const { logger } = require('./utils/logger');
const config = require('./config/env');

const port = config.PORT;

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
