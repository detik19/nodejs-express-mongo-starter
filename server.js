'use strict';

const express   = require ('express');
const mongoose  = require ('mongoose');
const config    = require('./config/env/development');

let app         = require('./config/lib/app');


let server      = app.start();
