import * as fs from 'fs';

export const deleteFile = (filePath: string): void => {
  //checking wheather the file is available in direactory or not

  if (fs.existsSync(filePath)) {
    try {
      // Delete the file
      fs.unlinkSync(filePath);
      console.log(`File ${filePath} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting file: ${error}`);
    }
  } else {
    console.error(`File ${filePath} does not exist.`);
  }
};
