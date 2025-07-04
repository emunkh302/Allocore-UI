import { Router, Request, Response } from "express";
import { Drink, Picture, Review } from "../db/drinks.db";
import sequelize, { Op } from "sequelize";

const router = Router();

router.get("/drinks", async (req: Request, res: Response) => {
  try {
    const offset = Number(req.query["offset"]);
    const length = Number(req.query["length"]);

    const where: sequelize.WhereOptions = {};

    const name = req.query["name"];
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    const description = req.query["description"];
    if (description) {
      where.description = { [Op.like]: `%${description}%` };
    }

    const minRating = Number(req.query["minRating"]);
    const maxRating = Number(req.query["maxRating"]);
    let having: sequelize.WhereOptions = {};
    if (minRating && maxRating) {
      having.reviewAverageRating = { [Op.gte]: minRating, [Op.lte]: maxRating };
    } else if (minRating) {
      having.reviewAverageRating = { [Op.gte]: minRating };
    } else if (maxRating) {
      having.reviewAverageRating = { [Op.lte]: maxRating };
    }

    const order: sequelize.Order = [];

    const sort = req.query["sort"];
    const desc = req.query["desc"];
    if (sort && typeof sort === "string") {
      const orderItem: sequelize.OrderItem =
        desc === "true" ? [sort, "DESC"] : sort;
      order.push(orderItem);
    }

    const rows = await Drink.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM reviews AS reviews
              WHERE
                  reviews.drinkId = drink.id
          )`),
            "reviewCount",
          ],
          [
            sequelize.literal(`(
              SELECT AVG(rating)
              FROM reviews AS reviews
              WHERE
                  reviews.drinkId = drink.id
          )`),
            "reviewAverageRating",
          ],
        ],
      },
      include: Picture,
      order,
      where,
      offset,
      limit: length,
      group: "id",
      having,
    });

    // such a hack :(
    const allRows = await Drink.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM reviews AS reviews
              WHERE
                  reviews.drinkId = drink.id
          )`),
            "reviewCount",
          ],
          [
            sequelize.literal(`(
              SELECT AVG(rating)
              FROM reviews AS reviews
              WHERE
                  reviews.drinkId = drink.id
          )`),
            "reviewAverageRating",
          ],
        ],
      },
      order,
      where,
      group: "id",
      having,
    });

    res.json({
      items: rows,
      total: allRows.length,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/drinks", async (req: Request, res: Response) => {
  try {
    const newDrink = await Drink.create(req.body);
    // @ts-ignore: sequelize doesn't have great typescript support :(
    const drink = await Drink.findByPk(newDrink.id, {
      attributes: {
        include: [
          [
            sequelize.literal(`(
            SELECT COUNT(*)
            FROM reviews AS reviews
            WHERE
                reviews.drinkId = drink.id
        )`),
            "reviewCount",
          ],
          [
            sequelize.literal(`(
            SELECT AVG(rating)
            FROM reviews AS reviews
            WHERE
                reviews.drinkId = drink.id
        )`),
            "reviewAverageRating",
          ],
        ],
      },
      include: Picture,
    });
    res.json(drink);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/drinks/:drinkId", async (req: Request, res: Response) => {
  try {
    const drinkId = req.params["drinkId"];
    const drink = await Drink.findByPk(drinkId, {
      attributes: {
        include: [
          [
            sequelize.literal(`(
            SELECT COUNT(*)
            FROM reviews AS reviews
            WHERE
                reviews.drinkId = drink.id
        )`),
            "reviewCount",
          ],
          [
            sequelize.literal(`(
            SELECT AVG(rating)
            FROM reviews AS reviews
            WHERE
                reviews.drinkId = drink.id
        )`),
            "reviewAverageRating",
          ],
        ],
      },
      include: Picture,
    });
    res.json(drink);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/drinks/:drinkId", async (req: Request, res: Response) => {
  try {
    const drinkId = req.params["drinkId"];
    const drink = await Drink.findByPk(drinkId);
    drink?.update(req.body);
    res.json(drink);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/drinks/:drinkId", async (req: Request, res: Response) => {
  try {
    const drinkId = req.params["drinkId"];
    await Drink.destroy({
      where: {
        id: drinkId,
      },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/drinks/:drinkId/reviews", async (req: Request, res: Response) => {
  try {
    const offset = Number(req.query["offset"]);
    const length = Number(req.query["length"]);

    const drinkId = req.params["drinkId"];
    const { count, rows } = await Review.findAndCountAll({
      where: { drinkId },
      offset,
      limit: length,
    });

    res.json({
      items: rows,
      total: count,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/drinks/:drinkId/reviews", async (req: Request, res: Response) => {
  try {
    const drinkId = req.params["drinkId"];
    const drink = await Drink.findByPk(drinkId);

    // @ts-ignore: sequelize doesn't have great typescript support :(
    const review = await drink.createReview(req.body);
    res.json(review);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put(
  "/drinks/:drinkId/reviews/:reviewId",
  async (req: Request, res: Response) => {
    try {
      const reviewId = req.params["reviewId"];
      const review = await Review.findByPk(reviewId);
      review?.update(req.body);
      res.json(review);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.delete(
  "/drinks/:drinkId/reviews/:reviewId",
  async (req: Request, res: Response) => {
    try {
      const reviewId = req.params["reviewId"];
      await Review.destroy({
        where: {
          id: reviewId,
        },
      });
      res.status(204).send();
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.get("/drinks/:drinkId/pictures", async (req: Request, res: Response) => {
  try {
    const drinkId = req.params["drinkId"];
    const pictures = await Picture.findAll({ where: { drinkId } });
    res.json(pictures);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post(
  "/drinks/:drinkId/pictures",
  async (req: Request, res: Response) => {
    try {
      const drinkId = req.params["drinkId"];
      const drink = await Drink.findByPk(drinkId);

      // @ts-ignore: files
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }

      console.log(req.files.file);
      console.log(req.files.file);
      const file = Array.isArray(req.files.file)
        ? req.files.file[0]
        : req.files.file;

      const staticRoot = __dirname + "/../public/";
      const path = "files/" + drinkId + "/" + file.name;
      file.mv(staticRoot + path, async (err) => {
        if (err) {
          return res.status(500).send(err);
        }

        // @ts-ignore: sequelize doesn't have great typescript support :(
        const picture = await drink?.createPicture({
          name: file.name,
          path,
          mimetype: file.mimetype,
        });

        return res.json(picture);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.delete(
  "/drinks/:drinkId/pictures/:pictureId",
  async (req: Request, res: Response) => {
    try {
      const pictureId = req.params["pictureId"];
      await Picture.destroy({
        where: {
          id: pictureId,
        },
      });
      res.status(204).send();
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

export default router;
