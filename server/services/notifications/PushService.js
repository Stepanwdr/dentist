import { Expo } from "expo-server-sdk";

const expo = new Expo();

export class PushService {
  static async send(token, payload) {
    let messages = [];
    // Проверка токена на валидность
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Токен ${token} невалиден`);
      return;
    }

    // Формируем структуру уведомления
    messages.push({
      to: token,
      sound: 'default',
      title: 'Уведомление от сервера',
      body: token,
      data: {  }, // Доп. данные для логики приложения
    });

    // Expo рекомендует отправлять сообщения пачками (chunks)
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];

    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Ошибка при отправке чанка:', error);
      }
    }

    // (Опционально) Проверка статуса доставки через tickets
    console.log('Уведомления отправлены, получено тикетов:', tickets.length,tickets);
  }
}