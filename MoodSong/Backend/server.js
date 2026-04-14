// Server ko start karna 
// Database se connect karna 
require("dotenv").config()
const app = require('./src/app')


app.listen(3000,()=>{
  console.log("Server is running on port 3000");
  
})