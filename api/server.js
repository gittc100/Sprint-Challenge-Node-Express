// import requirements
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
// import database's
const projectDB = require("../data/helpers/projectModel");
const actionDB = require("../data/helpers/actionModel");
// create server instance
const server = express();
// Middleware
server.use(morgan("short")); // looging third party middleware
server.use(helmet()); // security
server.use(express.json()); // built-in json parser incoming and out going
server.use(cors()); // security cross domain
//Routing
// Initial Check for routing
server.get("/", (req, res) => {
  res.send(`sanity check success`);
});

// projectDB
// get all projects
server.get("/api/projects", (req, res) => {
  projectDB
    .get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(() => {
      res.status(500).json({
        error: "The project information could not be retrieved."
      });
    });
});

// get by id
server.get("/api/projects/:projectID", (req, res) => {
  const { projectID } = req.params;
  projectDB
    .get(projectID)
    .then(project => {
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({
          message: "The Project with the specified ID does not exist."
        });
      }
    })
    .catch(() =>
      res
        .status(500)
        .json({ error: "The Project information could not be retrieved." })
    );
});

// get all actions
server.get("/api/projects/:projectID/actions", (req, res) => {
  const { projectID } = req.params;
  projectDB
    .getProjectActions(projectID)
    .then(actions => {
      if (actions.length > 0) {
        res.status(200).json(actions);
      } else {
        res
          .status(404)
          .json({ message: `User ID ${projectID} does not contain any Posts.` });
      }
    })
    .catch(() =>
      res
        .status(500)
        .json({ error: "The User information could not be retrieved." })
    );
});

// post user
server.post("/api/projects", (req, res) => {
  const projectInfo = req.body;
  if (!projectInfo.name || !projectInfo.description) {
    res.status(400).json({
      errorMessage:
        "Please provide name || description || completed feilds for the project."
    });
  } else if (
    projectInfo.completed === false ||
    projectInfo.completed === true
  ) {
    projectDB
      .insert(projectInfo)
      .then(project => {
        res.status(201).json(project);
      })
      .catch(err => {
        res.status(500).json({
          error: `There was an error while saving the project to the database: ${err}`
        });
      });
  }
});

// delete user
server.delete("/api/projects/:projectID", (req, res) => {
  const { projectID } = req.params;
  projectDB
    .get(projectID)
    .then(project => {
      if (project) {
        projectDB.remove(projectID).then(result => {
          console.log(result);
          res.status(200).json(project);
        });
      }
    })
    .catch(() => {
      res.status(404).json({
        message: "The project with the specified ID does not exist."
      });
    });
});

// update user
server.put("/api/projects/:projectID", (req, res) => {
  const { projectID } = req.params;
  const projectChanges = req.body;

  if (!projectChanges.name || !projectChanges.description) {
    res.status(400).json({
      errorMessage:
        "Please provide name || description || completed feilds for the project."
    });
  } else if (
    projectChanges.completed === false ||
    projectChanges.completed === true
  ) {
    projectDB
      .get(projectID)
      .then(project => {
        if (project) {
          projectDB
            .update(projectID, projectChanges)
            .then(project => {
              res.status(200).json(project);
            })
            .catch(() => {
              res.status(500).json({
                error: "The project information could not be modified."
              });
            });
        }
      })
      .catch(err => {
        res.status(404).json({
          message: `The project with the specified ID does not exist: ${err}`
        });
      });
  }
});
















// export server for index.js use
module.exports = server;
