'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    const genders = ['M', 'F'];
    const genderPrefs = ['M', 'F', 'Any'];

    // Simulate name pool for variety
    const names = ['Alex', 'Jamie', 'Taylor', 'Jordan', 'Morgan', 'Sam', 'Charlie', 'Riley', 'Casey', 'Drew'];

    for (let i = 0; i < 50; i++) {
      // Random age bracket
      const ageBrackets = [
        [18, 25],
        [26, 35],
        [36, 50],
        [51, 70],
        [71, 99],
      ];
      const ageRange = ageBrackets[Math.floor(Math.random() * ageBrackets.length)];
      const randomAge = Math.floor(Math.random() * (ageRange[1] - ageRange[0] + 1)) + ageRange[0];

      // Gender and preference
      const randomGender = genders[Math.floor(Math.random() * genders.length)];
      const randomPref = genderPrefs[Math.floor(Math.random() * genderPrefs.length)];

      // Random name and email
      const name = names[Math.floor(Math.random() * names.length)] + '_' + Math.floor(Math.random() * 10000);
      const email = `${name.toLowerCase()}@example.com`;

      users.push({
        name: name,
        email: email,
        password: '$2b$10$' + Math.random().toString(36).slice(2), // Dummy hashed password
        gender: randomGender,
        bio: `Hi, I'm ${name}, aged ${randomAge}. I love connecting with new people.`,
        age: randomAge,
        pic: `https://picsum.photos/seed/${i}/200/200`,
        minAgeP: Math.max(randomAge - Math.floor(Math.random() * 10 + 1), 18),
        maxAgeP: Math.min(randomAge + Math.floor(Math.random() * 10 + 1), 99),
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
