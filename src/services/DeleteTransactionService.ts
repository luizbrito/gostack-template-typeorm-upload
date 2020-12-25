import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    if (!this.isValidId(id)) {
      throw new AppError('Id/Route is not valid');
    }

    const transactionRepository = getCustomRepository(TransactionRepository);
    const transaction = await transactionRepository.findOne(id);
    if (!transaction) {
      throw new AppError('Transactions not exist');
    }
    await transactionRepository.delete(id);
  }

  private isValidId(id: string): boolean {
    const pattern = new RegExp(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );

    return pattern.test(id);
  }
}

export default DeleteTransactionService;
