const sinon = require('sinon');
const chai = require('chai');
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;
const chaiaspromised = require('chai-as-promised');
chai.use(chaiaspromised);
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
let foodCtrl = require('../controller/restaurantController');

const server = require('../server');
const { response } = require('express');
const e = require('express');
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNGFmZmNlMTQ2NDYyYzg4NjY3MjEyMyIsImlhdCI6MTY1MDk2MzYxOSwiZXhwIjoxNjU4NzM5NjE5fQ.1FG9GeZKCm970KgR2XBylMV5prkJhkwwXMlJJ6xSTnA';

describe('Order APIs', function () {
  // checking that get request for getting all food items is working properly
  it('Get past orders of a logged user', function (done) {
    this.timeout(0);
    chai
      .request(server)
      .get('/api/v1/order/pastOrders')
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.status('success');
        expect(res.body).to.have.property('data');
        data.should.be.a('array');
        done();
      });
  });

  it('Get all orders', function (done) {
    chai
      .request(server)
      .get('/api/v1/order/allOrders') // sending the reqest for getting all order till now
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.status('success');
        expect(res.body).to.have.property('data');
        data.should.be.a('array');
        done();
      });
  });

  //   it('create a new restaurant', function () {
  //     chai
  //       .request(server)
  //       .post('/api/v1/restaurant/createRestaurant/')
  //       .set('Authorization', 'Bearer ' + token)
  //       .send({
  //         name: 'Swarnmukhi',
  //         phoneNumber: '1234567890',
  //         address: 'Sri city, Chittoor',
  //       })
  //       .then((res) => {
  //         expect(res).to.have.status(200);
  //         res.body.data.should.be.a('object');
  //       })
  //       .catch(function (err) {
  //         console.log(err);
  //       });
  //   });

  //   it('Get all food items of a restaurant', function (done) {
  //     chai
  //       .request(server)
  //       .get('/api/v1/restaurant/restaurantItems/624977e6df249825f214550f')
  //       .set('Authorization', 'Bearer ' + token)
  //       .end((err, res) => {
  //         let data = res.body.data;
  //         res.should.have.status(200);
  //         res.body.should.be.a('object');
  //         res.body.data.should.be.a('array');
  //         // console.log(data);
  //         done();
  //       });
  //   });

  //   it('Update a particular restaurant details', function (done) {
  //     this.timeout(0);
  //     chai
  //       .request(server)
  //       .patch('/api/v1/restaurant/updateRestaurant/62684f96bc042c0a179a26c1')
  //       .set('Authorization', 'Bearer ' + token)
  //       .send({
  //         name: 'Swarnmukhi2',
  //         phoneNumber: '1234567890',
  //         address: 'Sri city, Chittoor',
  //       })
  //       .then((res) => {
  //         expect(res).to.have.status(200);
  //         // console.log(res);
  //         expect(res.body).to.have.nested.include({
  //           // confirming the response from the updateFood controller
  //           status: 'success',
  //         });

  //         let data = res.body.data;
  //         data.should.be.a('object');
  //       })
  //       .catch(function (err) {
  //         console.log(err);
  //       });
  //     done();
  //   });

  //   it('Delete a food item details', function (done) {
  //     this.timeout(0);
  //     chai
  //       .request(server)
  //       .delete('/api/v1/food/foodItem/6267be8422e2a724faae6371')
  //       .set('Authorization', 'Bearer ' + token)
  //       .then((res) => {
  //         console.log(res.body);
  //         expect(res).to.have.status(200);
  //         expect(res.body).to.have.nested.include({
  //           // confirming the delete response from the delete method of food controller
  //           status: 'success',
  //         });
  //       })
  //       .catch(function (err) {
  //         console.log(err);
  //       });
  //     done();
  //   });
});
