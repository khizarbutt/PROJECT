const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/steamRegister', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(function() {
    console.log(`Connection Successful`);
}).catch(function(e) {
    console.log('Connection Error');
})