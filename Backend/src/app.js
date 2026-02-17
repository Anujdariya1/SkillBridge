require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const pool = require('../pool');

/* Routers */
const adminRouter = require('./routes/adminRoute');
const authRouter = require('./routes/authRoute');
const careerRouter = require('./routes/careerRoute');
const progressRouter = require('./routes/progressRoute');
const userSkillRouter = require('./routes/userskillRoute');
const learningPathRouter = require('./routes/learningpathRoute');
const projectRouter = require('./routes/projectRoute');
const resourceRouter = require('./routes/resourcesRoute');
const roadmapRouter = require('./routes/roadmapRoute');
const skillRouter = require('./routes/skillRoute');
const dashboardRouter = require('./routes/dashboardRoute');

const app = express();

/***************** Global Middlewares *****************/

// Enable CORS for frontend connection
app.use(cors());

// HTTP request logger (dev friendly)
app.use(morgan('dev'));

// Parse JSON body
app.use(express.json());

// Parse URL‑encoded body
app.use(express.urlencoded({ extended: true }));

/***************** Health Check *****************/
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SkillBridge API is running 🚀',
  });
});

/***************** API Routes *****************/
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/careers', careerRouter);
app.use('/api/progress', progressRouter);
app.use('/api/userskills', userSkillRouter);
app.use('/api/learningpaths', learningPathRouter);
app.use('/api/projects', projectRouter);
app.use('/api/resources', resourceRouter);
app.use('/api/roadmaps', roadmapRouter);
app.use('/api/skills', skillRouter);
app.use('/api/dashboard', dashboardRouter);


/***************** 404 Handler *****************/
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/***************** Global Error Handler *****************/
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

/***************** Start Server *****************/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 SkillBridge API running on port ${PORT}`);
});
