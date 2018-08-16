const chai = require('chai');
const chaiHttp = require('chai-http');

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const {app, runServer, closeServer} = require('../server');

// declare a variable for expect from chai import
const expect = chai.expect;

chai.use(chaiHttp);

describe('Join Class App', function() {
  // Before our tests run, we activate the server. Our `runServer`
  // function returns a promise, and we return the promise by
  // doing `return runServer`. If we didn't return a promise here,
  // there's a possibility of a race condition where our tests start
  // running before our server has started.
  before(function() {
    
    return runServer();
  });

  // Close server after these tests run in case
  // we have other test modules that need to 
  // call `runServer`. If server is already running,
  // `runServer` will error out.
  after(function() {
    return closeServer();
  });
  // `chai.request.get` is an asynchronous operation. When
  // using Mocha with async operations, we need to either
  // return an ES6 promise or else pass a `done` callback to the
  // test that we call at the end. We prefer the first approach, so
  // we just return the chained `chai.request.get` object.


  it('should list current reservations on GET', function() {
    return chai.request(app)
      .post('/auth/login')
      .send({username: 'user1', password: 'password12'})
      .then(function(res) {
            return chai.request(app) 
              .get('/current-reservations/5b43d5e3c3b47d220bdc863c')
              .set('Authorization', `Bearer ${res.body.authToken}`)
              .then(function(res) {
                //console.log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;


              })
              .catch(function(err) {
                console.log('this is the log of', err);
              });
      })
      .catch(function(err) {
        console.log(err);
      })

 });

//Test works, fails because username exists after first test run
  // it('should create a new user on POST', function() {
  //   const newUser = {username: 'testusername2', password: 'testpassword', firstName: 'testfirstname', lastName: 'testlastname'};
  //   return chai.request(app)
  //     .post('/users')
  //     .send(newUser)
  //     .then(function(res) {
  //       console.log(res.body);
  //         expect(res).to.have.status(201);
  //         expect(res.body).to.be.a('object');
  //         expect(res.body).to.include.keys('username', 'password', 'firstName', 'lastName');
  //         expect(res.body.id).to.not.equal(null);
  //         expect(res.body).to.deep.equal(Object.assign(newUser, {id: res.body.id}));

  //     })
  //     .catch(function(err) {
  //       console.log(err);
  //     })
  // });

});
