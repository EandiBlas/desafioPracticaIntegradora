import {messagesModel} from "../models/messages.model.js"

export default class MessagesManager {
    getMessages = async () => {
      try {
        return await messagesModel.find().lean().exec();
      } catch (error) {
        return error;
      }
    }
  
    createMessage = async (message) => {
      try {
        return await messagesModel.create(message);
      } catch (error) {
        return error;
      }
    }
  }