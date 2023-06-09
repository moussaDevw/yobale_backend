const express = require("express");
const AuthController = require("./../controllers/AuthController");
const { body } = require("express-validator");
const User = require("./../models/user");
const router = express.Router();

const verifAuth = require("./../middleware/auth");

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .custom(async (value) => {
        const existingPhone = await User.findOne({ where: { email: value } });
        if (existingPhone) {
          throw new Error("existe");
        }
      })
      .trim(),
    body("password").isLength({ min: 4 }),
    body("fullName").isString().optional(),
    body("image").isString().optional(),
    body("phone")
      .optional()
      .isLength({ min: 3 })
      .custom(async (value) => {
        const existingPhone = await User.findOne({ where: { phone: value } });
        if (existingPhone) {
          throw new Error("existe");
        }
      }),
    // body('typeId').isInt(),
  ],
  AuthController.sginIn
);

router.post(
  "/signin",
  [body("email").isEmail().trim(), body("password").isLength({ min: 8 })],
  AuthController.signUp
);

router.post("/notification", AuthController.notification);

router.put(
  "/token",
  [body("email").isEmail().trim(), body("token").isString()],
  AuthController.updateToken
);

router.post(
  "/admin/signin",
  [body("email").isEmail().trim(), body("password").isLength({ min: 8 })],
  AuthController.signUpAdmin
);

router.post(
  "/livreur/signin",
  [body("email").isEmail().trim(), body("password").isLength({ min: 8 })],
  AuthController.signUpLivreur
);

router.post(
  "/magasin/signin",
  [body("email").isEmail().trim(), body("password").isLength({ min: 8 })],
  AuthController.signUpRestaurant
);

router.post(
  "/signin",
  [body("email").isEmail().trim(), body("password").isLength({ min: 8 })],
  AuthController.signUp
);

router.get("/custmer/verif", verifAuth, AuthController.verifAuth);
router.get("/verif/shop", verifAuth, AuthController.verifAuthShop);
router.get("/verif/livreur", verifAuth, AuthController.verifAuthLivreur);

router.get("/", async (req, res) => {
  try {
    // console.log('test mail')

    // let message = {
    //     from: 'no-replay@yobalapp.com',
    //     to: "adnanerouhi@gmail.com",
    //     subject: "Information créer",
    //     html: `<h1> bien reçu </h1>`,
    // };

    //  let response = await sendMail(message);
    //  console.log(response)
    //  if(!response) return res.json({message: "email problem", response});
    // let emailSent= true;
    // if(response.error){
    //     emailSent = false;
    // }
    return res.json({ source: "api yobal" });
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/register",
  [
    body("email").isEmail(),

    body("password").isLength({ min: 4 }),
    body("nom").isString().optional(),
    body("prenom").isString().optional(),
    body("phone").optional(),
  ],
  AuthController.sginIn
);
module.exports = router;
