// libraries
var express   = require('express');
	app 	  = express(),
	bodyParser = require('body-parser'),
	mongoose  = require('mongoose');


// configurations

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
	// get all blogs from database
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		}else{
			res.render('index', {blogs: blogs});
		}
	});
});

// NEW -- displays a form to add a new blog, submits to 'CREATE' route
app.get("/blogs/new", function(req, res){
	res.render("new");
});

// CREATE -- adds a post to the database, gets data from 'NEW' route
app.post("/blogs", function(req, res){
	// get data from the form
	var blogName = req.body.title;
	var blogDate = "Sun 2 Nov 2001";
	var blogImage = req.body.image;
	var blogContent = req.body.content;

	// add it to the DB
	var newBlog = new Blog({
		name: blogName,
		date: blogDate,
		image: blogImage,
		content: blogContent
	});

	newBlog.save(function(err, newBlog){
		if(err){
			console.log(err);
		}else{
			console.log("Saved a new post to the DB!!");
		}
	});

	// redirect back to all blogs
	res.redirect("/blogs");
});

// SHOW -- displays a specific Post
app.get("/blogs/:id", function(req, res){
	// get post from DB
	var blogId = req.params.id;
	Blog.findById(blogId, function(err, post){
		if(err){
			console.log("Post not found!");
		}else{
			res.render("show", {post: post});
		}
	});
});

// EDIT -- shows edit form, submits to 'EDIT' route
app.get('/blogs/:id/edit', function(req, res){
	// get post from DB
	var blogId = req.params.id;
	Blog.findById(blogId, function(err, post){
		if(err){
			console.log("Post not found! Can't edit!");
		}else{
			// render the template
			res.render("edit", {post: post});
		}
	});
});

// UPDATE -- updates a blog
app.put('/blogs/:id', function(req, res){
	// update data in database
	Blog.update({id: req.params.id}, {$set: {name: req.body.blogTitle, content: req.body.blogContent} });
	res.redirect('/blogs');
});

// DESTROY -- deletes a blog
app.delete('/blogs/:id', function(req, res){
	// don't know if a callback function is allowed or not
	Blog.remove({id: req.params.id}, function(err){
		if(err){
			console.log("something went wrong!");
		}else{
			console.log("Deleted a Post!");
		}
	});
	res.redirect('/blogs');
});

// PORT configuration
app.listen(8000, function(){
	console.log('App is listening on PORT 8000!');
});