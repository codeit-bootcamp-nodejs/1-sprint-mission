class Product {
  constructor(name, description, price, tags, images) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }

  set favoriteCount(count) {
    throw new Error("call favorite()");
  }

  get favoriteCount() {
    return this._favoriteCount;
  }

  favorite() {
    this.favoriteCount += 1;
  }
}
class ElectronicProduct extends Product {
  constructor(
    name,
    description,
    price,
    tags,
    images,
    favoriteCount = 0,
    manufacturer = null
  ) {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }
}

export { Product, ElectronicProduct };
