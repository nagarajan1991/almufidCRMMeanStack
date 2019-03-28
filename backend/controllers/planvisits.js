const PlanVisit = require('../models/planvisit');
var mongoose = require('mongoose');

exports.CreatePlanVisit = (req, res, next) => {
  const planVisit = new PlanVisit({
    userId: req.body.userId,
    creator_name: req.body.creator_name,
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    pcolor: req.body.pcolor,
    scolor: req.body.scolor,
    draggable: req.body.draggable,
    /*  resizable: {
       beforeStart: true,
       afterEnd: true,
     }, */
    creator: req.userData.userId
  });
  planVisit.save().then(createdPlanVisit => {
    res.status(201).json({
      message: "Vist added successfully",
      planVisitId: createdPlanVisit._id
    });
  })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Creating PlanVisit Failed!"
      });
    });
};

exports.updatePlanVisit = (req, res, next) => {
  const planVisit = new PlanVisit({
    _id: req.body.id,
    userId: req.body.userId,
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    pcolor: req.body.pcolor,
    scolor: req.body.scolor,
    draggable: req.body.draggable,
    resizable: {
      beforeStart: true,
      afterEnd: true,
    },
    creator: req.userData.userId
  });
  PlanVisit.updateOne({ _id: req.params.id, creator: req.userData.userId }, planVisit).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Update Successfull!" });
    } else {
      res.status(401).json({ message: "Not Authorized!" });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update the post"
      });
    });
};


exports.getPlanVisits = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const searchValue = req.query.searchValue;
  const period = req.query.period;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const userId = req.query.userId;


  let postQuery = null;

  if (searchValue && searchValue!='undefined') {
    postQuery = PlanVisit.find({ customer: new RegExp(searchValue, 'i') });
  }

   if (period && period != 'undefined') {
    let date = new Date();
    let firstDay = null;
    let lastDay = null;
    if (period == 'Daily') {

      firstDay = new Date(date.getFullYear(), date.getMonth(),  date.getDate());
      lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    }
    if (period == 'Monthly') {

      console.log('monthly block visited');
      firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    }
    if (period == 'Yearly') {
      firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      lastDay = new Date(date.getFullYear(), date.getMonth() + 12, 0);
    }
    if (userId != 'undefined') {
      console.log('user id fetched for plan visit');
      postQuery = PlanVisit.find({ "end": { "$gte": firstDay, "$lt": lastDay }, 'creator':  mongoose.Types.ObjectId(userId) });
    }else{
      postQuery = PlanVisit.find({ "end": { "$gte": firstDay, "$lt": lastDay } });
    }
  } else if ((!period || period == 'undefined') && userId &&  userId != 'undefined') {
    postQuery = PlanVisit.find({ userId: userId });
  } else if (startDate && endDate && startDate != 'undefined' && endDate != 'undefined') {
    postQuery = PlanVisit.find({ "end": { "$gte": startDate, "$lt": endDate } });
  }
  else {
    postQuery = PlanVisit.find();
  }

  let fetchedPlanVisits;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }

  postQuery
    .then(documents => {
      fetchedPlanVisits = documents;
      console.log(fetchedPlanVisits);
      return PlanVisit.count();
    }).then(count => {
      res.status(200).json({
        message: "PlanVisits fetched successfully",
        planVisits: fetchedPlanVisits,
        maxPlanVisits: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching PlanVisits Failed!"
      });
    });
};


exports.getPlanVisit = (req, res, next) => {
  PlanVisit.findById(req.params.id).then(planVisit => {
    if (planVisit) {
      res.status(200).json(planVisit);
    } else {
      res.status(404).json({ message: 'PlanVisit not found!' });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: "Fetching PlanVisit Failed!"
      });
    });
};


exports.deletePlanVisit = (req, res, next) => {
  PlanVisit.deleteOne({ _id: req.params.id }).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Deletion Successfull!" });
    } else {
      res.status(401).json({ message: "Not Authorized!" });
    }
    res.status(200).json({ message: "PlanVisit deleted!" });
  }).catch(error => {
    res.status(500).json({
      message: "Fetching PlanVisits Failed!"
    });
  });
};
