# Инструкция: Как добавить видео с Google Drive на сайт

## Проблема "Нет доступа"

Если вы видите ошибку "Нет доступа", это означает, что:
1. Использована неправильная ссылка
2. Видео не настроено для общего доступа
3. Неправильно извлечен ID файла

## Пошаговая инструкция

### Шаг 1: Загрузите видео на Google Drive
1. Перейдите на https://drive.google.com
2. Нажмите "Создать" → "Загрузить файлы"
3. Выберите видеофайл и дождитесь загрузки

### Шаг 2: Настройте доступ к файлу
1. **Правой кнопкой мыши** на файле → "Поделиться" (Share)
2. В окне "Поделиться" нажмите "Изменить" (Change)
3. Выберите **"Все, у кого есть ссылка"** (Anyone with the link)
4. Убедитесь, что стоит галочка **"Читатель"** (Viewer)
5. Нажмите "Готово" (Done)

### Шаг 3: Получите правильную ссылку
1. Откройте файл (двойной клик)
2. Нажмите на кнопку "Поделиться" в правом верхнем углу
3. Скопируйте ссылку

Ссылка будет выглядеть так:
```
https://drive.google.com/file/d/1ABC123xyz456DEF789/view?usp=sharing
```

### Шаг 4: Извлеките ID файла
Из ссылки выше нужно взять часть между `/d/` и `/view`:

**ID файла:** `1ABC123xyz456DEF789`

### Шаг 5: Вставьте ID в код
В файле `index.html` найдите строки с `YOUR_FILE_ID_1`, `YOUR_FILE_ID_2`, `YOUR_FILE_ID_3`

Замените их на ваши реальные ID:

```html
<!-- ПРАВИЛЬНО -->
<iframe 
    src="https://drive.google.com/file/d/1ABC123xyz456DEF789/preview" 
    allow="autoplay; encrypted-media" 
    allowfullscreen
    class="google-drive-video">
</iframe>

<!-- НЕПРАВИЛЬНО (так делать НЕ нужно) -->
<iframe src="https://drive.google.com/drive/u/0/home"></iframe>
```

## Альтернативные варианты

### Вариант 1: YouTube (рекомендуется)
Если Google Drive не работает, используйте YouTube:

1. Загрузите видео на YouTube
2. Получите ID видео из ссылки: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Используйте формат:
```html
<iframe 
    src="https://www.youtube.com/embed/VIDEO_ID" 
    allowfullscreen
    class="google-drive-video">
</iframe>
```

### Вариант 2: Прямая ссылка на видео
Если видео хранится на вашем сервере:
```html
<video controls class="google-drive-video">
    <source src="путь/к/видео.mp4" type="video/mp4">
</video>
```

## Проверка правильности ссылки

Правильная ссылка для iframe должна:
- Начинаться с `https://drive.google.com/file/d/`
- Содержать ID файла (длинная строка букв и цифр)
- Заканчиваться на `/preview`

**Пример правильной ссылки:**
```
https://drive.google.com/file/d/1ABC123xyz456DEF789/preview
```

## Частые ошибки

❌ **Неправильно:**
- `https://drive.google.com/drive/u/0/home` (это главная страница)
- `https://drive.google.com/file/d/FILE_ID/view` (нужно `/preview`, а не `/view`)
- Видео не настроено для общего доступа

✅ **Правильно:**
- `https://drive.google.com/file/d/FILE_ID/preview`
- Доступ установлен на "Все, у кого есть ссылка"
- ID файла скопирован правильно

## Если ничего не помогает

1. Проверьте, что файл действительно видео (MP4, MOV, AVI и т.д.)
2. Убедитесь, что файл не слишком большой (Google Drive может ограничивать большие файлы)
3. Попробуйте использовать YouTube вместо Google Drive
4. Проверьте, что в браузере включены JavaScript и iframe


