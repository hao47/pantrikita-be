const Constants = {
  Security: {
    DEFAULT_SECRET_KEY:
      '1a854e81ee169fe2fd85478f56dfbe8040a551220b9f78683a586acaf21353f6',
    OPENROUTER_AI_API: 'Bearer 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',
  },
  ErrorMessages: {
    Auth: {
      USERNAME_IS_ALREADY_TAKEN: 'Username is already taken',
      USERNAME_NOT_FOUND: 'Username not found',
      USER_NOT_FOUND: 'User not found',
      INVALID_PASSWORD: 'Invalid Password',
      TOKEN_NOT_FOUND: 'Token not found',
      TOKEN_IS_INVALID: 'Token is invalid',
    },
  },
  FoodCategories: [
    { name: "Dairy", icon: "🥛" },
    { name: "Vegetable", icon: "🥕" },
    { name: "Fruit", icon: "🍎" },
    { name: "Grains", icon: "📦" },
    { name: "Meat", icon: "🥩" },
    { name: "Seafood", icon: "🐟" }
  ]

};

export default Constants;
