import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { format } from "date-fns"; // Import thư viện format ngày

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const UserStatistics = () => {
    const [chartData, setChartData] = useState([]);
    const [days, setDays] = useState(7); // Mặc định thống kê 7 ngày gần nhất
    const [totalUsers, setTotalUsers] = useState(0); // Tổng số user đăng ký

    useEffect(() => {
        fetchStatistics();
    }, [days]); // Gọi API khi thay đổi số ngày

    const fetchStatistics = () => {
        const token = localStorage.getItem("token");

        axios.get(`http://localhost:8080/api/admin/user-statistics?days=${days}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                const data = response.data; // API trả về [{date: "2025-03-17", count: 5}, {...}]

                // Tạo danh sách 7 ngày gần nhất
                let dateMap = {};
                let total = 0;
                let today = new Date();

                for (let i = 0; i < days; i++) {
                    let date = new Date();
                    date.setDate(today.getDate() - i);
                    let formattedDate = format(date, "dd/MM/yyyy"); // Format ngày đúng định dạng
                    dateMap[formattedDate] = 0; // Mặc định là 0
                }

                // Gán dữ liệu từ API vào danh sách
                data.forEach(item => {
                    let formattedDate = format(new Date(item.date), "dd/MM/yyyy");
                    dateMap[formattedDate] = item.count;
                    total += item.count;
                });

                // Chuyển thành mảng để hiển thị và sắp xếp theo thứ tự ngày
                const formattedData = Object.keys(dateMap)
                    .map(date => ({ name: date, value: dateMap[date] }))
                    .reverse(); // Đảo ngược để ngày gần nhất nằm bên phải

                setChartData(formattedData);
                setTotalUsers(total);
            })
            .catch((error) => console.error("Lỗi khi lấy thống kê người dùng:", error));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-semibold text-center mb-8">Thống kê người dùng đăng ký</h2>

            {/* Chọn số ngày thống kê */}
            <div className="flex justify-center gap-4 mb-9">
                <label className="text-lg">Chọn số ngày:</label>
                <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="p-2 border rounded-lg"
                >
                    {[7, 14, 30, 90].map((d) => (
                        <option key={d} value={d}>{d} ngày</option>
                    ))}
                </select>
            </div>

            {/* Tổng số người dùng đăng ký */}
            <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-blue-600">{totalUsers}</h3>
                <p className="text-gray-500">Người dùng mới trong {days} ngày</p>
            </div>

            {/* Biểu đồ cột */}
            <div className="flex justify-center mb-6">
                <BarChart width={600} height={300} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 16 }} angle={0} textAnchor="end" />
                    <YAxis allowDecimals={false} />
                    <Tooltip cursor={{ fill: "transparent" }} />
                    <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
            </div>
        </div>
    );
};

export default UserStatistics;
