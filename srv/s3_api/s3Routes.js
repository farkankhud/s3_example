const AWS = require('aws-sdk');
const xlsx = require('xlsx');
const express = require('express');
const router = express.Router();
const cds = require('@sap/cds')




const s3 = new AWS.S3();



router.get('/read-all-excel', (req, res) => {
  const bucketName = 'capm';

  const params = {
      Bucket: bucketName
  };

  

  s3.listObjectsV2(params, (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error listing objects in the S3 bucket');
      }

      const files = data.Contents.filter(obj => obj.Key.endsWith('.xlsx'));

      console.log(files)



      const filePromises = files.map(file => {
          return new Promise((resolve, reject) => {
              const params = {
                  Bucket: bucketName,
                  Key: file.Key
              };

              s3.getObject(params, (err, data) => {
                  if (err) {
                      console.error(err);
                      reject(err);
                  } else {
                      const workbook = xlsx.read(data.Body, { type: 'buffer' });
                      const sheetName = workbook.SheetNames[0];
                      const sheet = workbook.Sheets[sheetName];
                      const jsonData = xlsx.utils.sheet_to_json(sheet);


                    //   INSERT Will Come HERE start


                      
                    //   INSERT Will Come HERE end


                      const moveParams = {
                            Bucket: 'capm',
                            CopySource: 'capm/'+file['Key'],
                            Key: 'archive/'+file['Key']
                        };
                    
                        s3.copyObject(moveParams,(copyErr,copyData) => {

                            if (copyErr) {
                                console.error('Error copying file to archive:', copyErr);

                            }else{
                                console.log('File copied to archive successfully:', copyData);

                                const deleteParams = {
                                    Bucket: 'capm',
                                    Key: file['Key']
                                };

                                s3.deleteObject(deleteParams,(deleteErr,deleteData) => {

                                    if (deleteErr) {
                                        console.error('Error deleting original file:', deleteErr);
                                        // Handle error
                                    } else {
                                        console.log('Original file deleted successfully:', deleteData);

                                        resolve(jsonData);
                                    }
                                })




                            }

                        })


                      
                 
                  }
              });
          });
      });

      Promise.all(filePromises)
          .then(results => {

              res.json(results);
          })
          .catch(error => {
              console.error(error);
              res.status(500).send('Error reading Excel files from S3');
          });
  });

});

module.exports = router;
