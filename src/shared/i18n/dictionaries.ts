// src/shared/i18n/dictionaries.ts
export type Locale = 'ru' | 'hy';

export type Dictionary = Record<string, string>;

export const dictionaries: Record<Locale, Dictionary> = {
  ru: {
    // Tabs
    'tab.home': 'Главная',
    'tab.booking': 'Записаться',
    'tab.appointments': 'Мои записи',
    'tab.profile': 'Профиль',

    // Stack titles
    'title.doctors': 'Выбор врача',
    'title.booking': 'Запись',

    // Profile page
    'profile.title': 'Профиль',
    'profile.edit': 'Изменить',
    'profile.cancel': 'Отмена',
    'profile.section.personal': 'Личные данные',
    'profile.section.settings': 'Настройки',

    // Settings
    'settings.notifications': 'Уведомления',
    'settings.security': 'Безопасность',
    'settings.support': 'Поддержка',
    'settings.privacy': 'Политика конфиденциальности',
    'settings.logout': 'Выйти из аккаунта',
    'settings.logout.title': 'Выход',
    'settings.logout.confirm': 'Вы уверены?',

    // Language
    'settings.language': 'Язык',
    'lang.ru': 'Русский',
    'lang.hy': 'Հայերեն',

    // Booking / common
    'alert.selectDateTime': 'Выберите дату и время',
    'booking.selectDate': 'Выберите дату',
    'booking.selectTime': 'Выберите время',
    'booking.selectServiceDoctorFirst': 'Сначала выберите услугу и врача',
    'booking.confirm': 'Подтвердить запись',

    // Cancel appointment
    'cancel.title': 'Отменить запись',
    'cancel.message': 'Вы уверены, что хотите отменить эту запись?',
    'cancel.no': 'Нет',
    'cancel.yes': 'Да, отменить',

    // Common errors
    'error.title': 'Ошибка',

    // Profile form
    'profile.saveChanges': 'Сохранить изменения',
    'profile.nameRequired': 'Имя не может быть пустым',
  },
  hy: {
    // Tabs
    'tab.home': 'Գլխավոր',
    'tab.booking': 'Գրանցում',
    'tab.appointments': 'Իմ գրանցումները',
    'tab.profile': 'Պրոֆիլ',

    // Stack titles
    'title.doctors': 'Բժշկի ընտրություն',
    'title.booking': 'Գրանցում',

    // Profile page
    'profile.title': 'Պրոֆիլ',
    'profile.edit': 'Խմբագրել',
    'profile.cancel': 'Չեղարկել',
    'profile.section.personal': 'Անձնական տվյալներ',
    'profile.section.settings': 'Կարգավորումներ',

    // Settings
    'settings.notifications': 'Ծանուցումներ',
    'settings.security': 'Անվտանգություն',
    'settings.support': 'Աջակցություն',
    'settings.privacy': 'Գաղտնիության քաղաքականություն',
    'settings.logout': 'Ելք հաշվից',
    'settings.logout.title': 'Ելք',
    'settings.logout.confirm': 'Վստա՞հ եք',

    // Language
    'settings.language': 'Լեզու',
    'lang.ru': 'Русский',
    'lang.hy': 'Հայերեն',

    // Booking / common
    'alert.selectDateTime': 'Ընտրեք ամսաթիվն ու ժամը',
        'booking.selectDate': 'Ընտրեք ամսաթիվը',
        'booking.selectTime': 'Ընտրեք ժամը',
        'booking.selectServiceDoctorFirst': 'Սկզբում ընտրեք ծառայությունը և բժշկին',

        // Cancel appointment
        'cancel.title': 'Չեղարկել գրանցումը',
        'cancel.message': 'Վստա՞հ եք, որ ցանկանում եք չեղարկել այս գրանցումը',
        'cancel.no': 'Ոչ',
        'cancel.yes': 'Այո, չեղարկել',
  },
};

export const monthNames = {
  ru: {
    full: ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
    short: ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'],
  },
  hy: {
    // Armenian month names in genitive (used with day number)
    full: ['հունվարի','փետրվարի','մարտի','ապրիլի','մայիսի','հունիսի','հուլիսի','օգոստոսի','սեպտեմբերի','հոկտեմբերի','նոյեմբերի','դեկտեմբերի'],
    short: ['հնվ','փետր','մарт','ապր','մայ','հնս','հլս','օգս','սեպ','հոկ','նոյ','դեկ'],
  },
} as const;

export const dayNamesShort: Record<Locale, string[]> = {
  ru: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
  hy: ['Կի','Եր','Եք','Չր','Հն','Ու','Շբ'],
};
