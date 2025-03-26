# Перевод проекта с модульной архитектуры на FSD

### Быстрые переходы

TODO: Добавить ссылки

- [Стек](#Стек)
- [Описание](#Описание)
- [Шаг 0: Мигрируем страницы](#шаг-0-мигрируем-страницы)
- [Шаг 1: Мигрируем модули](#шаг-1-мигрируем-модули)
- [Шаг 2: Выделяем слой shared](#шаг-2-выделяем-слой-shared)
- [Шаг 3: Выделяем слой app](#шаг-3-выделяем-слой-app)
- [Шаг 4: Устанавливем линтер steiger и изучаем ошибки](#шаг-4-устанавливем-линтер-steiger-и-изучаем-ошибки)
- [Шаг 5 (бонусный): Что делать с глобальными клиенскими хранилищами?](#шаг-5-бонусный-что-делать-с-глобальными-клиенскими-хранилищами)
- [Шаг 6 (бонусный): Что делать если модули разрастаются?](#шаг-6-бонусный-что-делать-если-модули-разрастаются)

## Стек

- react
- typescript
- redux + preact/signals (для примера использования различных стейт менеджеров)

Перед началом вокршопа нужно установить зависимости (`npm install`) и проверить, что проект запускается (`npm run dev`).

## Описание

В проекте реализовано два модуля (`modules/cart` и `modules/popular-products`), а так же несколько сервисов (`core/feature-flags` и `core/theme`), с которыми можно взаимодействовать через di-контейнер (`core/di/*`). Сами модули взаимодействуют с друг другом при необходимости (как, на самом деле сейчас не так важно, могут напрямую, могут через DI или абстракции).

Чтобы успеть перевести весь проект на FSD, не будем рассматривать слой страниц, который в рамках модульной архитектуры не будет подвержен изменениям.

Изначально схематично проект можно представить следующим образом:

TODO_IMAGE

Каждый модуль состоит из своих ui-компонентов, сторов и сервисов:

```
📂 modules
  📂 cart
    📂 services
    📂 stores
    📂 ui
```

## Шаг 0: Мигрируем страницы

пропускаем...

## Шаг 1: Мигрируем модули

1. Переименовываем директорию `modules` в `widgets`. Вжух, и мы перевели проект на 50% на FSD (_на самом деле нет_)
2. По желанию можно переименовать сегменты, но FSD их не регламентируем (просто в примерах обычно используются `config`/`api`/`ui`/`lib`/`model`), поэтому оставим текущий нейминг (дополнение) <sup>[1](#1)</sup>

IMAGE_TODO

<details>
<summary>Структура проекта после шага</summary>

```diff
  📂 core
- 📂 modules 
+ 📂 widgets
+   📂 cart
+   📂 popular-products
  📂 types
  📄 App.module.css
  📄 App.tsx
  📄 index.css
  📄 main.tsx
```
</details>

## Шаг 2: Выделяем слой shared

1. Переносим расшаренные UI-компоненты в `~/shared/ui/*` (переносим `~/core/ui/Price` в `~/shared/ui/Price`)
2. Избавляемся от глобальной директории `types` и выносим тайпинги
3. Тип `types/product.ts` переносим в соответсвующий модуль или `~/shared`, если он должен быть глобальным для всего приложения (мы перенесем его в слой `shared`)
4. Тип `featureFlag.ts` внутрь соответствующего сервиса
5. Сервис запросов (`~/core/services/api`) переносим в `~/shared/api` (так просто сложилось, что все что касается `api` складывается в этот сегмент на слое `shared`)
3. Выносом инфраструктурные сервисы: переносим сервис фич-флагов и переключалку темы в `~/shared/services/*`. Инфраструктурные сервисы это такие же слайсы, как и виджеты, поэтому формируем их по правилам FSD.

IMAGE_TODO

<details>
<summary>Структура проекта после шага</summary>

```diff
  📂 core
-   📂 services
-   📂 ui
    📂 di
    📂 store
+ 📂 shared
+   📂 api
+     📄 fakeApi.ts
+   📂 ui
+     📂 Price
+   📂 services
+     📂 feature-flags
+       📂 ui
+       📂 services
+     📂 theme
+       📂 ui
+       📂 services
+   📄 global-types.ts
- 📂 types
-   📄 styles.d.ts
-   📄 product.ts
-   📄 featureFlags.ts
  📂 widgets
    📂 cart
    📂 popular-products
  📄 App.module.css
  📄 App.tsx
  📄 index.css
  📄 main.tsx
```
</details>

## Шаг 3: Выделяем слой app

1. Выносим _entry-point_ (`App*`, `main*`) приложения на слой `app`
1. Переносим redux. Тут важно, что инициализацию мы можем делать только на слое `app`, так как нужен доступ ко всем сторам модулей. TODO
2. Переносим TODO


<details>
<summary>Структура проекта после шага</summary>

```diff
- core
+ 📂 app
+   📂 di
+   📂 store → 📄 reduxStore.ts
+   📄 App.module.css
+   📄 App.tsx
+   📄 index.css
+   📄 main.tsx
  📂 shared
    📂 ui  
    📂 services
+   📂 redux
+       📂 components TODO
+       📂 services
+     📂 di
+       📄 container.ts
+       📄 useDi.ts
  📂 widgets
- 📄 index.html
+ 📄 index.html
- 📄 App.module.css
- 📄 App.tsx
- 📄 index.css
- 📄 main.tsx
```
</details>

## Шаг 4: Устанавливем линтер steiger и изучаем ошибки

Устанавливаем [`steiger`](https://github.com/feature-sliced/steiger) и плагин с правилами для FSD.

```bash
$ pnpm add -D steiger @feature-sliced/steiger-plugin --filter modular-architecture
```

При запуске получаем ряд ошибок, которые сейчас будем исправлять.

// TODOOOO


По сути мы сохранили изначальную архитектуру проекта, добавили полезное из FSD и покрыли архитектуру линтером.

## Шаг 5 (бонусный): Что делать с глобальными клиенскими хранилищами?

Некоторые библиотеки с глобальным хралищем позволяют динамически инициализировать локальные стейты (в контексте редакса `redux-slice`). В этом случае нужно создать пустой стор изначально, сделать any глобальные типы редакса, типа AppState, и инжектить слайсы в rootReducer динамически. Тем самым мы решим проблему использования `app` слоя в слайсах с нижних уровней.

<details>
<summary>Структура проекта после шага</summary>

```diff
  📂 app
-   📄 reduxStore.ts
+   📄 reduxStore.ts
  📂 shared
    📂 services
      📂 redux
+       📄 createAppAsyncThunk.ts
+       📄 rootReducer.ts
+       📄 useAppDispatch.ts
+       📄 useAppSelector.ts
-       📄 types.ts
+       📄 types.ts
        📄 index.ts
  📂 widgets
    📂 popular-products
```
</details>

## Шаг 6 (бонусный): Что делать если модули разрастаются?

Что делать, если модулей становится слишком много?

```diff
  📂 app
  📂 shared
  📂 widgets
    📂 base-products-slider
    📂 popular-products
    📂 awesome-products
    📂 purchased-products
    📂 product-filters
    📂 product-details-modal
    ...
    📂 product-details-modal
```

### 1 - Разделение модулей по доменам

Есть несколько вариантов решения, например использовать разделение по доменному смыслу самих модулей. Этот вариант официально не описан в документации и в настоящий момент не поддерживается `steiger`, но он не нарушает правил FSD и является логичным развитием при увелечении кодовой базы.

```diff
  📂 app
  📂 shared
+ 📂 domain
+   📂 catalog
+   📂 cart
+   📂 product
      📂 widgets
        📂 base-products-slider
        📂 popular-products
        ...
        📂 awesome-products
      📂 shared
```

### 2 - Локальные модули в рамках страниц

Есть вариант ввести возможность создания подмодулей в рамках текущих, но он нарушает правила описания слайсов в FSD, поэтому его в официальной документации найти не получится. Но этот вариант все равно используют, обычно вместе со слоем страниц, когда модули делят на (1) общие для всего приложения и (2) локальные модули в рамках страниц. Это разновидность доменного деления модулей, где доменом является страница:

```diff
  📂 app
  📂 shared
  📂 widgets
    📂 base-products-slider
+ 📂 pages
+   📂 home
+     📂 widgets
        📂 popular-products
+     📄 index.tsx
+   📂 catalog
+     📂 widgets
        📂 awesome-products
        📂 product-details-modal
+     📄 index.tsx
```

Это очень похоже на текущее направление развития FSD, которое ввели в версии 2.1 - проектировать свое приложение вокруг страниц. Да исключением того, что сама страница состоит из локальных модулей (в рамках FSD - виджетов). Стоит отметить, что этот вариант так же не поддерживается на уровне `steiger`.

### 3 - Монорепозиторий

TODO

```diff
~root
  📂 packages
    📂 shared
      📂 api
      📂 ui
      📂 services
    📂 domain-catalog  // внутри уже деление по FSD
      📂 pages
      📂 widgets
      📂 shared
    📂 domain-cart
      📂 pages
      📂 widgets
      📂 shared
```

## Сноски

### 1

В линтере `steiger` заложены названия некоторых сегментов (а если быть точнее, в пакете [feature-sliced / filesystem](https://github.com/feature-sliced/filesystem/blob/main/src/definitions.ts#L36C8-L36C81)) и целые правила (типа [`no-ui-in-app`](https://github.com/feature-sliced/steiger/blob/c9012aa7f17bcf47746d2e83cec5feb4ce088a55/packages/steiger-plugin-fsd/src/no-ui-in-app/index.ts#L18C29-L18C40)), поэтому при его использовании стоит придерживаться названий сегментов, которые указаны в доке FSD. Например, не получится использовать название сегмента `components` вместо `ui`.
