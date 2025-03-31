# Перевод проекта с модульной архитектуры на FSD

### Быстрые переходы

- [Стек](#Стек)
- [Описание](#Описание)
- [Шаг 0: Мигрируем страницы](#шаг-0-мигрируем-страницы)
- [Шаг 1: Мигрируем модули](#шаг-1-мигрируем-модули)
- [Шаг 2: Выделяем слой shared](#шаг-2-выделяем-слой-shared)
- [Шаг 3: Выделяем слой app](#шаг-3-выделяем-слой-app)
- [Шаг 4: Устанавливем линтер steiger и изучаем ошибки](#шаг-4-устанавливем-линтер-steiger-и-изучаем-ошибки)
- [Шаг 5 (бонусный): Что делать с глобальными клиенскими хранилищами?](#шаг-5-бонусный-что-делать-с-глобальными-клиенскими-хранилищами)
- [Шаг 6 (бонусный): Что делать если модули разрастаются?](#шаг-6-бонусный-что-делать-если-модули-разрастаются)
- [Сноски](#Сноски)

## Стек

- pnpm (установка https://pnpm.io/installation)
- react
- typescript
- redux + preact/signals (для примера использования различных стейт менеджеров)

Перед началом вокршопа нужно установить зависимости (`pnpm install`) и проверить, что проект запускается (`pnpm dev:modular`).

## Описание

В проекте реализовано два модуля (`modules/cart` и `modules/popular-products`), а так же несколько сервисов (`core/feature-flags` и `core/theme`), с которыми можно взаимодействовать через di-контейнер (`core/di/*`). Сами модули взаимодействуют с друг другом при необходимости (как, на самом деле сейчас не так важно, могут напрямую, могут через DI или абстракции).

Чтобы успеть перевести весь проект на FSD, не будем рассматривать слой страниц, который в рамках модульной архитектуры не будет подвержен изменениям.

Изначально схематично проект можно представить следующим образом:

<img width="827" alt="Снимок экрана 2025-03-31 в 22 49 27" src="https://github.com/user-attachments/assets/da56e1f5-e72c-4b58-9e04-3f92c94c7bd0" />

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

<img width="960" alt="Снимок экрана 2025-03-31 в 22 49 32" src="https://github.com/user-attachments/assets/a3f4b857-d1fa-4357-9b48-1ab8111743be" />

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
4. Тип `types/featureFlag.ts` внутрь соответствующего сервиса
5. Сервис запросов (`~/core/services/api`) переносим в `~/shared/api` (так просто сложилось, что все что касается `api` складывается в этот сегмент на слое `shared`)
6. Выносом инфраструктурные сервисы: переносим сервис фич-флагов и переключалку темы в `~/shared/*`. Инфраструктурные сервисы это такие же слайсы, как и виджеты, поэтому формируем их по правилам FSD <sup>[2](#2)</sup>

<img width="831" alt="Снимок экрана 2025-03-31 в 22 49 41" src="https://github.com/user-attachments/assets/612c6ea1-0247-495b-9310-7949b0182f9d" />

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

1. Выносим _entry-point-ы_ (`App*`, `main*`) приложения на слой `app`
2. Переносим redux. Тут важно, что инициализацию мы можем делать только на слое `app`, так как нужен доступ ко всем сторам (редьюсерам), которые лежат на всех слоях приложения. Но в других местах приложения нам нужен тип `AppStore`, который нельзя импортировать из слоя `app`.

<img width="923" alt="Снимок экрана 2025-03-31 в 22 49 50" src="https://github.com/user-attachments/assets/2bf6c558-5d80-44d2-92e5-76dc6e27c3ef" />

Что в таком случае делать? В таких случаях можно проксировать тип через shared (и нарушение кросс импортов будет только в одном файле реэкспорта нужного типа). Это нарушает FSD, но в случае с глобальными инструментами, это самый безболезненный вариант для работы.

```ts
// Везде теперь используем импорт из этого файла, а не `app` слоя
// 📄 ~/shared/redux/types.ts

// FSD LIMITATION
export { AppDispatch, AppState } from '~/app/reduxStore'
```

3. Переносим DI контейнере. Точно такая же история, как и с редаксом. Для поддержки корректности вывода типов при регистрации модулей в контейнере, сами модули регистрируем на слое `app`, а хук и реализацию самого контейнера уносим в слой `~/shared/di/*`.

```ts
// Регистируем модули в контейнере на app слое
// 📄 ~/app/diContainer.ts

import { Container } from '~/shared/di'
import { featureFlagService } from '~/shared/feature-flags'
import { themeService } from '~/shared/theme'
import { cartStore } from '~/widgets/cart'

export const container = new Container({
  FEATURE_FLAGS_SERVICE_TOKEN: featureFlagService,
  THEME_SERVICE_TOKEN: themeService,
  CART_STORE_TOKEN: cartStore,
  // ...
} as const)
```

```ts
// Хук для использования контейнера выносим на shared слой
// 📄 ~/shared/di/useDi.ts

// FSD LIMITATION
import { container } from '~/app/diContainer'

export function useDi<T extends ReturnType<typeof container.getKeys>[number]>(token: T) {
  return container.get(token)
}
```

<img width="873" alt="Снимок экрана 2025-03-31 в 22 49 56" src="https://github.com/user-attachments/assets/19d1afd6-1c66-4289-9440-35fa763491b2" />

<details>
<summary>Структура проекта после шага</summary>

```diff
- core
+ 📂 app
+   📂 di → 📄 diContainer.ts
+   📂 store → 📄 reduxStore.ts
+   📄 App.module.css
+   📄 App.tsx
+   📄 index.css
+   📄 main.tsx
  📂 shared
    📂 ui  
    📂 services
+   📂 redux
+     📄 types.ts ⚠️ FSD LIMITATION
+   📂 di
+     📄 container.ts 
+     📄 useDi.ts ⚠️ FSD LIMITATION
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

Запускаем:

```bash
$ pnpm steiger:modular
$ pnpm steiger:modular --watch # В вотч режиме
```

При запуске получаем ряд ошибок, которые сейчас будем исправлять. Чаще всего встречаются два правила - `fsd/public-api` и `fsd/no-public-api-sidestep`, которая обязывает слайсы иметь публичный API и взаимодействовать с ними только через этот публичный API.

```bash
┌ src/app/App.tsx
✘ Forbidden sidestep of public API when importing from "~/shared/di/useDi".
│
└ fsd/no-public-api-sidestep: https://github.com/feature-sliced/steiger/tree/master/packages/steiger-plugin-fsd/src/no-public-api-sidestep
```

Для решения проблемы для каждого слайса нужно выделить публичный API (эскпортировать во внешний мир через файл `index.ts` публичные части слайсов и сегментов). Это же необходимо сделать для сегментов из `shared` слоя. <sup>[3](#3)</sup>

Коммит с добавлением публичного api: https://github.com/noveogroup-amorgunov/holyjs-2025-fsd-workshop/commit/f65bb3fa14f81adff29319427ed4c79ddc910e2d 

Остается еще 4 ошибки, касательно кросс импортов и импортов из слоев выше.

```bash
┌ src/shared/di/useDi.tsx
✘ Forbidden import from higher layer "app".
│
└ fsd/forbidden-imports: https://github.com/feature-sliced/steiger/tree/master/packages/steiger-plugin-fsd/src/forbidden-imports

┌ src/shared/redux/types.ts
✘ Forbidden import from higher layer "app".
│
└ fsd/forbidden-imports: https://github.com/feature-sliced/steiger/tree/master/packages/steiger-plugin-fsd/src/forbidden-imports

┌ src/widgets/popular-products/ui/ProductList/ProductList.tsx
✘ Forbidden cross-import from slice "cart".
│
└ fsd/forbidden-imports: https://github.com/feature-sliced/steiger/tree/master/packages/steiger-plugin-fsd/src/forbidden-imports

┌ src/widgets/popular-products/ui/ProductListCard/ProductListCard.tsx
✘ Forbidden cross-import from slice "cart".
│
└ fsd/forbidden-imports: https://github.com/feature-sliced/steiger/tree/master/packages/steiger-plugin-fsd/src/forbidden-imports
```

Что касается импортов из слоев выше, то мы их оставили намеренно, поэтому просто отключим их в конфиге линтера, так как мы оставили эти импорты намеренно:

```js
// 📄 steiger.config.js

import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: [
      'src/shared/redux/types.ts',
      'src/shared/di/useDi.tsx',
    ],
    rules: {
      'fsd/forbidden-imports': 'off',
    },
  },
])
```

Две оставшиеся проблемы касаются кросс-импортов виджетов. Виджет `popular-products` в UI импортирует стор виджета `cart` и react-компонент `AddToCartButton`.

Все эти кейсы уже по многу раз были разобраны ранее и могут быть решены следующим образом:

- Получать компонент сверху (через пропы, паттерн render-slot, через DI контейнер, использовать шину событий)
- Продублирать код в двух местах
- Вынести общую часть на слой выше (например в `shared` можно было бы вынести `AddToCartButton`)
- На крайний случай отключить правило для виджета внутри линтера <sup>[4](#4)</sup>

И наконец мы увидим заветные:

```
✔ No problems found!
```

--- 

Что получили по итогу? Сохранили изначальную архитектуру проекта, добавили полезное из FSD и покрыли архитектуру проверками линтера.

Финальный код находится в ветке [modular-architecture](https://github.com/noveogroup-amorgunov/holyjs-2025-fsd-workshop/tree/modular-architecture).

## Шаг 5 (бонусный): Что делать с глобальными клиенскими хранилищами?

Некоторые библиотеки с глобальным хралищем позволяют динамически инициализировать локальные стейты (в контексте редакса `redux-slice`), что решит проблему реэкспорта типов. В этом случае нужно создать пустой стор изначально, объявить как `any` глобальные типы редакса, типа `AppState`, и инжектить слайсы в `rootReducer` динамически. Тем самым мы решим проблему использования `app` слоя в слайсах с нижних уровней.

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

Коммит с изменениями: https://github.com/noveogroup-amorgunov/holyjs-2025-fsd-workshop/commit/399926f6c6cdf975caebf9e6afb98b0fd2104a48

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

Первый вариант с "большими" модулями (доменами) можно представить в виде монорепозитория, где каждый пакет - это отдельное FSD приложение.

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

### 2

Я предпочитаю выносить инфраструктурные сервисы (ака сущности) внутрь `~shared/services` (новый кастомной глобальный слой), чтобы так же была возможность строить сервисы как самостоятельные слайсы. Подробнее [рассказывал на HolyJS 2024](https://youtu.be/H_rJ0zB8rqc?si=UsQtOi_mZ5bvM5TS&t=1697)

### 3

Вообще многие (я в том числе) отказываются от этого правила (публичное API для шаред-сегментов) для `~/shared/ui`, чтобы поддержать код сплиттинг в проекте. Здесь выбор остается за вами.

### 4

Сейчас можно в целом выключить правило кросс-импорта для слайса (например, виджета), даже если у нас есть всего один кросс импорт (или мы явно хотим связать два слайса между собой). Об этом писал в ишьюсы https://github.com/feature-sliced/steiger/issues/182 , возможно в будущем появится возможность отключать кросс импорты между конкретными слайсами.
