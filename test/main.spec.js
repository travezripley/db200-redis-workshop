/* global define, it, describe, beforeEach, document */
const path = require('path');
const expect = require('chai').expect;
const redis = require('redis');
const client = redis.createClient();

describe('redis', () => {
  it('should be running', () => {
    expect(client.connected).to.be.true;
  })

  it('should have a value at key "shout:123"', done => {
    client.get('shout:123', (err, val) => {
      expect(err).to.be.null;
      expect(val).to.equal('Shout is the new Twitter');
      done();
    });
  });

  it('should have a value at key "connections"', done => {
    client.get('connections', (err, val) => {
      expect(err).to.be.null;
      expect(val).to.equal('1');
      done();
    });
  });

  it('should have a list at key "friends"', done => {
    client.lrange('friends', 0, -1, (err, val) => {
      expect(err).to.be.null;
      expect(val).to.deep.equal(['Alice']);
      done();
    });
  });

  it('should have a value at key "resource:lock"', done => {
    client.get('resource:lock', (err, val) => {
      expect(err).to.be.null;
      expect(val).to.equal('Redis Demo 2');
      done();
    });
  });
});
