var uuid = require('node-uuid');
var Q = require("q");
var Category = require("../models/Category");

var createCategory = function(req, res){
	var name = req.body.name;

	createCategoryInternal(name).then(function(response){
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
	getCategoryById: getCategoryById
};