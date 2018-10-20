module.exports = function(sequelize, DataTypes) {
  var audition = sequelize.define("audition", {
    title: DataTypes.STRING,
    source: DataTypes.STRING,
    category:DataTypes.STRING,
    tags:DataTypes.STRING,
    isUnion:DataTypes.STRING,
    compensation:DataTypes.STRING,
    link:DataTypes.STRING,
    organization:DataTypes.STRING,
    state:DataTypes.STRING,
    date:DataTypes.STRING,
  })
  return audition;
};
