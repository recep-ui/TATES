// Recipe model (example, not using ORM)
class Recipe {
  constructor({ id, title, description, ingredients, steps, imageUrl, userId }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.ingredients = ingredients;
    this.steps = steps;
    this.imageUrl = imageUrl;
    this.userId = userId;
  }
}
module.exports = Recipe;
