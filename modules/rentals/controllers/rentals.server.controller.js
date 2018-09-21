'use strict';

const path          = require('path');
const mongoose      = require('mongoose');
const Rental        = mongoose.model('Rental');
const errorHandler  = require(path.resolve('./modules/core/controllers/error.server.controller'));

/**
 * Create an article
 */
exports.create = function (req, res) {
//    console.log(req.body);
    let rental = new Rental(req.body);
    rental.save(
     (err) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(rental);
      }
    });
};

exports.list = (req, res) => {
    Rental.find().exec(
        (err, rentals) => {
            if (err) {
                return res.status(422).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.json(rentals);
              }
        }
    );
}
exports.read = (req, res) => {
  let rental = req.rental ? req.rental.toJSON() : {};
  res.json(rental);
}
exports.rentalById = (req, res, next, id) => {
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).send({message:'id is invalid'});
  }

  Rental.findById(id).exec(
    (err, rental) => {
      console.log(rental);

      if(err) {
        return next(err);
      } else if (!rental){
        return res.status(404).send({
          message:'No Article with that identifier has been found'
        });
      }
      req.rental= rental;
      next();
    }
  );
}