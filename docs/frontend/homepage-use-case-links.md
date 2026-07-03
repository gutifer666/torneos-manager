# 🎯 Register use cases on the homepage

## 💡 Convention

Every time a new use case is created that represents a main functionality accessible to the user (such as registering a player, registering a team, etc.), a shortcut (Link) must be added to the homepage (`src/app/page.tsx`).

## 🏆 Benefits

- Improves discoverability of new features for the end user.
- Provides a centralized entry point for all system actions.
- Ensures that backend and frontend development is aligned with the user interface.

## 👀 Examples

### ✅ Good

Add a Next.js `Link` component within the main grid of the homepage with a descriptive icon and a brief explanation.

```tsx
<Link
    href="/players/new"
    className="group flex flex-col items-center p-8 bg-white text-green-900 rounded-2xl shadow-xl transition-all hover:scale-105 hover:bg-green-50"
>
    <div className="text-6xl mb-4 group-hover:animate-bounce">🏃‍♂️</div>
    <h2 className="text-2xl font-bold mb-2 text-green-900">Registrar Jugador</h2>
    <p className="text-center text-green-700">
        Añade nuevos talentos a tu base de datos con todos sus detalles técnicos.
    </p>
</Link>
```

### ❌ Bad

Create the use case and the feature page but leave it inaccessible from the main navigation, forcing the user to know the exact URL.

## 🧐 Real world examples

- [Homepage with links to Players and Teams](src/app/page.tsx)

## 🔗 Related agreements

- [Thin API Routes](../backend/thin-api-routes.md)
