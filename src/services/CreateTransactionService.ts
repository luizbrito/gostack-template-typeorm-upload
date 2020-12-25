import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

enum Type {
  INCOME = 'income',
  OUTCOME = 'outcome',
}
class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const createCategoryService = new CreateCategoryService();

    const categoryBase = await createCategoryService.execute({
      title: category,
    });

    const transactionRepository = getCustomRepository(TransactionRepository);

    const { total } = await transactionRepository.getBalance();
    if (type === Type.OUTCOME && total < value) {
      throw new AppError(
        'Can not create outcome transaction without a valid balance',
        400,
      );
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: categoryBase.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
