'use strict';

const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
	class: {type: String, required: true},
	time: {type: String},
	day: {type: String},
	date: {type: String},
	location: {type: String},
});


reservationSchema.methods.serialize = function() {

  return {
    id: this.id,
    class: this.class,
    time: this.time,
    day: this.day,
    date: this.date,
    location: this.location
  };
};


const Reservations = mongoose.model('Reservation', reservationSchema);
 
module.exports = {Reservations};