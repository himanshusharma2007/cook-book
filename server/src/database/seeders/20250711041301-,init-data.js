'use strict';
const bcryptjs = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert Users
    const hashedPassword1 = await bcryptjs.hash('password123', 10);
    const hashedPassword2 = await bcryptjs.hash('secure456', 10);
    await queryInterface.bulkInsert(
      'users',
      [
        {
          email: 'john.doe@example.com',
          password: hashedPassword1,
          name: 'John Doe',
        },
        {
          email: 'jane.smith@example.com',
          password: hashedPassword2,
          name: 'Jane Smith',
        },
      ],
      {}
    );

    // Insert Recipes
    await queryInterface.bulkInsert(
      'recipes',
      [
        {
          name: 'Best Pizza Dough Ever',
          instructions:
            'In a large bowl, combine flour, yeast, salt, and sugar. Add warm water and olive oil, then knead until smooth (about 10 minutes). Let dough rise for 1-2 hours until doubled. Punch down, shape into balls, and roll out for pizza. Bake at 450°F (230°C) for 10-12 minutes.',
          ingredients: [
            '4 cups all-purpose flour',
            '1 packet active dry yeast',
            '1 tsp salt',
            '1 tsp sugar',
            '1.5 cups warm water',
            '2 tbsp olive oil',
          ],
          thumbnail:
            'https://res.cloudinary.com/dspfhxvza/image/upload/v1751701599/recipes/Best_Pizza_Dough_Ever.jpg.png',
          postedAt: new Date(),
          postedBy: 1,
        },
        {
          name: 'Creamy Tomato Soup',
          instructions:
            'Sauté onions and garlic in olive oil until soft. Add canned tomatoes, vegetable broth, and basil. Simmer for 20 minutes. Blend until smooth, then stir in heavy cream. Season with salt and pepper. Serve hot with crusty bread.',
          ingredients: [
            '1 onion, chopped',
            '2 cloves garlic',
            '28 oz canned tomatoes',
            '2 cups vegetable broth',
            '1/4 cup fresh basil',
            '1/2 cup heavy cream',
            'salt',
            'pepper',
          ],
          thumbnail: null,
          postedAt: new Date(),
          postedBy: 1,
        },
        {
          name: 'Chicken Stir-Fry',
          instructions:
            'Marinate chicken in soy sauce and cornstarch. Stir-fry chicken in a hot wok with oil until cooked. Remove chicken, then stir-fry bell peppers, broccoli, and carrots. Add garlic, ginger, and sauce (soy sauce, oyster sauce, sesame oil). Return chicken to wok, toss, and serve with rice.',
          ingredients: [
            '1 lb chicken breast, sliced',
            '2 tbsp soy sauce',
            '1 tbsp cornstarch',
            '1 red bell pepper',
            '1 cup broccoli florets',
            '1 carrot, sliced',
            '2 cloves garlic',
            '1 tbsp ginger',
            '2 tbsp oyster sauce',
            '1 tsp sesame oil',
          ],
          thumbnail: null,
          postedAt: new Date(),
          postedBy: 1,
        },
        {
          name: 'Chocolate Chip Cookies',
          instructions:
            'Cream butter and sugars until fluffy. Add eggs and vanilla, mix well. Combine flour, baking soda, and salt; gradually add to wet ingredients. Stir in chocolate chips. Scoop dough onto baking sheets and bake at 375°F (190°C) for 10-12 minutes.',
          ingredients: [
            '1 cup butter, softened',
            '3/4 cup white sugar',
            '3/4 cup brown sugar',
            '2 eggs',
            '1 tsp vanilla extract',
            '2.25 cups flour',
            '1 tsp baking soda',
            '1/2 tsp salt',
            '2 cups chocolate chips',
          ],
          thumbnail: null,
          postedAt: new Date(),
          postedBy: 2,
        },
        {
          name: 'Vegetarian Quinoa Bowl',
          instructions:
            'Cook quinoa in vegetable broth. Roast sweet potatoes and chickpeas with olive oil, cumin, and paprika. Sauté kale with garlic. Assemble bowl with quinoa, roasted vegetables, kale, and avocado. Drizzle with tahini dressing.',
          ingredients: [
            '1 cup quinoa',
            '2 cups vegetable broth',
            '1 sweet potato, diced',
            '1 can chickpeas',
            '2 cups kale',
            '1 avocado',
            '2 tbsp olive oil',
            '1 tsp cumin',
            '1 tsp paprika',
            '2 tbsp tahini',
          ],
          thumbnail: null,
          postedAt: new Date(),
          postedBy: 2,
        },
        {
          name: 'Spaghetti Aglio e Olio',
          instructions:
            'Cook spaghetti until al dente. In a pan, heat olive oil and sauté sliced garlic until golden. Add red pepper flakes and cooked spaghetti, tossing to coat. Season with salt and sprinkle with parsley. Serve with grated Parmesan.',
          ingredients: [
            '12 oz spaghetti',
            '1/3 cup olive oil',
            '4 cloves garlic, sliced',
            '1/2 tsp red pepper flakes',
            '1/4 cup parsley, chopped',
            'salt',
            'Parmesan cheese',
          ],
          thumbnail: null,
          postedAt: new Date(),
          postedBy: 1,
        },
        {
          name: 'Beef Tacos',
          instructions:
            'Cook ground beef with taco seasoning until browned. Warm tortillas. Assemble tacos with beef, lettuce, tomatoes, cheddar cheese, and salsa. Serve with sour cream and lime wedges.',
          ingredients: [
            '1 lb ground beef',
            '1 packet taco seasoning',
            '8 corn tortillas',
            '1 cup shredded lettuce',
            '1 cup diced tomatoes',
            '1 cup cheddar cheese',
            '1/2 cup salsa',
            'sour cream',
            'lime wedges',
          ],
          thumbnail: null,
          postedAt: new Date(),
          postedBy: 2,
        },
        {
          name: 'Blueberry Muffins',
          instructions:
            'Mix flour, sugar, baking powder, and salt. In another bowl, combine milk, melted butter, and eggs. Combine wet and dry ingredients, then fold in blueberries. Fill muffin tins and bake at 400°F (200°C) for 20-25 minutes.',
          ingredients: [
            '2 cups flour',
            '3/4 cup sugar',
            '2 tsp baking powder',
            '1/2 tsp salt',
            '1 cup milk',
            '1/2 cup butter, melted',
            '2 eggs',
            '1.5 cups blueberries',
          ],
          thumbnail: null,
          postedAt: new Date(),
          postedBy: 2,
        },
      ],
      {}
    );

    // Insert Favorites
    await queryInterface.bulkInsert(
      'favorites',
      [
        {
          userId: 1,
          recipeId: 4, // John favorites Chocolate Chip Cookies
        },
        {
          userId: 2,
          recipeId: 1, // Jane favorites Best Pizza Dough Ever
        },
        {
          userId: 2,
          recipeId: 6, // Jane favorites Spaghetti Aglio e Olio
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Delete in reverse order to avoid foreign key issues
    await queryInterface.bulkDelete('favorites', null, {});
    await queryInterface.bulkDelete('recipes', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
