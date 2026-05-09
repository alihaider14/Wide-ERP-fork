import { Request, Response } from 'express';
import { validateWithZod } from '~/utils/errorHandling';
import { updateUserSchema } from '~/validations/user.schema';
import { ERROR_MESSAGES } from '~/constants/errorMessages';
import { TUser } from '~/types/user';
import User from '~/models/user';
import { generatePassword } from '~/utils/authenticate';

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = await validateWithZod(updateUserSchema, req.body);

    const { full_name, email, phone, designation, password, _id } =
      validatedData;

    const user = await User.findById(_id);

    if (!user) {
      res.status(400).json({ error: ERROR_MESSAGES.user });
      return;
    }

    const updates: Partial<TUser> = {};

    if (full_name) updates.full_name = full_name;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (designation) updates.designation = designation;
    if (password) updates.password = await generatePassword(password);

    const updatedData = await User.updateOne(
      {
        _id,
      },
      {
        $set: updates,
      }
    );

    if (updatedData.modifiedCount > 0) {
      res.status(200).json({
        user: { ...user.toObject(), ...updates },
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
