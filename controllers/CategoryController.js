var uuid = require('node-uuid');
var Q = require("q");
var Category = require("../models/Category");

var productService = require("soa-example-product-service-api");

var createCategory = function(req, res){
	var name = req.body.name;

	createCategoryInternal(name).then(function(response){
		if ( !response.success ){
			res.statusCode = 500;
		}
		res.send(response);
	});
};

var deleteCategory = function(req, res){
	var categoryId = req.body.id;
	var accessToken = req.user.accessToken;

	deleteCategoryInternal(accessToken, categoryId).then(function(response){
		if ( !response.success ){
			res.statusCode = 500;
		}
		res.send(response);
	});
};

var getCategories = function(req, res){
	getCategoriesInternal().then(function(entities){
		res.send(entities);
	});
};

var getCategoryById = function(req, res){
	
	var categoryId = req.params.id;

	getCategoryByIdInternal(categoryId).then(function(entity){
		if ( !entity ){
			res.statusCode = 500;
		}
		res.send(entity);
	});
};

var createCategoryInternal = function(name){
	var deferred = Q.defer();

	Category.findOne({name: name}, function(err, entity){
		if ( entity ){
			deferred.resolve({success:false, errorMessage:"A Category with that name already exists"});
			return;
		}
		
		var category = new Category();
		category.name = name;
		category.created = new Date();

		category.save(function(err, categoryEntity){
			if ( err ){
				deferred.resolve({success:false, errorMessage:"Failed to save category [" + err.toString() + "]"});
				return;
			}
			deferred.resolve({success:true, entity:categoryEntity});
		});

	});

	return deferred.promise;
};

var deleteCategoryInternal = function(accessToken, categoryId){
	var deferred = Q.defer();
	// check if any products exist with the product.
	productService.getProductsByCategoryId(accessToken, categoryId).then(function(entities){
		if ( entities && entities.length > 0){
			deferred.resolve({success:false, errorMessage:"Cannot delete categories w/ Products associated to it."});
			return;
		}
		Category.findOne({_id: categoryId}, function(err, entity){
			if ( !entity ){
				deferred.resolve({success:false, errorMessage:"Category w/ ID [" + categoryId + "] does not exist"});
				return;
			}
			entity.remove();
			deferred.resolve({success:true});
		});

	});

	return deferred.promise;
};

var getCategoriesInternal = function(){
	var deferred = Q.defer();

	Category.find({}, function(err, entities){
		deferred.resolve(entities);
	});

	return deferred.promise;
};

var getCategoryByIdInternal = function(id){
	var deferred = Q.defer();

	Category.findOne({_id:id}, function(err, entity){
		deferred.resolve(entity);
	});

	return deferred.promise;
};

module.exports = {
	createCategory: createCategory,
	getCategories: getCategories,
	getCategoryById: getCategoryById,
	deleteCategory: deleteCategory
};