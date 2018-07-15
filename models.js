'use strict';

const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
	class: {type: String, required: true},
	time: {type: String},
	day: {type: String},
	date: {type: String},
	location: {type: String},
  description: {type: String},
  length: {type: String},
  userId: {type: String}
});


reservationSchema.methods.serialize = function() {

  return {
    id: this.id,
    class: this.class,
    time: this.time,
    day: this.day,
    date: this.date,
    location: this.location,
    description: this.description,
    length: this.length,
    userId: this.userId
  };
};


const Reservations = mongoose.model('Reservation', reservationSchema);
 
module.exports = {Reservations};