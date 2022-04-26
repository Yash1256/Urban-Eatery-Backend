const sinon = require('sinon');
const chai = require('chai');
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;
const chaiaspromised = require('chai-as-promised');
chai.use(chaiaspromised);
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
let foodCtrl = require('../controller/foodController');

const server = require('../server');
const { response } = require('express');
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNGFmZmNlMTQ2NDYyYzg4NjY3MjEyMyIsImlhdCI6MTY1MDk2MzYxOSwiZXhwIjoxNjU4NzM5NjE5fQ.1FG9GeZKCm970KgR2XBylMV5prkJhkwwXMlJJ6xSTnA';

describe('Food APIs', function () {
  // checking that get request for getting all food items is working properly
  it('get food', function (done) {
    this.timeout(0);
    chai
      .request(server)
      .get('/api/v1/food/foodItem')
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  it('get a particular food', function (done) {
    chai
      .request(server)
      .get('/api/v1/food/foodItem/6249eb83a5ac4aa8584aa81a') // sending the reqeust for a particular food item
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        let data = res.body.data;
        res.body.should.have.status('success');
        expect(res.body).to.have.property('data');
        res.body.should.be.a('object');
        data.should.be.a('object');
        expect(data).to.have.all.keys(
          // checking for all properties that should be send in response
          '_id',
          'name',
          'category',
          'img',
          'description',
          'story',
          'price',
          'restaurant_name',
          'restaurant',
          '__v'
        );
        expect(data).to.have.nested.include({
          name: 'Begal and Cream Cheese',
        });
        done();
      });
  });

  //   it('create a new food item', function () {
  //     chai
  //       .request(server)
  //       .post('/api/v1/food/foodItem')
  //       .send({
  //         name: 'Panipuri',
  //         restaurant: '624977e6df249825f214550f',
  //         category: 'starter',
  //         description: 'Famous fastfood of North India',
  //         img: 'https://i.imgur.com/BaS2G0b.png',
  //         price: '1',
  //         quantity: '20',
  //       })
  //       .then((res) => {
  //         expect(res).to.have.status(200);
  //       })
  //       .catch(function (err) {
  //         console.log(err);
  //       });
  //   });

  it('Get food by category', function (done) {
    chai
      .request(server)
      .get('/api/v1/food/getFoodbyCategory/breakfast')
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        let data = res.body.data;
        res.should.have.status(200);
        res.body.should.be.a('object');
        // console.log(data);
        done();
      });
  });

  it('Update a food item details', function (done) {
    this.timeout(0);
    chai
      .request(server)
      .patch('/api/v1/food/foodItem/6267be8422e2a724faae6371')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Bhajji',
        category: 'breakfast',
        img: 'https://i.imgur.com/BaS2G0b.png',
        description: 'Snacks given in IIT Sri city',
        price: 12,
        restaurant: '624977e6df249825f214550f',
      })
      .then((res) => {
        expect(res).to.have.status(200);
        // console.log(res);
        expect(res.body).to.have.nested.include({
          // confirming the response from the updateFood controller
          status: 'success',
          message: 'Data got updated',
        });
      })
      .catch(function (err) {
        console.log(err);
      });
    done();
  });

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
