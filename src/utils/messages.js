const messages = {
    auth: {
        loginSuccess: 'Đăng nhập thành công',
        loginFailed: 'Sai tài khoản hoặc không phải admin',
        wrongPassword: 'Mật khẩu sai',
        tokenInvalid: 'Token không hợp lệ hoặc hết hạn',
        tokenMissing: 'Không có token',
        unauthorized: 'Không có quyền truy cập',
        loginError: 'Lỗi đăng nhập'
    },
    common: {
        serverError: 'Đã xảy ra lỗi máy chủ',
        validationError: 'Dữ liệu không hợp lệ',
        forbidden: 'Bạn không được phép thực hiện hành động này',
    },
};

module.exports = messages;
