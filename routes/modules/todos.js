const express = require('express');
const router = express.Router();

const Todo = require('../../models/todo');

router.get('/new', (req, res) => {
  return res.render('new');
});

router.post('/', (req, res) => {
  const name = req.body.name;
  const userId = req.user._id;

  return Todo.create({ name, userId })
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err));
});

router.get('/:id', (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;
  return Todo.findOne({ _id, userId })
    .lean()
    .then((todo) => res.render('detail', { todo }))
    .catch((err) => console.log(err));
});

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;
  return Todo.findOne({ _id, userId })
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch((err) => console.log(err));
});

router.put('/:id', (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;
  const { name, isDone } = req.body;
  return (
    Todo.findOne({ _id, userId })
      //.lean()
      .then((todo) => {
        todo.name = name;
        todo.isDone = isDone === 'on';
        return todo.save();
      })
      .then(() => res.redirect(`/todos/${_id}`))
      .catch((err) => console.log(err))
  );
});

router.delete('/:id', (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;
  return Todo.findOne({ _id, userId })
    .then((todo) => todo.remove())
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err));
});

module.exports = router;
