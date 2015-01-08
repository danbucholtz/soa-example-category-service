var mongoose = require('mongoose');
var service = require("soa-example-core-service");
var config = require("soa-example-service-config").config();

var categoryController = require('./controllers/CategoryController');

mongoose.connect(config.mongoUri);

var app = service.createApiServer(config.categoryServicePort);

app.post('/categories', service.ensureAuthenticated, categoryController.createCategory);
app.post('/categories/delete', service.ensureAuthenticated, categoryController.deleteCategory);
app.get('/categories', service.ensureAuthenticated, categoryController.getCategories);
app.get('/categories/:id', service.ensureAuthenticated, categoryController.getCategoryById);