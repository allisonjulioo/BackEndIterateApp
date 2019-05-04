const documentModel = require('../models/documents'); 
module.exports = {

    create: function (req, res, next) {
        documentModel.create(
            {
                type_document: req.body.type_document,
                value_document: req.body.value_document,
                shipping_date: req.body.shipping_date,
                expiration_date: req.body.expiration_date,
                user: req.body.userId,

            }, function (err, result) {
                if (err) {
                    next(err);

                } else {
                    res.json({ status: "success", message: "document added successfully.", type: result.type_document });
                }
            });
    },

    getAll: function (req, res, next) {
        let documentsList = [];
        documentModel.find({}, function (err, documents) {
            if (err) {
                next(err);
            } else {
                for (let document of documents) {
                    documentsList.push(
                        {
                            id: document._id,
                            type_document: document.type_document,
                            user: document.user
                        });
                }
                res.json({ documents: documentsList });

            }
        });
    },
    getById: function (req, res, next) {
        console.log(req.body);
        documentModel.findById(req.params.documentId, function (err, documentInfo) {
            if (err) {
                next(err);
            } else {
                res.json({ document: documentInfo });
            }
        });
    },
    updateById: function (req, res, next) {
        documentModel.findByIdAndUpdate(req.params.documentId, { name: req.body.name }, function (err, documentInfo) {
            if (err)
                next(err);
            else {
                res.json(
                    {
                        status: "success",
                        message: "document updated successfully.",
                        user: res.user,
                        data: documentInfo
                    });
            }
        });
    },
    deleteById: function (req, res, next) {
        documentModel.findByIdAndRemove(req.params.documentId, function (err, documentInfo) {
            if (err)
                next(err);
            else {
                res.json({ status: "success", message: "document deleted successfully.", data: null });
            }
        });
    }
}