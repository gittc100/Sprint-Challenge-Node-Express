// import requirements
const express = require("express");
const router = express.Router();
// import database's
const projectDB = require("../data/helpers/projectModel");
const actionDB = require("../data/helpers/actionModel");
//Routing actionDB
// get action by id
router.get("/:projectID/actions/:actionID", (req, res) => {
  const { projectID, actionID } = req.params;
  projectDB
    .getProjectActions(projectID)
    .then(posts => {
      if (posts.length > 0) {
        let postVar = posts[0].postedBy; // check for post id ownership, post id will otherwise show for incorrect user
        actionDB
          .get(actionID)
          .then(post => {
            if (post.postedBy === postVar) {
              res.status(200).json(post);
            } else {
              res.status(404).json({
                message: `Post ID ${actionID} does not exist for ${postVar}.`
              });
            }
          })
          .catch(() =>
            res
              .status(500)
              .json({ error: "The User information could not be retrieved." })
          );
      } else {
        res
          .status(404)
          .json({ message: `User ID ${projectID} does not have any Posts.` });
      }
    })
    .catch(() =>
      res
        .status(500)
        .json({ error: "The User information could not be retrieved." })
    );
});
// post action
router.post("/:projectID/actions", (req, res) => {
  const actionInfo = req.body;
  if (!actionInfo.project_id || !actionInfo.description || !actionInfo.notes) {
    res.status(400).json({
      errorMessage:
        "Please provide project_id || description || notes feilds for the project."
    });
  } else {
    actionDB
      .insert(actionInfo)
      .then(actionID => {
        console.log(actionID);
        res.status(200).json(actionID);
      })
      .catch(err => {
        res.status(500).json({
          error: `There was an error while saving the user to the database: ${err}`
        });
      });
  }
});
// delete action
router.delete("/:projectID/actions/:actionID", (req, res) => {
  const { actionID } = req.params;
  actionDB
    .get(actionID)
    .then(action => {
      if (action) {
        actionDB.remove(actionID).then(() => {
          res.status(200).json(action);
        });
      }
    })
    .catch(err => {
      res.status(404).json({
        message: `The action with the specified ID does not exist: ${err}`
      });
    });
});
// update action
router.put("/:projectID/actions/:actionID", (req, res) => {
  const { actionID } = req.params;
  const actionChanges = req.body;
  if (
    !actionChanges.project_id ||
    !actionChanges.description ||
    !actionChanges.notes
  ) {
    res.status(400).json({
      errorMessage:
        "Please provide project_id || description || notes feilds for the project."
    });
  } else {
    actionDB
      .get(actionID)
      .then(action => {
        if (action) {
          actionDB
            .update(actionID, actionChanges)
            .then(() => {
              actionDB.get(actionID).then(action => {
                res.status(200).json(action);
              });
            })
            .catch(() => {
              res.status(500).json({
                error: "The action information could not be modified."
              });
            });
        }
      })
      .catch(err => {
        res.status(404).json({
          message: `The action with the specified ID does not exist: ${err}`
        });
      });
  }
});
// export router for server.js use
module.exports = router;
