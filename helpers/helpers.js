const util = require('util')
const gc = require('../config/')
const bucket = gc.bucket('jsimage')//bucket name di google drive
const path = require('path')
const fs = require("fs")//untuk remove picture yang telah di uplaod

const { format } = util

//promise dibuat langsung di jalankan, karena itu tidak perlu then untuk resolve dan catch untuk error
const uploadImage = (file) => new Promise((resolve, reject) => {
  //console.log(file);
  const {filename} = file;
  const picture = path.join(__dirname,'../uploads/',filename);

  //ini peruntah untuk uplaod
  bucket.upload(picture);

  //ini yang di kirim ke return
  const publicUrl = format(
    `https://storage.googleapis.com/${bucket.name}/${filename}`
  )


  //ini untuk remove picture di nodejs, setelah di upload
  //fs.unlinkSync(picture)

  resolve(publicUrl)

  reject(err=>(err))

})

module.exports = uploadImage
