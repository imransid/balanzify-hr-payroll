import { NotFoundException } from "@nestjs/common";
import { createWriteStream, mkdirSync, stat,readdir, existsSync, rmdirSync, unlinkSync } from "fs";
import { join } from "path";
import { finished } from "stream/promises";
import { Logger } from '@nestjs/common';

const logger = new Logger('Utils: Upload  File'); 

export const uploadFileStream = async (readStream, uploadDir, filename, mimetype?) => {
  const fileName = filename;
  const filePath = join(uploadDir, fileName);
  logger.log(`line: 12 Uploaded file path: ${filePath}`);
  try{
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    const inStream = readStream();
    const outStream = createWriteStream(filePath);
    outStream.on('error', (err) => {
      console.error('Stream error:', err);
      throw new Error(err.message)
    });
    inStream.pipe(outStream);
    await finished(outStream)
      .then(() => {
        logger.log('line: 20 file uploaded successfully');
      })
      .catch((err) => {
        logger.log(`line: 23 ${err.message}`);
        throw new NotFoundException(err.message);
      });
      return filePath;
  } catch(e){
    logger.log(`line: 20 ${e}`);
  }
};

export const  deleteFileAndDirectory = (filePath:string,uploadDir?: string,uploadRoot?:string) => {
  try{
      if(existsSync(filePath)){
        stat(filePath, (error, stat) => {
          if (error) throw new Error('File do not exist');
          if(stat.isFile()){
            unlinkSync(filePath); // Step 1:  Delete file
            // Step 2:  Delete Directories
            if (existsSync(uploadDir)) {
              readdir(uploadDir, function(err, files) {
                if (err) {
                  throw new Error(`Dir ${uploadDir} not exist`);
                } else {
                  if (!files.length) {// If no  file exist
                    rmdirSync(uploadDir);
                  }
                }
              });
            }
            if (existsSync(uploadRoot)) {
              readdir(uploadRoot, function(err, files) {
                if (err) {
                  throw new Error(`Dir ${uploadRoot} not exist`);
                } else {
                  if (!files.length) {
                    rmdirSync(uploadRoot);
                  }
                }
              });
            }
          }
        })
      }
    } catch(e){
      logger.log(`line: 20 ${e}`);
    }
}