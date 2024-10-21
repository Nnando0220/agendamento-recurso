const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/userModel');
const { userRegisterSchema, userLoginSchema } = require('../Validations/userValidation');
const joi = require('joi');

const userController = {
    registerUser: async (req, res) => {
        const { error } = userRegisterSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const { email, password, name, funcao} = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await UserModel.createUser({ email, password: hashedPassword, name, funcao });
            res.status(200).json(user);

        } catch (error) {
            res.status(500).json({ error: 'Error registering user.' });
        }
    },

    loginUser: async (req, res) => {
        
        const { error } = userLoginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
    
        const { email, password } = req.body;
        const user = await UserModel.findUserByEmail(email);
    
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const token = jwt.sign(
            { userId: user.id, funcao: user.funcao }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' } 
        );

        return res.status(200).json({ message: 'Login successful.', token });
                
    },

    userResourceSchedulings: async (req, res) => {
        try{
            const userId = req.user.userId;
            const schedulings = await UserModel.getSchedulingByUserId(userId);
            return res.status(200).json(schedulings);

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao agendar recurso.' });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await UserModel.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar usuários.' });
        }
    },

    getUserById: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await UserModel.getUserById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }
            return res.status(200).json(user);  
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao encontrar usuário.' });
        }
    },

    updateUser: async (req, res) => {
        const updateSchema = joi.object({
            email: joi.string().email().optional(),
            name: joi.string().min(3).max(255).optional(),
            funcao: joi.string().valid('admin', 'funcionario').optional(),
            password: joi.string().min(6).optional(),    
        });
        const { error } = updateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

            const { id } = req.params;

            const user = await UserModel.getUserById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            const { email, password, name, funcao } = req.body;
            if (password !== undefined) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await UserModel.updateUser(id, { email, password: hashedPassword, name, funcao });
                return res.status(200).json(newUser);  
            }
            const newUser = await UserModel.updateUser(id, { email, password: user.password, name, funcao });
            return res.status(200).json(newUser);  
        
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await UserModel.getUserById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }
            await UserModel.deleteUser(id);
            return res.status(200).json({ message: 'Usuário deletado com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar usuário.' });
        }
    },
};

module.exports = userController;
