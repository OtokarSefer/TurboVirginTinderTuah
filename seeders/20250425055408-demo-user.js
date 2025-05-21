'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    for (let i = 0; i < 10000; i++) {
      const randomPicUrl = `https://picsum.photos/200?random=${i * Math.random()}`; // Random image URL from picsum
      const randomAge = Math.floor(Math.random() * (50 - 18 + 1)) + 18; // Random age between 18 and 50
      const randomGender = Math.random() > 0.5 ? 'M' : 'F'; // Random gender
      const randomBio = `This is user ${i + 1}, just another test user.`;
      const randomPref = Math.random() > 0.5 ? 'Any' : randomGender === 'M' ? 'F' : 'M'; // Random gender preference

      users.push({
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: '$2b$10$' + Math.random().toString(36).slice(2), // Random hashed password
        gender: randomGender,
        bio: randomBio,
        age: randomAge,
        pic: randomPicUrl, // Random image URL from picsum
        minAgeP: Math.max(randomAge - 5, 18),
        maxAgeP: randomAge + 5,
        genderPref: randomPref,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('Users', users);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
