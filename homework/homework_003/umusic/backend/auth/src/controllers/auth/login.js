const RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_LOGIN = process.env.RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_LOGIN;



import rabbitMQ_notification from "../../helpers/rabbit.js";
import {createResultObject, generateToken, verifyToken} from "../../helpers/functions.js";



const mockDatabase = {
  users: []
};



export const login = async function (request, response) {
  try {
    // 1.1) перевірка наявності та валідація токена
    const existingToken = request.headers.authorization;
    if (existingToken && existingToken.startsWith('Bearer ')) {
      // 1.2) верифікація токена
      const decodedToken = verifyToken(existingToken.slice(7));

      if (decodedToken) {
        // 1.3) якщо токен валідний і не просрочений, то відправляємо на rabbitMQ та відповідь на фронт
        await rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_LOGIN, decodedToken.user);

        const result = createResultObject(decodedToken.user, existingToken);
        return response.status(200).json(result);
      }
      else {
        return response.status(401).json({ error: "Token expired or invalid, please log in again" });
      }
    }

    // 2.1) якщо токена немає, то в request.body повинні бути дані для логіну, якщо і їх нема,
    // то повертаємо не успішний результат
    if (!request.body) {return response.sendStatus(400);}

    const userData = request.body;

    // 2.2) перевірка наявності користувача в базі
    // const userExists = mockDatabase.users
    //   .find(user => user.email === userData.email && user.password === userData.password);

    // припустимо, що він є
    const userExists = true;

    if (userExists) {
      // якщо користувач присутній, то
      // 2.3) відправляємо повідомлення на rabbitMQ
      await rabbitMQ_notification(RABBITMQ_QUEUE_NOTIFICATIONS_AUTH_LOGIN, userData);

      // 2.4) Створюємо новий токен для користувача
      const newToken = generateToken(userData);

      // 2.5) відправляємо успішну відповідь на фронт
      const result = createResultObject(userData, newToken);
      return response.status(200).json(result);
    }
    else {
      // Користувача не знайдено
      return response.status(401).json({ error: "Invalid credentials" });
    }
  }
  catch (error) {
    console.error("Error in login: ", error)
    return response.status(500).json({error: "Internal Server Error"})
  }
};