import { AppError } from '@/errors/AppError.ts';
import {
  SHORT_CODE_EXISTS_ERROR_CODE,
  SHORT_CODE_EXISTS_ERROR_MESSAGE,
} from '@/errors/error-responses.ts';

export class ShortCodeAlreadyExists extends AppError {
  constructor() {
    super(SHORT_CODE_EXISTS_ERROR_MESSAGE, 409, SHORT_CODE_EXISTS_ERROR_CODE);
  }
}
