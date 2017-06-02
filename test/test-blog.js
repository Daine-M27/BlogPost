const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// this lets us use *should* style syntax in our tests
// so we can do things like `(1 + 1).should.equal(2);`
// http://chaijs.com/api/bdd/
const should = chai.should();

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);


describe('Blog', function(){

	before(function() {
		return runServer();
	});

	after(function(){
		return closeServer();
	});

	it('should list blog post on GET', function(){
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.json;
			});
	});

	it('should add a blog on POST', function(){
		const postItem = {
			title: 'some title',
			content: 'some content here',
			author: 'Mr. Name Here'
		};
		return chai.request(app)
			.post('/blog-posts')
			.send(postItem)
			.then(function(res){
				res.should.have.status(201);
				res.body.should.be.a('object');
				res.body.title.should.equal(postItem.title);
				res.body.content.should.equal(postItem.content);
				res.body.author.should.equal(postItem.author);

			});
	});

	it('should update blog on PUT', function() {

    return chai.request(app)
      .get('/blog-posts')
      .then(function( res) {
        const updatedPost = Object.assign(res.body[0], {
          title: 'some title',
          content: 'lots of contect here'
        });
        return chai.request(app)
          .put(`/blog-posts/${res.body[0].id}`)
          .send(updatedPost)
          .then(function(res) {
            res.should.have.status(204);
          });
      });
  });

  it('should delete posts on DELETE', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`)
          .then(function(res) {
            res.should.have.status(204);
          });
      });
  });

})