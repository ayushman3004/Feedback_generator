import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user';
import { z } from 'zod';
import { usernameValidation } from '@/Schemas/signUpSchema';
import { NextResponse } from 'next/server';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    // ✅ FIX 1: Handle missing username properly
    if (!username) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username is required',
        },
        { status: 400 }
      );
    }

    console.log("username received:", username);

    // ✅ FIX 2: Validate only real value (no empty string fallback)
    const result = UsernameQuerySchema.safeParse({ username });

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid username',
        },
        { status: 400 }
      );
    }

    const { username: validUsername } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username: validUsername,
      isVerified: true,
    });

    // ✅ FIX 3: Better status code
    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 409 } // Conflict
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Error checking username',
      },
      { status: 500 }
    );
  }
}