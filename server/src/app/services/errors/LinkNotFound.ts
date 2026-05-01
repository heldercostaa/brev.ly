import { AppError } from '@/errors/AppError.ts';
import {
  LINK_NOT_FOUND_ERROR_CODE,
  LINK_NOT_FOUND_ERROR_MESSAGE,
} from '@/errors/error-responses.ts';

export class LinkNotFound extends AppError {
  constructor() {
    super(LINK_NOT_FOUND_ERROR_MESSAGE, 404, LINK_NOT_FOUND_ERROR_CODE);
  }
}
