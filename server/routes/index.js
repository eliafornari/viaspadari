exports.index = function(req, res){
  res.render('index');
};


exports.partials = function (req, res) {
  res.render('index');
};


exports.robots = function (req, res) {
  // var name = req.params.name;
  res.render('robots');
  // res.render('partials/' + name);

};
