const Constants = {
  Security: {
    DEFAULT_SECRET_KEY:
      '1a854e81ee169fe2fd85478f56dfbe8040a551220b9f78683a586acaf21353f6',
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
    { name: "Vegetables", icon: "🥕" },
    { name: "Fruits", icon: "🍎" },
    { name: "Grains", icon: "📦" },
    { name: "Meat", icon: "🥩" },
    { name: "Seafood", icon: "🐟" }
  ]

};

export default Constants;
