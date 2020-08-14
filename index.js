const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')

const uploadImage = require('./helpers/helpers')

const app = express()

const multerMid = multer({
  //storage: multer.memoryStorage(),
  storage:multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const original = file.originalname; //original name yg di upload
      const ext = original.substr(original.length - 5);//ambil 5 string terakhir pasti itu sudah termasuk extension
      const regex = /[^\w\s]/g;//temukan selain word/kata atau whitepsace
      const dot = ext.search(regex);
      cb(null, uniqueSuffix + ext.substr(dot));//ambil setelah . sebagai extension
    }
  }),
  limits: {
    // no larger than 5mb.
    fileSize: 5 * 1024 * 1024,
  },
});

app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/uploads', async (req, res, next) => {
  try {
    const myFile = req.file
    const imageUrl = await uploadImage(myFile)

    res
      .status(200)
      .json({
        message: "Upload was successful",
        data: imageUrl
      })
  } catch (error) {
    next(error)
  }
})

app.use((err, req, res, next) => {
  res.status(500).json({
    error: err,
    message: 'Internal server error!',
  })
  next()
})

app.listen(9001, () => {
  console.log('app now listening for requests!!!')
})

