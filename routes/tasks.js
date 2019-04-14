const { Task } = require('./../models');

exports.list = async (_req, res, _next) => {
  const tasks = await Task.findAll();

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
