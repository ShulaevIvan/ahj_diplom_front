# Дипломное задание к курсу «Продвинутый JavaScript в браузере». Chaos Organizer

[![Build status](https://ci.appveyor.com/api/projects/status/i8knb7ub8iou3k54?svg=true)](https://ci.appveyor.com/project/ShulaevIvan/ahj-diplom-front)

### Ключевые функции:

- сохранение в истории ссылок и текстовых сообщений;
- ссылки  кликабельны и отображаются, как ссылки;
- сохранение в истории изображений, видео и аудио (как файлов) — через Drag & Drop и через иконку загрузки;
- скачивание файлов на компьютер пользователя;
- ленивая подгрузка: сначала подгружаются последние 10 сообщений, при прокрутке вверх подгружаются следующие 10 и т. д;
- поиск по сообщениям;
- запись аудио;
- отправка геолокации;
- воспроизведение видео/аудио;
- отправка команд боту: @chaos: weather, @chaos: weather, @chaos: time, @chaos: clear, @chaos: roll, @chaos: password;
- закрепление (pin) сообщений: закреплять можно только одно сообщение, оно прикрепляется к верхней части страницы;
- просмотр вложений по категориям: аудио, видео, изображения, другие файлыж


### Как использовать:

#### сохранение в истории ссылок и текстовых сообщений;

Сопировать/написать ссылку и отправить в input и нажать enter;

![textMsg](https://raw.githubusercontent.com/ShulaevIvan/ahj_diplom_front/master/screenshots/textMsg.png)

#### загрузка файлов;

Нажать на скрепку, добавить нужные файлы, либо выбрать файлы и перетащить их в свободное место для сообщений.

![upload](https://github.com/ShulaevIvan/ahj_diplom_front/blob/master/screenshots/drag.png?raw=true)

### скачивание файлов

скачивание файлов осуществляется по клику на стрелку, изображения скачиваются просто по клику.

![download](https://github.com/ShulaevIvan/ahj_diplom_front/blob/master/screenshots/download.png?raw=true)

### ленивая подгрузка

файлы подгружаются автоматически при сколле вверх, если сообщений больше 10.

### поиск по сообщениям

поиск по сообщениям осущетвляется при помощи формы search вверху страницы. Для поиска нужно ввести текст.

![search](https://github.com/ShulaevIvan/ahj_diplom_front/blob/master/screenshots/search.png?raw=true)

### запись аудио

запись аудио при помощи кнопки микрофона. Нажать на кнопку, разрешить использовать микрофон, иконки ок  подтвердить и отправить запись, кнопка крест, отменить и не отправлять сообщение.

![mic](https://github.com/ShulaevIvan/ahj_diplom_front/blob/master/screenshots/mic.png?raw=true)

### отправка геолокации

отправка геолокации при помощи кнопки карты, рядом с микрофоном, разрешить использовать определение местоположения, собщение добавится автоматически.

![geolocation](https://github.com/ShulaevIvan/ahj_diplom_front/blob/master/screenshots/geolocation.png?raw=true)


### закрепление сообщения

сообщение закрепляется по клику на него. Одновременно можно закрепить только одно сообщение.


### просмотр вложений по категориям

боковое меню по категориям, кнопка show, показывает сообщения по категориям, кнопка reset сбрасывает фильтр.


### отправка команд боту

ввести ключевое слово @chaos: в полле ввода, через пробел или без него указать параметры.

- @chaos: weather показывает случайный прогноз погоды
- @chaos: password генерирует случайный пароль на 10 символов
- @chaos: time показывает время в зависимости от расположения
- @chaos: clear удаляет все сообщения
- @chaos: roll (1 - param) генерирует случайное число в диапазоне.


![weather](https://github.com/ShulaevIvan/ahj_diplom_front/blob/master/screenshots/chaosWeather.png?raw=true)

![password](https://github.com/ShulaevIvan/ahj_diplom_front/blob/master/screenshots/chaosPassword.png?raw=true)

![time](https://github.com/ShulaevIvan/ahj_diplom_front/blob/master/screenshots/chaosTime.png?raw=true)

![roll](https://github.com/ShulaevIvan/ahj_diplom_front/blob/master/screenshots/chaosRoll.png?raw=true)

![clear](https://github.com/ShulaevIvan/ahj_diplom_front/blob/master/screenshots/chaosClear.png?raw=true)
















