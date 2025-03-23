import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

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

                let formattedData = [];
                let total = 0;

                data.forEach(item => {
                    formattedData.push({ name: item.date, value: item.count });
                    total += item.count; // Tính tổng số user
                });

                setChartData(formattedData);
                setTotalUsers(total);
            })
            .catch((error) => console.error("Lỗi khi lấy thống kê người dùng:", error));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Thống kê người dùng đăng ký</h2>

            {/* Chọn số ngày thống kê */}
            <div className="flex justify-center gap-4 mb-6">
                <label className="text-lg">Chọn số ngày:</label>
                <select
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
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
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
            </div>

            {/*/!* Biểu đồ đường *!/*/}
            {/*<div className="flex justify-center mb-6">*/}
            {/*    <LineChart width={600} height={300} data={chartData}>*/}
            {/*        <XAxis dataKey="name" />*/}
            {/*        <YAxis />*/}
            {/*        <Tooltip />*/}
            {/*        <Line type="monotone" dataKey="value" stroke="#FF8042" strokeWidth={2} />*/}
            {/*    </LineChart>*/}
            {/*</div>*/}

            {/*/!* Biểu đồ tròn *!/*/}
            {/*<div className="flex justify-center">*/}
            {/*    <PieChart width={300} height={300}>*/}
            {/*        <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">*/}
            {/*            {chartData.map((_, index) => (*/}
            {/*                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />*/}
            {/*            ))}*/}
            {/*        </Pie>*/}
            {/*        <Tooltip />*/}
            {/*        <Legend />*/}
            {/*    </PieChart>*/}
            {/*</div>*/}
        </div>
    );
};

export default UserStatistics;
