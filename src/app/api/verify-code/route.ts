import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user';


export async function POST(request:Request){
    await dbConnect()

    try {
        const {username,code} = await request.json()

        const decodedUsername = decodeURI(username);
        const user = await UserModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json({
                success: false,
                message: 'User not found',
            },
            { status: 500 });
        }
        const isCodeValid = user.verifyCode === code
        const isNotexpiredCode = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isNotexpiredCode){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: 'User verified successfully',
            },
            { status: 200 });
        }
        else if(!isCodeValid){
            return Response.json({
                success: false,
                message: 'incorrect verification code',
            },
            { status: 400 });
        }
        else {
            return Response.json({
                success: false,
                message: 'Verification code expired. please signup again to get new code',
            },
            { status: 400 });
        }
        
    } catch (error) {
        console.error('Error checking username:', error);
        return Response.json(
        {
            success: false,
            message: 'Error verifing code',
        },
        { status: 500 });
    }
    

}