import { Response } from 'express';
import { ERROR_MESSAGES } from '~/constants/errorMessages';
import User from '~/models/user';
import Vendor, { IVendor } from '~/models/vendor';
import { logActivity } from '~/services/activity-logger.service';
import { TAuthenticatedRequest } from '~/types/express';
import { validateWithZod } from '~/utils/errorHandling';
import { updateVendorSchema } from '~/validations/vendor.schema';

export const updateVendor = async (
  req: TAuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const validatedData = await validateWithZod(updateVendorSchema, req.body);

    const { vendorId, _id, ...updates } = validatedData;
    const id = vendorId || _id;

    const vendor = await Vendor.findOne({ _id: id });
    if (!vendor) {
      res.status(400).json({ error: 'Vendor not found' });
    }

    if (vendor && updates.phone && updates.phone !== vendor.phone) {
      const vendorWithPhone = await Vendor.findOne({ _id: { $ne: id }, phone: updates.phone });
      if (vendorWithPhone) {
        res.status(400).json({ error: 'Phone number already exists for another vendor' });
      }
    }

    const updatedData = await Vendor.updateOne({ _id: id }, { $set: updates });
    if (updatedData.modifiedCount === 0) {
      res.status(400).json({
        message: ERROR_MESSAGES.somethingWentWrong || 'No changes made',
      });
    }

    const updatedVendor = (await Vendor.findById(id)) as IVendor | null;
    const userId = req.user?._id;
    if (userId && updatedVendor) {
      const user = await User.findById(userId);
      await logActivity({
        type: 'update_vendor',
        moduleID: String(updatedVendor._id),
        activity: `Vendor ${updatedVendor.full_name} updated by ${user?.full_name || 'User'}.`,
        activistId: userId as string,
      });
    }

    res.status(200).json({
      message: 'Vendor updated successfully',
      vendor: {
        _id: updatedVendor?._id,
        full_name: updatedVendor?.full_name,
        email: updatedVendor?.email,
        phone: updatedVendor?.phone,
        address: updatedVendor?.address,
        to_pay: updatedVendor?.to_pay,
        opening_balance: updatedVendor?.opening_balance,
      },
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
