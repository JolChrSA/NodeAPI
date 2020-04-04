const router = require('express').Router();
const authToken = require('../middleware/authToken') 
const PostList = require('../model/PostList');

//Add Post
router.post('/AddPost' ,authToken,async(req,res)=> {

    const post =  new PostList({
        postName : req.body.postName,
        postAddress: req.body.postAddress,
        completed: req.body.completed
        })
    try {
        const postList = await post.save();
        res.send(postList);
    } catch (error) {
       res.status(400).send({message:error.message}) 
    }
})

//Post List
router.get('/postList' ,authToken,async(req,res)=> {
    try {
       await PostList.find({}).then((post) => {
            res.send(post)
        })
    } catch (error) {
       res.status(400).send({message:error.message}) 
    }
})

//Filter Post List
router.get('/filterAddress' ,authToken,async(req,res)=> {
    const query = req.query 
    try {   
       await PostList.find({postAddress :query.postAddress , completed: query.completed}).then((post) => {
            res.send(post)
        })
    } catch (error) {
       res.status(400).send({message:error.message}) 
    }
})

 //Sorting Post List
 router.get('/sort/List' ,authToken,async(req,res)=> {
  const sortList = {createdAt : -1}
    try {   
       await PostList.find({}).sort(sortList).then((post) => {
            res.send(post)
        })
    } catch (error) {
       res.status(400).send({message:error.message}) 
    }
})

 //Paging Post List
 router.get('/Paging/List' ,authToken,async(req,res)=> {
    const limit = parseInt(req.query.limit) || 1
    const skip = parseInt(req.query.skip)
      try {   
         await PostList.find({}).limit(limit).skip(skip).then((post) => {
              res.send(post)
          })
      } catch (error) {
         res.status(400).send({message:error.message}) 
      }
  })

  //New Pagination Request 
  router.get('/Page/List', authToken,async(req,res) => {
       await PostList.paginate(req.body.pageNo,(err, response) => {
            if (err) {
                return res.status(500).json({
                    message : "Error en aplicacion",
                    error : err
                });
            }
            return res.status(200).json(response);
        })
  })

module.exports = router;