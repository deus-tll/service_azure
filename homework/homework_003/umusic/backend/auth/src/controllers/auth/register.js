import {createResultObject, generateToken} from "../../helpers/functions.js";




const RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_REGISTER = process.env.RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_REGISTER;



import rabbitMQ_notification from "../../helpers/rabbit.js";
import bcrypt from 'bcrypt-nodejs';



// Припустимо, що є база даних або сервіс для роботи з користувачами
const mockDatabase = {
  users: []
};



export const register = async function (request, response) {
  try {
    if(!request.body) return response.sendStatus(400);

    console.log(request.body);
    const user = request.body;

    const { name, email, password } = user;

    // 1.) Перевірка, чи користувач із вказаним ім'ям вже існує
    const existingUser = mockDatabase.users.find(user => user.email === email);

    if (existingUser) {
      return response.status(400).json({ error: 'User with this email already exists' });
    }

    // 2.) Хешування паролю
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // 3.) Збереження користувача у базі даних
    const newUser = {
      name: name,
      email: email,
      password: hashedPassword
    };

    mockDatabase.users.push(newUser);

    // 4.) Створення токену
    const newToken = generateToken(newUser);

    // 5.) Відправка повідомлення до RabbitMQ
    await rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_REGISTER, newUser);

    const result = createResultObject(newUser, newToken);
    return response.status(201).json({result: result, message: 'User registered successfully' });
  }
  catch (error) {
    console.error('Error in register: ', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}