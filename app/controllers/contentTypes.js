'use strict';

require('rootpath')();
var _ = require('lodash'),
    typeModel = require('app/models/contentType'),
    contentModel = require('app/models/content'),
    pageModel = require('app/models/page'),
    versions = require('app/helpers/versions'),
    fields = require('app/helpers/fields');

/**
 * @api {get} /api/1.0.0/type Get all content types with populated fields
 * @apiGroup ContentType
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {String} description Description of content type.
 * @apiSuccess (200) {String} label content type label.
 * @apiSuccess (200) {String} fields All populated fields of content type.
 * @apiSuccess (200) {String} uuid Unique uuid.
 * @apiSuccess (200) {String} id Mongo _id.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       "description": "Some description",
 *       "label": "Article",
 *       "fiels": [{
 *           "type": "textbox",
 *           "id": "title"
 *       }]
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }]
 */
exports.read = function (req, res) {
    typeModel.find({$query: {'meta.deleted': false}, $orderby: {'meta.safeLabel': 1}}, {versions: 0})
        .exec(function(err, items) {
            if(!err && items) {
                res.status(200).json(items);
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {get} /api/1.0.0/type/all List all content types labels
 * @apiGroup ContentType
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {String} label Content type name.
 * @apiSuccess (200) {String} safeLabel Content type safe label for url.
 * @apiSuccess (200) {String} uuid Unique uuid.
 * @apiSuccess (200) {String} id Mongo _id.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       "label": "Page",
 *       "safeLabel": "page",
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }]
 */
exports.allTypes = function (req, res) {
    typeModel.find({$query: {'meta.deleted': false}, $orderby: {'meta.safeLabel': 1}}, {'meta': 1, uuid: 1})
        .exec(function(err, items) {
            if(!err && items) {
                //To do: add logic for roles
                res.status(200).json(items);
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {get} /api/1.0.0/type/:uuid Get a single content type with populated fields based on uuid
 * @apiParam {String} uuid Content Type uuid
 * @apiGroup ContentType
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {String} description Description of content type.
 * @apiSuccess (200) {String} label content type label.
 * @apiSuccess (200) {String} fields All populated fields of content type.
 * @apiSuccess (200) {String} uuid Unique uuid.
 * @apiSuccess (200) {String} id Mongo _id.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "description": "Some description",
 *       "label": "Article",
 *       "fiels": [{
 *           "type": "textbox",
 *           "id": "title"
 *       }]
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }
 */
/**
 * @api {get} /api/1.0.0/type/:safeLabel Get a single content type with populated fields based on safe label
 * @apiParam {String} safeLabel Content Type safe label
 * @apiGroup ContentType
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {String} description Description of content type.
 * @apiSuccess (200) {String} label content type label.
 * @apiSuccess (200) {String} fields All populated fields of content type.
 * @apiSuccess (200) {String} uuid Unique uuid.
 * @apiSuccess (200) {String} id Mongo _id.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "description": "Some description",
 *       "label": "Article",
 *       "fiels": [{
 *           "type": "textbox",
 *           "id": "title"
 *       }]
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }
 */
exports.readOne = function (req, res) {
    typeModel.findOne({$or: [{uuid: req.params.id, 'meta.deleted': false}, {'meta.safeLabel': req.params.id}]}, {versions: 0})
        .populate('meta.contentType')
        .exec(function(err, item) {
            if(!err && item) {
                res.status(200).json(item);
            } else {
                res.status(404).json({err: err});
            }
        });
};

/**
 * @api {post} /api/1.0.0/type Create a new content type
 * @apiGroup ContentType
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {String} description Description of content type.
 * @apiSuccess (200) {String} label content type label.
 * @apiSuccess (200) {String} fields All populated fields of content type.
 * @apiSuccess (200) {String} uuid Unique uuid.
 * @apiSuccess (200) {String} id Mongo _id.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "description": "Some description",
 *       "label": "Article",
 *       "fiels": [
 *           "xxxxxxxxxxxxxxxxxxxxxxxx",
 *           "xxxxxxxxxxxxxxxxxxxxxxxx"
 *       ]
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }
 */
exports.create = function (req, res, next) {
    req.body.meta.safeLabel = _.snakeCase(req.body.meta.label);
    typeModel.create(req.body, function(err, create) {
        if(!err && create) {
            //To do: add logic for roles
        } else {
            res.status(400).json({err: err});
        }
    });
};

/**
 * @api {put} /api/1.0.0/type/:uuid Update a content type
 * @apiParam {String} uuid Content Type uuid
 * @apiGroup ContentType
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {String} description Description of content type.
 * @apiSuccess (200) {String} label content type label.
 * @apiSuccess (200) {String} fields All populated fields of content type.
 * @apiSuccess (200) {String} uuid Unique uuid.
 * @apiSuccess (200) {String} id Mongo _id.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "description": "Some description",
 *       "label": "Article",
 *       "fiels": [
 *           "xxxxxxxxxxxxxxxxxxxxxxxx",
 *           "xxxxxxxxxxxxxxxxxxxxxxxx"
 *       ]
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }
 */
exports.update = function (req, res, next) {
    // Compatibility fix for old MongoDB versions
    delete req.body._id;
    req.body.meta.safeLabel = _.snakeCase(req.body.meta.label);
    // Update version before save
    fields.check(req.params.id, req.body, function() {
        versions.create(Type, req.body, function(data) {

            // Clear content that will be automatically updated
            delete data.meta.lastModified;

            typeModel.update({uuid: req.params.id}, data)
                .exec(function(err, update) {
                    if(!err && update) {
                        typeModel.findOne({uuid: req.params.id}, {versions: 0})
                            .exec(function(err, example) {
                                if(!err && example) {
                                    res.status(200).json(example);
                                } else {
                                    res.status(400).json({err: err});
                                }
                            });
                    } else {
                        res.status(400).json({err: err});
                    }
                });
        });
    });
};

/**
 * @api {delete} /api/1.0.0/type/:uuid Delete a content type
 * @apiParam {String} uuid Content Type uuid
 * @apiGroup ContentType
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 OK
 */
exports.delete = function (req, res, next) {
    var contentTypeId,
        contentIds;
    typeModel.findOneAndUpdate({uuid: req.params.id},
                {$set: { 'meta.deleted': true}})
        .exec()
        .then(
            function onSuccess(response) {
                //console.log("contentTypeId");
                contentTypeId = response._id.toString();
                // //console.log('response', response);
            },
            function onError(responseError) {
                error(responseError);
            }
        )
        .then(
            function findContent() {
                //console.log("findContent");
                return contentModel.find({'meta.contentType': contentTypeId})
                    .lean()
                    .exec();
            },
            function onError(responseError) {
                error(responseError);
            }
        )
        .then(
            function removeContent(response) {
                //console.log("removeContent");
                contentIds = _.pluck(response, '_id');
                return contentModel.update({contentType: contentTypeId},
                                            {$set: {'meta.deleted': true}},
                                            {multi: true})
                    .exec();
            },
            function onError(responseError) {
                error(responseError);
            }
        )
        .then(
            function removePages() {
                //console.log("removePages");
                return pageModel.update({contentReference: {$in: contentIds}},
                                        {$set: {'meta': { 'deleted': true }}},
                                        {multi: true})
                    .exec();
            },
            function onError(responseError) {
                //console.log("error1");
                error(responseError);
            }
        )
        .then(
            function onSuccess(response) {
                res.status(204).json({});
            },
            function onError(responseError) {
                //console.log(responseError);
                error(responseError);
            }
        );

    function error(err) {
        res.status(400).json({err: err});
    }
};
