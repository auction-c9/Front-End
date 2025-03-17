import { GoogleLogin } from '@react-oauth/google';
import  jwtDecode  from 'jwt-decode';


<GoogleLogin
    onSuccess={async (credentialResponse) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });

            if (!response.ok) throw new Error('Google login failed');

            const { jwt, customerId } = await response.json();

            // Lưu thông tin vào localStorage và cập nhật context
            localStorage.setItem('token', jwt);
            if (customerId) {
                localStorage.setItem('customerId', customerId);
            }

            // Cập nhật trạng thái auth và chuyển hướng
            const decoded = jwtDecode(jwt);
            setUser({ username: decoded.sub });
            setToken(jwt);
            navigate('/');

        } catch (error) {
            console.error('Lỗi đăng nhập Google:', error);
            setError('Đăng nhập bằng Google thất bại');
        }
    }}
    onError={() => {
        setError('Đăng nhập Google không thành công');
    }}
/>
