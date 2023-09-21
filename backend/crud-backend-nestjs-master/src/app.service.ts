import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Crud } from './schema/crud.schema';
import { Model } from 'mongoose';
import { Simpleresponse } from './simpleresponse/simpleresponse.interface';
import * as path from 'path';
import { updateData } from './app.interface';
import * as fs from 'fs';
import { deleteFile } from './utilities/deleteFile';

@Injectable()
export class AppService {
  constructor(@InjectModel(Crud.name) private crudModel: Model<Crud>) {}
  async getAllData(page, pageSize, userid): Promise<Simpleresponse> {
    const data = await this.crudModel
      .find({ UserId: userid })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const totalItems = await this.crudModel.countDocuments({ UserId: userid });

    return {
      success: true,
      data,
      page,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  async create(body, file, userid: string): Promise<Simpleresponse> {
    const { title, description, email } = body;
    const image = file.filename;

    // console.log(image, file);
    const data = await new this.crudModel({
      title,
      description,
      filePath: image,
      UserId: userid,
      email,
    });
    await data.save();
    return { success: true, message: 'List added', data };
  }

  async update(id: string, body, file): Promise<Simpleresponse> {
    const { title, description } = body;

    const foundData = await this.crudModel.findById(id);
    //creting the path for the delete file
    const updateData: updateData = {
      title,
      description,
    };
    if (file) {
      const filePath = path.join(__dirname, '../uploads', foundData.filePath);
      deleteFile(filePath);
      updateData.filePath = file.filename;
    }

    const data = await this.crudModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    const result = await data.save();

    return {
      success: true,
      message: 'List updated successfully',
      data: result,
    };
  }

  async delete(id): Promise<Simpleresponse> {
    const data = await this.crudModel.findByIdAndDelete(id);

    if (data) {
      // Assuming your data object contains the file path, e.g., data.filePath
      const filePath = path.join(__dirname, '../uploads', data.filePath);

      deleteFile(filePath);
    }
    return { success: true, message: 'List deleted successfully' };
  }

  async getAllUsers() {
    try {
      const users = await this.crudModel.distinct('email');
      console.log(users);
      return users;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        { message: 'Something went wrong', status: 500 },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
