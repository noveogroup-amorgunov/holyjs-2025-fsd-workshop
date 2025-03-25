# Перевод проекта с чистой архитектуры на FSD

### Быстрые переходы

## Стек

- react
- typescript
- redux + preact/signals (для примера использования различных стейт менеджеров)

## Описание

Проект реализован на основе чистой архитектуры, которая отделяет бизнес-логику (домен и прикладной слой) от инфраструктурного кода (включая UI).

Описаны три бизнес сущности: корзина (`cart`), пользователь (`user`) и товар (`product`), и три юзкейса: добавить товар в корзину (`addToCart`), авторизовать пользователя (`loginUser`) и загрузить популярные товары (`loadPopularProducts`). Они полностью изолированы от фреймворков и сервисов, которые есть в приложении. Дополнительно описаны порты (`~/application/ports.ts`), интерфейсы зависимостей (адаптеров), которые нужны для выполнения юзкейса.

```diff
 📂 application
   📄 addToCart.ts
   📄 loadPopularProducts.ts
   📄 loginUser.ts
   📄 ports.ts
 📂 domain
   📄 cart.ts
   📄 product.ts
   📄 user.ts
```

Все внешние зависимости лежат в `~/services/*` и представляют собой адаптеры для реализации юзкейсов. UI компоненты так же лежат отдельно в `~/ui/*`:

```diff
 📂 application
 📂 domain
 📂 services
   📄 api.ts
   📄 authAdapter.ts
   📄 featureFlagService.ts  
   📄 productServiceAdapter.ts
   ...
 📂 ui
   📂 AddToCartButton
   📂 FeatureToggle
   📂 Price
   📂 ProductList
   ...     
```

Изначально схематично проект можно представить следующим образом:

IMAGE_TODO

Каждый модуль состоит из своих ui-компонентов, сторов и сервисов:

```
📂 modules
  📂 cart
    📂 services
    📂 components
    📂 stores
```

