const { Task } = require('./../models');

exports.list = async (req, res, _next) => {
  const tasks = req.query.completed == 'true'
    ? await Task.findAll({ order: [['id', 'DESC']], where: { completed: true }})
    : await Task.findAll({ order: [['id', 'DESC']] })

  res.render('tasks', {
    title: 'Todo List',
    tasks: tasks || []
  });
};

exports.create = async (req, res, next) => {
  if (!req.body || !req.body.name) return next(new Error('No data provided.'));
  const task = await Task.create({ name: req.body.name,
                                   createTime: new Date(),
                                   completed: false });

  if (!task) return next(new Error('Failed to save.'));
  console.info('Added %s with id=%s', task.name, task._id);
  res.redirect('/tasks');
}

exports.toggle = async (req, res, next) => {
  if (!req.body || !req.body.id) return next(new Error('Id is required'));
  const task = await Task.findByPk(req.body.id);
  if (!task) return next(new Error('Not found.'));

  await task.update({ completed: !task.completed });
  res.redirect('/tasks');
}

exports.delete = async (req, res, next) => {
  if (!req.body || !req.body.id) return next(new Error('Id is required'));
  const task = await Task.destroy({ where: { id: req.body.id }});

  res.redirect('/tasks');
}
