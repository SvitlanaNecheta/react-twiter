// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()


 const {Post}= require('../class/post')

//==========================================================
//router.get створює нам один ендпоінт
//==========================================================
router.post('/post-create', (req, res) => {
  try{
    const {username, text, postId}=req.body

    if(!username || !text){
      return res.status(400).json({
        message:
        'Потрібно передати всі данні для сттворення поста',
      })
    }
    let post = null
    console.log(postId,'PostID')

    if(postId){
      post = Post.getByID(Number(postId))
      console.log('POST',post)

      if(!post){
        return res.status(400).json({
          message:
          'ПОСТ З ТАКИМ ID НЕ ІСНУЄ!'
        })
      }
    }
    const newPost = Post.create(username, text, post)
    return res.status(200).json({
      post: {
        id: newPost.id,
        text: newPost.text,
        username: newPost.username,
        date: newPost.date,
      },
    })

  }catch(err){
    return res.status(400).json({
      message: err.message,
    })
  }
})

//==========================================================
router.get('/post-list', (req, res) => {
  try{
    const list = Post.getList()

    if(list.length === 0){
      return res.status(200).json({
        list: [],
      })
    }

    return res.status(200).json({
      list: list.map(({id, username, text, date})=>({
        id,
        username,
        text,
        date,
      })),
    })

  }catch(err){
    return res.status(400).json({
      message: err.message,
    })
  }
})

//==========================================================
router.get('/post-item', (req, res) => {
  try{
    const {id} = req.query

    if(!id){
      return res.status(400).json({
       message: 'Потрібно передати ID поста',
      })
    }
    const post =Post.getByID(Number(id))
    if(!post){
      return res.status(400).json({
        message:
        'ПОСТ З ТАКИМ ID НЕ ІСНУЄ!' 
      })
    }
    return res.status(200).json({
    post: {
      id: post.id,
      text: post.text,
      username: post.username,
      date: post.date,

      reply: post.reply.map((reply)=>({
        id:reply.id,
        text:reply.text,
        username: reply.username,
        date: reply.date,
        
      })),
    },
    })

  }catch(err){
    return res.status(400).json({
      message: err.message,
    })
  }
})
// Експортуємо глобальний роутер
module.exports = router
