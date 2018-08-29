// libraries
var express   = require('express');
	app 	  = express(),
	bodyParser = require('body-parser'),
	mongoose  = require('mongoose');

// server configurations
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// mongoose configurations
mongoose.connect('mongodb://localhost:27017/blog_app', {useNewUrlParser: true});
// blog schema
var blogSchema = mongoose.Schema({
	name: String,
	date: String,
	image: String,
	content: String
});
// compiling the schema into a model
var Blog = mongoose.model('blog', blogSchema);

// Routes -- follows REST

// INDEX  -- displays a list of all blogs
app.get('/blogs', function(req, res){
	res.render('index');
});

// PORT configuration
app.listen(8000, function(){
	console.log('App is listening on PORT 8000!');
});