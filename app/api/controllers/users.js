const documentModel = require('../models/documents');
const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = { 
    create: function (req, res, next) {
        userModel.create(
            {
                name: req.body.name,
                cpf: req.body.cpf,
                email: req.body.email,
                password: req.body.password
            }
            , function (err, result) {
                if (err)
                    next(err);
                else
                    res.json({ status: "success", message: "User added successfully!!!", data: null });
            });
    },

    getAll: function (req, res, next) {
        let userList = [];
        userModel.find({}, function (err, users) {
            if (err) {
                next(err);
            } else {
                for (let user of users) {
                    userList.push({ id: user._id, name: user.name});
                }
                res.json( { users: userList } );

            }
        });
    },
    getById: async function (req, res, next) { 
        try {
            const userId = req.params.userId;
            const user = await userModel.findById(userId).populate('documents');
            res.json( { user: user } ); 
        } catch (error) {
            
        }
    },

    updateById: function (req, res, next) {
        userModel.findByIdAndUpdate(req.params.userId, { name: req.body.name }, function (err, userInfo) {
            if (err)
                next(err);
            else {
                res.json({ status: "success", message: "User updated successfully!!!", data: null });
            }
        });
    },
    deleteById: function (req, res, next) {
        userModel.findByIdAndRemove(req.params.userId, function (err, userInfo) {
            if (err)
                next(err);
            else {
                res.json({ status: "success", message: "User deleted successfully!!!", data: null });
            }
        });
    },
    deleteAllUsers: function (req, res, next) {
        userModel.remove( function (err, userInfo) {
            if (err)
                next(err);
            else {
                res.json({ status: "success", message: "All users deleted successfully!!!", data: null });
            }
        });
    },
    authenticate: async function (req, res, next) {
        userModel.findOne(
            {
                cpf: req.body.cpf
            }, function (err, userInfo) {
                if (err) {
                    next(err);
                } else {
                    if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                        const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '1h' });
                        res.json({ status: "success", message: "user found!!!", data: { user: userInfo, token: token } });
                    } else {
                        res.json({ status: "error", message: "Invalid cpf/password!!!" });
                    }
                }
            });
    },

 
     
    newDocumentByUserId: async  (req, res, next) => {
        const {userId} = req.params;
        const newDocument = new documentModel(req.body);
        const user = await userModel.findById(userId);
        newDocument.user = user;
        await newDocument.save();
        user.documents.push(newDocument);
        await user.save();
        res.status(201).json({status: 'success', data: newDocument});
    },

    
    getAllDocumentsByUserId: async function (req, res, next) { 
        try {
            const userId = req.params.userId;
            const documents = await userModel.findById(userId).populate('documents');
            res.json(documents); 
        } catch (error) {
            
        }
    }, 
    
    getUserDocumentById: async function (req, res, next){
        try { 
            const {documentId} = req.params; 
            const _document = await documentModel.findById(documentId);   
            res.json( { document: _document } ); 
        } catch (error) {
            
        }
    },
    updateDocumentByUserId: function (req, res, next) {
        const {documentId} = req.params; 
        userModel.findByIdAndUpdate(req.params.documentId, { name: req.body.name }, function (err, userInfo) {
            if (err)
                next(err);
            else {
                res.json({ status: "success", message: "Document updated successfully!!!", documentId: documentId });
            }
        });
    },
    deleteDocumentByUserId: function (req, res, next) {
        const {documentId} = req.params; 
        userModel.findByIdAndRemove(req.params.documentId, function (err, userInfo) {
            if (err)
                next(err);
            else {
                res.json({ status: "success", message: "Document deleted successfully!!!", documentId: documentId });
            }
        });
    },
}