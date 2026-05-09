import { Request, Response } from 'express';
import { validateWithZod } from '~/utils/errorHandling';
import { updateUserAccessSchema } from '~/validations/user.schema';
import { ERROR_MESSAGES } from '~/constants/errorMessages';
import User from '~/models/user';

export const updateUserAccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = await validateWithZod(updateUserAccessSchema, req.body);

    const { _id, access } = validatedData;

    const user = await User.findById(_id);

    if (!user) {
      res.status(400).json({ error: ERROR_MESSAGES.user });
      return;
    }

    const updatedData = await User.updateOne(
      { _id },
      { $set: { access } }
    );

    if (updatedData.modifiedCount > 0) {
      res.status(200).json({
        user: { ...user.toObject(), access },
      });
    } else {
      res.status(400).json({
        message: ERROR_MESSAGES.somethingWentWrong,
      });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};