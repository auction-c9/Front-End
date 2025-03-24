import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { format } from "date-fns";

const TransactionStatistics = () => {
    const [chartData, setChartData] = useState([]);
    const [days, setDays] = useState(7); // Mặc định 7 ngày
    const [totalAmount, setTotalAmount] = useState(0); // Tổng tiền giao dịch

    useEffect(() => {
        fetchStatistics();
    }, [days]);

    const fetchStatistics = () => {
        const token = localStorage.getItem("token");
        axios.get(`http://localhost:8080/api/admin/transaction-statistics?days=${days}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                console.log("Dữ liệu API trả về:", response.data);

                const data = response.data;
                if (!Array.isArray(data) || data.length === 0) {
                    console.warn("API không có dữ liệu giao dịch!");
                    setTotalAmount(0);
                    setChartData([]);
                    return;
                }

                let dateMap = {};
                let total = 0;
                let today = new Date();

                // Tạo danh sách ngày
                for (let i = 0; i < days; i++) {
                    let date = new Date();
                    date.setDate(today.getDate() - i);
                    let formattedDate = format(date, "yyyy-MM-dd"); // Định dạng ngày API
                    dateMap[formattedDate] = 0; // Mặc định = 0
                }

                // Gán dữ liệu từ API vào danh sách
                data.forEach(({ date, totalAmount }) => {
                    let formattedDate = format(new Date(date), "yyyy-MM-dd");
                    if (dateMap.hasOwnProperty(formattedDate)) {
                        dateMap[formattedDate] = Number(totalAmount) || 0;
                    }
                    total += Number(totalAmount) || 0;
                });

                console.log("Dữ liệu sau khi xử lý:", dateMap);
                console.log("Tổng tiền giao dịch:", total);

                // Chuyển thành mảng để hiển thị biểu đồ
                const formattedData = Object.keys(dateMap)
                    .map(date => ({ name: format(new Date(date), "dd/MM/yyyy"), value: dateMap[date] }))
                    .reverse();

                setTotalAmount(total);
                setChartData(formattedData);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy thống kê giao dịch:", error);
                setTotalAmount(0);
                setChartData([]);
            });
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Thống kê giao dịch</h2>

            {/* Chọn số ngày thống kê */}
            <div className="flex justify-center gap-4 mb-6">
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

            {/* Tổng số tiền giao dịch */}
            <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-blue-600">
                    {totalAmount ? totalAmount.toLocaleString("vi-VN") : "0"} VNĐ
                </h3>
                <p className="text-gray-500">Tổng giao dịch trong {days} ngày</p>
            </div>

            {/* Biểu đồ cột */}
            <div className="flex justify-center mb-6">
                <BarChart width={600} height={300} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 16 }} />
                    <YAxis />
                    <Tooltip cursor={{ fill: "transparent" }} />
                    <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
            </div>
        </div>
    );
};

export default TransactionStatistics;
