const fs = require('fs')
//const sightengine = require('sightengine')(seApi.apiUser, seApi.apiSecret)
const multer = require('multer')
const crypto = require('crypto')
//const fs = require('fs')
const path = require('path')

module.exports = app => {

  const storage = multer.diskStorage({
    destination: './temp',
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err);

        cb(undefined, raw.toString('hex') + path.extname(file.originalname));
      })
    }
  })

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 2000000
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(gif|jpe?g|png)$/i)) {
        return cb(new Error('File must be an image'))
      }
      // cb(new Error('File must be an image'))
      cb(undefined, true)
    }
  }).single('file') //this should be single

  const uploadPicture = (req, res) => {
    // console.log(req)
    upload(req, res, err => {
      // console.log(err)
      if (err instanceof multer.MulterError) {
        return res.status(400).send(err.message)
      } else if (err) {
        return res.status(500).send(err.message)
      }
      const filePath = req.file.filename
      return res.status(200).json({
        filePath
      })
    })
  }

  const moveFile = (fileName, newFolder) => {

    return new Promise((resolve, reject) => {
      var oldPath = './temp/' + fileName
      var newPath = `./uploads/${newFolder}/${fileName}`

      fs.rename(oldPath, newPath, function (err) {
        if (err) {
          console.log(err)
          reject('Oops... Something went wrong.')
        }
        resolve()
      })
    })
  }

  // sightengine.check(['nudity'])
  //   .set_url(path.join(req.file.path))
  //   .then((result) => {
  //   if(result.nudity.safe >= result.nudity.partial && result.nudity.safe >= result.nudity.raw) {
  //       return res.status(200).json({ error: false, message: 'Success ! your image was upload successfully'})
  //   } else {
  //     fs.unlinkSync(path.join(req.file.path));
  //     return res.status(400).json({ error: true, message: 'Error ! your image contain nudity content !'})
  //   }
  // }).catch(function(err) {
  //   console.log(err)
  //   return res.status(500).send(err)
  // })
  //res.send()
  return {
    uploadPicture,
    moveFile
  }
}