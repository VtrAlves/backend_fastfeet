'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('delivery_problems', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      deliveryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'deliveries', key: 'id' },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('delivery_problems')
  }
}
