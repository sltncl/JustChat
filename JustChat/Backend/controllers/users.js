const User = require("../models/users");
const bcrypt = require("bcryptjs");

module.exports = {
  addUser: (req, res) => {
    const username = req.body.username;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;

    //prima controllo che tutti i campi non siano vuoti
     switch (true) {
       case !username || username.trim() === "":
         return res.json({ error: "L'username è richiesto" });
       case !firstName || firstName.trim() === "":
         return res.json({ error: "Il nome è richiesto" });
       case !lastName || lastName.trim() === "":
         return res.json({ error: "Il cognome è richiesto" });
       case !password || password.trim() === "":
         return res.json({ error: "La password è richiesta" });
     }

    User.findOne({ username })
      .then((existingUser) => {
        if (existingUser) {
          throw new Error("Username already in use");
        }
        return bcrypt.genSalt(10);
      })
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        const newUser = new User({
          username,
          firstName,
          lastName,
          password: hashedPassword,
        });
        return newUser.save();
      })
      .then((user) => {
        req.session.userId = user._id;
        return res.json([{ message: "User add" }, { user: user }]);
      })
      .catch((error) => {
        if (error.message === "Username already in use") {
          return res.json({ error: "Username already in use" });
        }
        res.status(500).json({ message: "Error registering user" });
      });
  },

  loginUser: (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let foundUser; // Variabile per memorizzare l'utente trovato

    User.findOne({
      username: username,
    })
      .then((user) => {
        if (!user) {
          throw new Error("Utente non trovato");
        }
        foundUser = user;
        return bcrypt.compare(password, user.password);
      })
      .then((isPasswordValid) => {
        if (!isPasswordValid) {
          return res.json({ error: "Credenziali non valide" });
        }
        req.session.userId = foundUser._id;
        return res.json([
          { message: "Logged in successfully" },
          { user: foundUser },
        ]);
      })
      .catch((error) => res.json({ error: error.message }));
  },

  deleteUser: (req, res) => {
    const userId = req.params.userId;

    // Verifica se l'utente è autenticato (ha una sessione valida)
    if (req.session.userId) {
      User.findByIdAndDelete(userId)
        .then((deletedUser) => {
          if (deletedUser) {
            res.json({ message: "User deleted successfully" });
          } else {
            res.json({ error: "User not found" });
          }
        })
        .catch((error) => res.json({ error: error.message }));
    } else {
      res.json({ error: "User not authenticated" });
    }
  },

  getProfile: (req, res) => {
    if (req.session.userId) {
      // Trova l'utente autenticato nel database utilizzando req.session.userId
      User.findById(req.session.userId)
        .then((user) => {
          if (user) {
            return res.json(user);
          } else {
            return res.json({ error: "User not found" });
          }
        })
        .catch((error) => res.json({ error: error.message }));
    } else {
      return res.json({ error: "User not authenticated" });
    }
  },

  logoutUser: (req, res) => {
    req.session.destroy();
    return res.json({ message: "Logged out successfully" });
  },

  getUser: (req, res) => {
    const searchText = req.query.searchText;
    const userId = req.params.userId;

    User.find({
      _id: { $ne: userId },
      username: { $regex: searchText, $options: "i" },
    })
      .limit(5)
      .then((users) => {
        return res.json(users);
      })
      .catch((error) => {
        console.error("Errore durante la ricerca degli utenti", error);
        res
          .status(500)
          .json({ error: "Errore durante la ricerca degli utenti" });
      });
  },
};
