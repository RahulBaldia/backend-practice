import { Router } from 'express';
import protect from '../middlewares/authMiddleware.js';
import {
  createChat,
  getUserChats,
  deleteChat,
  updateChatTitle,
  getChatMessages,
} from '../controllers/chatController.js';

const router = Router();

router.use(protect);

router.post('/', createChat);
router.get('/', getUserChats);
router.delete('/:id', deleteChat);
router.patch('/:id/title', updateChatTitle);
router.get('/:id/messages', getChatMessages);

export default router;