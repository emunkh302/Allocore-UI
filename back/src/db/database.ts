import { DataTypes, Sequelize } from "sequelize";
import path from "path";

const db = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(__dirname, "../../drinks.db"),
});

const Drink = db.define("Drink", {
  name: DataTypes.STRING,
  description: DataTypes.STRING,
});

const Review = db.define("Review", {
  user_name: DataTypes.STRING,
  description: DataTypes.STRING,
  rating: DataTypes.NUMBER,
});

const Picture = db.define("Picture", {
  name: DataTypes.STRING,
  mimetype: DataTypes.STRING,
  path: DataTypes.STRING,
});

Review.belongsTo(Drink);
Picture.belongsTo(Drink);
Drink.hasMany(Review);
Drink.hasMany(Picture);

export { db, Drink, Review, Picture };
