require('dotenv').config()

exports.checkActivation = async (req, res, next) => {

    const activationUrl = `${req.protocol}://${req.get('host')}/api/v1/account/activate`
    const requestReferer = req.get('referer')

    if (requestReferer === activationUrl) {

        const cookieOptions = {
            expires: new Date(Date.now() + 0.5 * 60 * 1000),
            httpOnly: true,
        };

        res.cookie('activate', 'true', cookieOptions)

        if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    }
    next()
}