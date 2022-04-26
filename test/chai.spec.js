const { assert, should, expect } = require('chai');
should(); // this function needs to be called explicitely

// ######## ASSERT ########
describe('Aspect check', function () {
  let userName = 'himanshu';
  let myList = { item: [{ id: 1, name: 'demo' }], title: 'user list' };

  it('check string', () => {
    assert.typeOf(userName, 'string'); // asserting
  });

  it('check equals', function () {
    assert.equal(userName, 'himanshu');
  });

  it('check length', () => {
    assert.lengthOf(myList.item, 1);
  });
});

// ######## SHOULD ########

describe('should check', () => {
  let userName = 'himanshu';
  let myList = { item: [{ id: 1, name: 'demo' }], title: 'user list' };

  it('check string', () => {
    userName.should.be.a('string'); // should use
  });

  it('check equal', () => {
    userName.should.equal('himanshu');
  });

  it('check property length', () => {
    myList.should.have.property('item').with.lengthOf(1);
  });
});

// ######## EXPECT ########

describe('expect check', () => {
  let userName = 'himanshu';
  let myList = {
    item: [{ id: 1, name: 'demo' }],
    title: 'user list',
    address: {
      country: 'India',
      phoneNumber: ['1234567890', '0987654321'],
    },
  };

  it('string match', () => {
    expect(userName).to.be.a('string');
  });

  it('equal match', () => {
    expect(userName).to.equal('himanshu');
  });

  it('length match', () => {
    expect(userName).to.lengthOf(8);
  });

  it('object match', () => {
    expect(myList).to.have.property('item').with.lengthOf(1);
  });

  it('api object match', () => {
    // expect(myList).to.have.all.keys("item", "title", "status"); // adding one extra key of status which is not present in the keys of the json object
    // expect(myList).to.have.all.keys("item", "title", "address"); // for checking the keys

    expect(myList).to.have.nested.property('address.phoneNumber[1]'); // for checking the phone number with value at index 1
    // expect(myList).to.have.nested.property("address.phoneNumber[2]"); // for checking the phone number with value at index 2. There is nothing as such that is why it is failing

    expect(myList).to.have.nested.property('address.country');

    expect(myList).to.have.nested.include({ 'address.country': 'India' });

    expect(myList).to.have.nested.include({
      'address.phoneNumber[0]': '1234567890', // checking the phone number at a specific location
    });
  });
});
